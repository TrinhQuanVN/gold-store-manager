import { goldPriceSchema } from "@/app/validationSchemas/goldPriceSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const validation = goldPriceSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }
  const data = validation.data;

  const _params = await params;
  const goldPrice = await prisma.goldPrice.findUnique({
    where: { id: parseInt(_params.id) },
  });
  if (!goldPrice) {
    return NextResponse.json(
      { error: "Gold price not found" },
      { status: 404 }
    );
  }

  const updatedGoldPrice = await prisma.goldPrice.update({
    where: { id: parseInt(_params.id) },
    data: {
      name: data.name ?? goldPrice.name,
      buy: data.buy ?? goldPrice.buy,
      sell: data.sell ?? goldPrice.sell,
    },
  });

  return NextResponse.json(updatedGoldPrice, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const _params = await params;
  const goldPrice = await prisma.goldPrice.findUnique({
    where: { id: parseInt(_params.id) },
  });
  if (!goldPrice) {
    return NextResponse.json(
      { error: "Gold price not found" },
      { status: 404 }
    );
  }
  await prisma.goldPrice.delete({
    where: { id: parseInt(_params.id) },
  });
  return NextResponse.json(
    { message: "Gold price deleted successfully" },
    { status: 200 }
  );
}
