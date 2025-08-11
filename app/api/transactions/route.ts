import { transferedTransactionHeaderSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = transferedTransactionHeaderSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.format() },
      { status: 400 }
    );
  }

  const data = validation.data;

  // 1) Contact
  const contact = await prisma.contact.findUnique({
    where: { id: data.contactId },
  });
  if (!contact)
    return NextResponse.json({ error: "Invalid contact id" }, { status: 404 });

  // 2) Gold ids
  for (const d of data.goldDetails || []) {
    const gold = await prisma.gold.findUnique({ where: { id: d.goldId } });
    if (!gold)
      return NextResponse.json(
        { error: `Invalid gold id: ${d.goldId}` },
        { status: 404 }
      );
  }

  // 3) Jewelry ids (only export)
  if (data.isExport) {
    for (const d of data.jewelryDetails || []) {
      const j = await prisma.jewelry.findUnique({ where: { id: d.jewelryId } });
      if (!j)
        return NextResponse.json(
          { error: `Invalid jewelry id: ${d.jewelryId}` },
          { status: 404 }
        );
    }
  }

  const buildJewelryCreateData = (
    temp: any,
    createdByTransactionId: number,
    createdAt: Date
  ) => ({
    name: temp.name,
    typeId: temp.typeId,
    categoryId: temp.categoryId,
    goldWeight: temp.goldWeight, // Decimal nhận number/string
    gemWeight: temp.gemWeight ?? 0,
    totalWeight: temp.totalWeight ?? temp.goldWeight,
    madeIn: temp.madeIn ?? "Việt Nam",
    size: temp.size ?? null,
    description: temp.description ?? null,
    supplierId: temp.supplierId ?? null,
    reportProductCode: temp.reportProductCode ?? null,
    createdAt,
    createdByTransactionId, // set trực tiếp
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      // A) Header
      const header = await tx.transactionHeader.create({
        data: {
          isExport: data.isExport,
          contactId: contact.id,
          note: data.note,
          paymentMethode: data.paymentMethode,
          goldPrice: data.currentGoldPrice,
          createdAt: data.date,
        },
      });

      // B) Gold details (createMany)
      if (data.goldDetails?.length) {
        await tx.goldTransactionDetail.createMany({
          data: data.goldDetails.map((g) => ({
            transactionHeaderId: header.id,
            goldId: g.goldId,
            amount: g.amount,
            weight: g.weight,
            price: g.price,
            discount: g.discount,
            createdAt: data.date,
          })),
        });
      }

      // C) Jewelry
      if (data.isExport) {
        // Export: createMany details
        if (data.jewelryDetails?.length) {
          await tx.jewelryTransactionDetail.createMany({
            data: data.jewelryDetails.map((d) => ({
              transactionHeaderId: header.id,
              jewelryId: d.jewelryId,
              amount: d.amount,
              price: d.price,
              discount: d.discount,
              createdAt: data.date,
            })),
          });
        }
      } else {
        // Import:
        const tempMap = new Map<string, number>();

        // 1) Tạo jewelry mới (những dòng có jewelryTemp)
        for (let i = 0; i < (data.jewelryDetails?.length || 0); i++) {
          const d = data.jewelryDetails[i];
          if (d.jewelryTemp) {
            const created = await tx.jewelry.create({
              data: buildJewelryCreateData(
                d.jewelryTemp,
                header.id,
                data.date as Date
              ),
              select: { id: true },
            });
            if (d.tempId) tempMap.set(d.tempId, created.id);
          }
        }

        // 2) Chuẩn bị mảng detail; validate dòng nào không map được
        const detailRows = (data.jewelryDetails || []).map((d, idx) => {
          const mappedId =
            (d.tempId && tempMap.get(d.tempId)) ||
            (d.jewelryId && d.jewelryId > 0 ? d.jewelryId : undefined);

          if (!mappedId) {
            throw new Error(
              `Dòng trang sức nhập #${
                idx + 1
              }: thiếu jewelryTemp hoặc tempId hợp lệ.`
            );
          }

          return {
            transactionHeaderId: header.id,
            jewelryId: mappedId,
            amount: d.amount,
            price: d.price,
            discount: d.discount,
            createdAt: data.date,
          };
        });

        if (detailRows.length) {
          await tx.jewelryTransactionDetail.createMany({ data: detailRows });
        }
      }

      // D) Payments (createMany, filter > 0)
      const paymentRows =
        (data.payments || [])
          .filter((p) => +p.amount > 0)
          .map((p) => ({
            transactionHeaderId: header.id,
            amount: p.amount,
            type: p.type,
            createdAt: data.date,
          })) ?? [];

      if (paymentRows.length) {
        await tx.paymentDetail.createMany({ data: paymentRows });
      }

      return header;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Transaction failed" },
      { status: 500 }
    );
  }
}
