import { reportXNTTransferedSchema } from "@/app/validationSchemas/reportXNTSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { headerId: string; reportId: string } }
) {
  const _params = await params;
  const headerId = parseInt(_params.headerId);
  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: headerId },
  });
  if (!header) {
    return NextResponse.json({ error: "Header not found" }, { status: 404 });
  }
  const body = await request.json();
  const validation = reportXNTTransferedSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }
  const data = validation.data;

  const report = await prisma.reportXNT.findUnique({
    where: { id: _params.reportId },
  });
  if (!report) {
    return NextResponse.json(
      { error: "reportXNT not found" },
      {
        status: 400,
      }
    );
  }

  const updatedReport = await prisma.reportXNT.update({
    where: { id: _params.reportId },
    data: {
      name: data.name ?? report.name,
      tonDauKyQuantity: data.tonDauKyQuantity ?? report.tonDauKyQuantity,
      tonDauKyValue: data.tonDauKyValue ?? report.tonDauKyValue,
      nhapQuantity: data.nhapQuantity ?? report.nhapQuantity,
      nhapValue: data.nhapValue ?? report.nhapValue,
      xuatQuantity: data.xuatQuantity ?? report.xuatQuantity,
      xuatValue: data.xuatValue ?? report.xuatValue,
      tonCuoiKyQuantity: data.tonCuoiKyQuantity ?? report.tonCuoiKyQuantity,
      tonCuoiKyValue: data.tonCuoiKyValue ?? report.tonCuoiKyValue,
    },
  });

  return NextResponse.json(updatedReport, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { headerId: string; reportId: string } }
) {
  const _params = await params;
  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: parseInt(_params.headerId) },
  });
  if (!header) {
    return NextResponse.json(
      { error: "report xnt header not found" },
      { status: 404 }
    );
  }
  const report = await prisma.reportXNT.findUnique({
    where: { id: _params.reportId },
  });
  if (!report) {
    return NextResponse.json(
      { error: "reportXNT not found" },
      {
        status: 400,
      }
    );
  }
  await prisma.reportXNT.delete({
    where: { id: _params.reportId },
  });
  return NextResponse.json(
    { message: "reportXNT deleted successfully" },
    { status: 200 }
  );
}
