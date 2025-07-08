import { transactionTransferSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = transactionTransferSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.format() },
      { status: 404 }
    );
  }
  const data = validation.data;

  // kiểm tra contactId
  const contact = await prisma.contact.findUnique({
    where: { id: data.header.contactId },
  });
  if (!contact) {
    return NextResponse.json({ error: "Invalid contact id" }, { status: 404 });
  }

  const transactionHeader = await prisma.transactionHeader.create({
    data: {
      isExport: data.header.isExport,
      contactId: data.header.contactId,
      totalAmount: data.header.totalAmount,
      note: data.header.note,
      paymentMethode: data.header.paymentMethode,
    },
  });

  console.log(transactionHeader);

  //tạo gold transaction detail
  if (data.goldDetails && data.goldDetails.length > 0) {
    data.goldDetails.forEach(async (detail) => {
      const goldId = detail.goldId;
      const gold = await prisma.gold.findUnique({ where: { id: goldId } });
      if (!gold) {
        return NextResponse.json({ error: "Invalid gold id" }, { status: 404 });
      }
      const g = await prisma.goldTransactionDetail.create({
        data: {
          transactionHeaderId: transactionHeader.id,
          goldId: detail.goldId,
          amount: detail.amount,
          weight: detail.weight,
          price: detail.price,
          discount: detail.discount,
        },
      });
      console.log("g: ", g);
    });
    //tạo jewelry transaction detail
    if (data.jewelryDetails && data.jewelryDetails.length > 0) {
      data.jewelryDetails.forEach(async (detail) => {
        const jewelryId = detail.jewelryId;
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
            jewelryId: detail.jewelryId,
            amount: detail.amount,
            price: detail.price,
            discount: detail.discount,
          },
        });
        console.log("j: ", j);
      });
    }

    //tạo payments
    if (data.paymentAmounts.length > 0) {
      data.paymentAmounts.forEach(async (detail) => {
        if (detail.amount > 0) {
          const p = await prisma.paymentDetail.create({
            data: {
              amount: detail.amount,
              type: detail.type,
              transactionHeaderId: transactionHeader.id,
            },
          });
          console.log("p", p);
        }
      });
    }
    //update inStock của jewelry
    return NextResponse.json(transactionHeader, { status: 201 });
  }
}
