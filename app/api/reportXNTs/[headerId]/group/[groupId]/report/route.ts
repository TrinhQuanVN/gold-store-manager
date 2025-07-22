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
      groupId: headerId,
      name: data.name,
      id: data.id,
      stt: parseInt(data.stt),
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
