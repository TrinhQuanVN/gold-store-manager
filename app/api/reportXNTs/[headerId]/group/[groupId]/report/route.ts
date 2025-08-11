import {
  rawReportXNTSchema,
  reportXNTTransferedSchema,
} from "@/app/validationSchemas/reportXNTSchemas";
import { prisma } from "@/prisma/client";
import { group } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { headerId: string; groupId: string } }
) {
  const _params = await params;
  const headerId = parseInt(_params.headerId);
  const groupId = parseInt(_params.groupId);
  const body = await request.json();
  const validation = rawReportXNTSchema.safeParse(body);
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
    return NextResponse.json({ error: "Invalid header id" }, { status: 404 });
  }
  const group = await prisma.reportXNTGroup.findUnique({
    where: { id: groupId },
  });
  if (!group) {
    return NextResponse.json({ error: "Invalid group id" }, { status: 404 });
  }

  const report = await prisma.reportXNT.create({
    data: {
      groupId: groupId,
      name: data.name,
      stt: parseInt(data.stt),
      productCode: data.productCode,
      unit: data.unit ?? "chỉ",
      tonDauKyQuantity: data.tonDauKyQuantity || 0,
      tonDauKyValue: data.tonDauKyValue || 0,
      nhapQuantity: data.nhapQuantity || 0,
      nhapValue: data.nhapValue || 0,
      xuatQuantity: data.xuatQuantity || 0,
      xuatValue: data.xuatValue || 0,
      tonCuoiKyQuantity: data.tonCuoiKyQuantity || 0,
      tonCuoiKyValue: data.tonCuoiKyValue || 0,
    },
  });

  return NextResponse.json(report, { status: 201 });
}
