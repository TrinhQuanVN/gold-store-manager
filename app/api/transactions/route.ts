import { rawTransactionHeaderSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = rawTransactionHeaderSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.format() },
      { status: 404 }
    );
  }
  const data = validation.data;

  // kiểm tra contactId
  const contact = await prisma.contact.findUnique({
    where: { id: parseInt(data.contact?.id ?? "") },
  });
  if (!contact) {
    return NextResponse.json({ error: "Invalid contact id" }, { status: 404 });
  }

  const transactionHeader = await prisma.transactionHeader.create({
    data: {
      isExport: data.isExport,
      contactId: contact.id,
      note: data.note,
      paymentMethode: data.paymentMethode,
      goldPrice: parseFloat(data.currentGoldPrice),
    },
  });

  //tạo gold transaction detail
  if (data.goldDetails && data.goldDetails.length > 0) {
    data.goldDetails.forEach(async (detail) => {
      const goldId = parseInt(detail.goldId);
      const gold = await prisma.gold.findUnique({ where: { id: goldId } });
      if (!gold) {
        return NextResponse.json({ error: "Invalid gold id" }, { status: 404 });
      }
      const g = await prisma.goldTransactionDetail.create({
        data: {
          transactionHeaderId: transactionHeader.id,
          goldId: parseInt(detail.goldId),
          amount: detail.amount,
          weight: detail.weight,
          price: detail.price,
          discount: detail.discount,
        },
      });
    });

    //tạo jewelry transaction detail
    if (data.jewelryDetails && data.jewelryDetails.length > 0) {
      data.jewelryDetails.forEach(async (detail) => {
        const jewelryId = parseInt(detail.jewelryId);
        const jewelry = await prisma.jewelry.findUnique({
          where: { id: jewelryId },
        });
        if (!jewelry) {
          return NextResponse.json(
            { error: "Invalid jewelry id" },
            { status: 404 }
          );
        }
        const j = await prisma.jewelryTransactionDetail.create({
          data: {
            transactionHeaderId: transactionHeader.id,
            jewelryId: parseInt(detail.jewelryId),
            amount: detail.amount,
            price: detail.price,
            discount: detail.discount,
          },
        });
      });
    }

    //tạo payments
    if (data.payments.length > 0) {
      data.payments.forEach(async (detail) => {
        if (+detail.amount > 0) {
          const p = await prisma.paymentDetail.create({
            data: {
              amount: detail.amount,
              type: detail.type,
              transactionHeaderId: transactionHeader.id,
            },
          });
        }
      });
    }
    //update inStock của jewelry
    return NextResponse.json(transactionHeader, { status: 201 });
  }
}
