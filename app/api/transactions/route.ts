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

  // Kiểm tra contact
  const contact = await prisma.contact.findUnique({
    where: { id: data.contactId },
  });
  if (!contact) {
    return NextResponse.json({ error: "Invalid contact id" }, { status: 404 });
  }

  // Kiểm tra gold id
  for (const detail of data.goldDetails || []) {
    const gold = await prisma.gold.findUnique({
      where: { id: detail.goldId },
    });
    if (!gold) {
      return NextResponse.json(
        { error: `Invalid gold id: ${detail.goldId}` },
        { status: 404 }
      );
    }
  }

  // Kiểm tra jewelry id
  for (const detail of data.jewelryDetails || []) {
    const jewelry = await prisma.jewelry.findUnique({
      where: { id: detail.jewelryId },
    });
    if (!jewelry) {
      return NextResponse.json(
        { error: `Invalid jewelry id: ${detail.jewelryId}` },
        { status: 404 }
      );
    }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const transactionHeader = await tx.transactionHeader.create({
        data: {
          isExport: data.isExport,
          contactId: contact.id,
          note: data.note,
          paymentMethode: data.paymentMethode,
          goldPrice: data.currentGoldPrice,
          createdAt: data.date,
        },
      });

      // Tạo gold transaction detail
      for (const detail of data.goldDetails || []) {
        await tx.goldTransactionDetail.create({
          data: {
            transactionHeaderId: transactionHeader.id,
            goldId: detail.goldId,
            amount: detail.amount,
            weight: detail.weight,
            price: detail.price,
            discount: detail.discount,
            createdAt: data.date,
          },
        });
      }

      // Tạo jewelry transaction detail
      for (const detail of data.jewelryDetails || []) {
        await tx.jewelryTransactionDetail.create({
          data: {
            transactionHeaderId: transactionHeader.id,
            jewelryId: detail.jewelryId,
            amount: detail.amount,
            price: detail.price,
            discount: detail.discount,
            createdAt: data.date,
          },
        });
      }

      // Tạo payments
      for (const detail of data.payments || []) {
        if (+detail.amount > 0) {
          await tx.paymentDetail.create({
            data: {
              amount: detail.amount,
              type: detail.type,
              transactionHeaderId: transactionHeader.id,
              createdAt: data.date,
            },
          });
        }
      }

      return transactionHeader;
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
