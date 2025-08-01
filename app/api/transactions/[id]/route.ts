import { transferedTransactionHeaderSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const _params = await params;
  const id = parseInt(_params.id);
  const body = await request.json();
  const validation = transferedTransactionHeaderSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const data = validation.data;

  const transactionHeader = await prisma.transactionHeader.findUnique({
    where: { id },
  });

  if (!transactionHeader) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    );
  }

  // Kiểm tra goldId
  if (data.goldDetails?.length) {
    const goldIds = data.goldDetails.map((g) => g.goldId);
    const existingGolds = await prisma.gold.findMany({
      where: { id: { in: goldIds } },
      select: { id: true },
    });
    const validGoldIds = new Set(existingGolds.map((g) => g.id));

    for (const detail of data.goldDetails) {
      if (!validGoldIds.has(detail.goldId)) {
        return NextResponse.json(
          { error: `Invalid goldId: ${detail.goldId}` },
          { status: 400 }
        );
      }
    }
  }

  // Kiểm tra jewelryId
  if (data.jewelryDetails?.length) {
    const jewelryIds = data.jewelryDetails.map((j) => j.jewelryId);
    const existingJewelry = await prisma.jewelry.findMany({
      where: { id: { in: jewelryIds } },
      select: { id: true },
    });
    const validJewelryIds = new Set(existingJewelry.map((j) => j.id));

    for (const detail of data.jewelryDetails) {
      if (!validJewelryIds.has(detail.jewelryId)) {
        return NextResponse.json(
          { error: `Invalid jewelryId: ${detail.jewelryId}` },
          { status: 400 }
        );
      }
    }
  }

  const contactId = data.contactId;
  if (!contactId) {
    return NextResponse.json({ error: "Invalid contact id" }, { status: 404 });
  }
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
  });
  if (!contact) {
    return NextResponse.json({ error: "Invalid contact id" }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    // Step 1: Delete old details
    await tx.goldTransactionDetail.deleteMany({
      where: { transactionHeaderId: id },
    });
    await tx.jewelryTransactionDetail.deleteMany({
      where: { transactionHeaderId: id },
    });
    await tx.paymentDetail.deleteMany({
      where: { transactionHeaderId: id },
    });

    // Step 2: Update transaction header
    await tx.transactionHeader.update({
      where: { id },
      data: {
        note: data.note,
        isExport: data.isExport,
        contactId: contact.id,
        paymentMethode: data.paymentMethode,
        goldPrice: data.currentGoldPrice,
        createdAt: data.date,
      },
    });

    // Step 3: Recreate payment details
    await tx.paymentDetail.createMany({
      data: data.payments.map((p) => ({
        transactionHeaderId: id,
        amount: p.amount,
        type: p.type,
        createdAt: data.date,
      })),
    });

    // Step 4: Recreate gold details
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

    // Step 5: Recreate jewelry details
    if (data.jewelryDetails?.length) {
      await tx.jewelryTransactionDetail.createMany({
        data: data.jewelryDetails.map((j) => ({
          transactionHeaderId: id,
          jewelryId: j.jewelryId,
          price: j.price,
          discount: j.discount ?? 0,
          amount: j.amount,
          createdAt: data.date,
        })),
      });
    }
  });

  return NextResponse.json({ message: "Transaction updated successfully" });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const _params = await params;
  const transactionHeader = await prisma.transactionHeader.findUnique({
    where: { id: parseInt(_params.id) },
  });
  if (!transactionHeader) {
    return NextResponse.json(
      { error: "Không tìm thấy giao dịch" },
      { status: 404 }
    );
  }
  await prisma.transactionHeader.delete({
    where: { id: parseInt(_params.id) },
  });
  return NextResponse.json(
    { message: "xoá giao dịch thành công" },
    { status: 200 }
  );
}
