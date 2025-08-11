// app/api/transactions/[id]/route.ts
import { transferedTransactionHeaderSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const _params = await params;
  const id = parseInt(_params.id, 10);
  const body = await request.json();

  const validation = transferedTransactionHeaderSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }
  const data = validation.data;

  // Header cũ
  const prevHeader = await prisma.transactionHeader.findUnique({
    where: { id },
    select: { id: true, isExport: true },
  });
  if (!prevHeader)
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    );

  // Contact
  const contact = await prisma.contact.findUnique({
    where: { id: data.contactId },
    select: { id: true },
  });
  if (!contact)
    return NextResponse.json({ error: "Invalid contact id" }, { status: 404 });

  // Validate gold ids tồn tại
  if (data.goldDetails?.length) {
    const goldIds = data.goldDetails.map((g) => g.goldId);
    const existing = await prisma.gold.findMany({
      where: { id: { in: goldIds } },
      select: { id: true },
    });
    const valid = new Set(existing.map((x) => x.id));
    for (const g of data.goldDetails) {
      if (!valid.has(g.goldId))
        return NextResponse.json(
          { error: `Invalid goldId: ${g.goldId}` },
          { status: 400 }
        );
    }
  }

  // Validate jewelry (chỉ khi xuất)
  if (data.isExport && data.jewelryDetails?.length) {
    const jewelryIds = data.jewelryDetails
      .map((j) => j.jewelryId)
      .filter(Boolean) as number[];
    if (jewelryIds.length) {
      const existing = await prisma.jewelry.findMany({
        where: { id: { in: jewelryIds } },
        select: { id: true },
      });
      const valid = new Set(existing.map((j) => j.id));
      for (const d of data.jewelryDetails) {
        if (!d.jewelryId || !valid.has(d.jewelryId)) {
          return NextResponse.json(
            { error: `Invalid jewelryId: ${d.jewelryId}` },
            { status: 400 }
          );
        }
      }
    }
  }

  // Không cho sửa nếu đồ nhập cũ đã dùng ở giao dịch khác
  if (prevHeader.isExport === false) {
    const usedElsewhere = await prisma.jewelry.findMany({
      where: {
        createdByTransactionId: id,
        transactionDetails: { some: { transactionHeaderId: { not: id } } },
      },
      select: { id: true },
    });
    if (usedElsewhere.length > 0) {
      return NextResponse.json(
        {
          error: `Không thể sửa: ${usedElsewhere.length} trang sức đã dùng ở giao dịch khác.`,
        },
        { status: 400 }
      );
    }
  }

  // Helper build data tạo jewelry
  const buildJewelryCreateData = (
    t: any,
    createdByTransactionId: number,
    createdAt: Date
  ) => ({
    name: t.name,
    typeId: t.typeId,
    categoryId: t.categoryId,
    goldWeight: t.goldWeight,
    gemWeight: t.gemWeight ?? 0,
    totalWeight: t.totalWeight ?? t.goldWeight,
    madeIn: t.madeIn ?? "Việt Nam",
    size: t.size ?? null,
    description: t.description ?? null,
    supplierId: t.supplierId ?? null,
    reportProductCode: t.reportProductCode ?? null,
    createdAt,
    createdByTransactionId,
  });

  try {
    // 🔧 NEW (hydrate): nếu là NHẬP, chuẩn hoá để MỖI dòng đều có "temp" (jewelryTemp hoặc hydrate từ jewelryId)
    let unifiedTemps: Array<any> = [];
    if (!data.isExport) {
      const details = data.jewelryDetails || [];
      const needFetchIds = details
        .map((d) => (!d?.jewelryTemp && d?.jewelryId ? d.jewelryId : null))
        .filter((x): x is number => typeof x === "number" && x > 0);

      const olds = needFetchIds.length
        ? await prisma.jewelry.findMany({
            where: { id: { in: needFetchIds } },
            select: {
              id: true,
              name: true,
              typeId: true,
              categoryId: true,
              goldWeight: true,
              gemWeight: true,
              totalWeight: true,
              madeIn: true,
              size: true,
              description: true,
              supplierId: true,
              reportProductCode: true,
            },
          })
        : [];

      const byId = new Map(olds.map((j) => [j.id, j]));

      unifiedTemps = details.map((d, idx) => {
        if (d.jewelryTemp) {
          const t = d.jewelryTemp as any;
          return {
            name: t.name,
            typeId: Number(t.typeId),
            categoryId: Number(t.categoryId),
            goldWeight: Number(t.goldWeight),
            gemWeight: Number(t.gemWeight ?? 0),
            totalWeight: Number(t.totalWeight ?? t.goldWeight),
            madeIn: t.madeIn ?? "Việt Nam",
            size: t.size ?? null,
            description: t.description ?? null,
            supplierId: t.supplierId ?? null,
            reportProductCode: t.reportProductCode ?? null,
          };
        }
        if (d.jewelryId) {
          const j = byId.get(d.jewelryId);
          if (!j) {
            throw new Error(
              `Dòng #${idx + 1}: jewelryId ${
                d.jewelryId
              } không tồn tại để hydrate.`
            );
          }
          return {
            name: j.name,
            typeId: j.typeId,
            categoryId: j.categoryId,
            goldWeight: Number(j.goldWeight),
            gemWeight: Number(j.gemWeight ?? 0),
            totalWeight: Number(j.totalWeight ?? j.goldWeight),
            madeIn: j.madeIn ?? "Việt Nam",
            size: j.size ?? null,
            description: j.description ?? null,
            supplierId: j.supplierId ?? null,
            reportProductCode: j.reportProductCode ?? null,
          };
        }
        throw new Error(`Dòng #${idx + 1}: thiếu jewelryTemp và jewelryId.`);
      });
    }

    await prisma.$transaction(async (tx) => {
      // Xoá details + payments cũ
      await tx.goldTransactionDetail.deleteMany({
        where: { transactionHeaderId: id },
      });
      await tx.jewelryTransactionDetail.deleteMany({
        where: { transactionHeaderId: id },
      });
      await tx.paymentDetail.deleteMany({ where: { transactionHeaderId: id } });

      // Nếu giao dịch cũ là NHẬP → xoá jewelry đã auto-tạo trước đây
      if (prevHeader.isExport === false) {
        await tx.jewelry.deleteMany({ where: { createdByTransactionId: id } });
      }

      // Update header
      await tx.transactionHeader.update({
        where: { id },
        data: {
          note: data.note ?? null,
          isExport: data.isExport,
          contactId: data.contactId,
          paymentMethode: data.paymentMethode,
          goldPrice: data.currentGoldPrice,
          createdAt: data.date,
        },
      });

      // Payments
      const paymentRows = (data.payments || [])
        .filter((p) => +p.amount > 0)
        .map((p) => ({
          transactionHeaderId: id,
          amount: p.amount,
          type: p.type,
          createdAt: data.date,
        }));
      if (paymentRows.length)
        await tx.paymentDetail.createMany({ data: paymentRows });

      // Gold details
      if (data.goldDetails?.length) {
        await tx.goldTransactionDetail.createMany({
          data: data.goldDetails.map((g) => ({
            transactionHeaderId: id,
            goldId: g.goldId,
            price: g.price,
            weight: g.weight,
            discount: g.discount ?? 0,
            amount: g.amount,
            createdAt: data.date,
          })),
        });
      }

      // Jewelry details
      if (data.isExport) {
        // Xuất: dùng jewelry có sẵn
        if (data.jewelryDetails?.length) {
          await tx.jewelryTransactionDetail.createMany({
            data: data.jewelryDetails.map((j) => ({
              transactionHeaderId: id,
              jewelryId: j.jewelryId!, // đã validate ở trên
              price: j.price,
              discount: j.discount ?? 0,
              amount: j.amount,
              createdAt: data.date,
            })),
          });
        }
      } else {
        // 🔧 NEW (import): KHÔNG dùng tempId; tạo jewelry mới theo THỨ TỰ unifiedTemps, sau đó map theo index
        const newIds: number[] = [];
        for (const t of unifiedTemps) {
          const created = await tx.jewelry.create({
            data: buildJewelryCreateData(t, id, data.date as Date),
            select: { id: true },
          });
          newIds.push(created.id);
        }

        // Tạo lại detail theo index mảng
        const details = data.jewelryDetails || [];
        const detailRows = details.map((d, idx) => ({
          transactionHeaderId: id,
          jewelryId: newIds[idx],
          price: d.price,
          discount: d.discount ?? 0,
          amount: d.amount,
          createdAt: data.date,
        }));
        if (detailRows.length) {
          await tx.jewelryTransactionDetail.createMany({ data: detailRows });
        }
      }
    });

    return NextResponse.json({ message: "Transaction updated successfully" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const _params = await params;
  const id = parseInt(_params.id, 10);

  const header = await prisma.transactionHeader.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!header) {
    return NextResponse.json(
      { error: "Không tìm thấy giao dịch" },
      { status: 404 }
    );
  }

  try {
    await prisma.transactionHeader.delete({ where: { id } });
    return NextResponse.json(
      { message: "Xoá giao dịch thành công" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Delete failed" },
      { status: 500 }
    );
  }
}
