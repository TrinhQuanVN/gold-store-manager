import { reportXNTTransferedSchema } from "@/app/validationSchemas/reportXNTSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { headerId: string } }
) {
  const _params = await params;
  const headerId = parseInt(_params.headerId);
  const body = await request.json();
  const validation = reportXNTTransferedSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }
  const data = validation.data;
  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: headerId },
  });
  if (!header) {
    return NextResponse.json({ error: "Invalid taxPayer id" }, { status: 404 });
  }

  const report = await prisma.reportXNT.create({
    data: {
      headerId: headerId,
      name: data.name,
      id: data.id,
      tonDauKyQuantity: data.tonDauKyQuantity,
      tonDauKyValue: data.tonDauKyValue,
      nhapQuantity: data.nhapQuantity,
      nhapValue: data.nhapValue,
      xuatQuantity: data.xuatQuantity,
      xuatValue: data.xuatValue,
      tonCuoiKyQuantity: data.tonCuoiKyQuantity,
      tonCuoiKyValue: data.tonCuoiKyValue,
    },
  });

  return NextResponse.json(report, { status: 201 });
}
