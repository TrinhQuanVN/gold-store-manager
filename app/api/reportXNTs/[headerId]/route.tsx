import { reportXNTHeaderSchema } from "@/app/validationSchemas";
import { reportXNTSchema } from "@/app/validationSchemas/reportXNTSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { headerId: string } }
) {
  const body = await request.json();
  const validation = reportXNTHeaderSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }
  const data = validation.data;

  const _params = await params;
  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: parseInt(_params.headerId) },
  });
  if (!header) {
    return NextResponse.json({ error: "Header not found" }, { status: 404 });
  }

  // Check if groupId is provided and valid
  if (
    data.taxPayerId &&
    (await prisma.taxPayer.findUnique({
      where: { id: data.taxPayerId },
    })) === null
  ) {
    return NextResponse.json(
      { error: "Invalid tax payer id" },
      { status: 404 }
    );
  }

  const updatedHeader = await prisma.reportXNTHeader.update({
    where: { id: parseInt(_params.headerId) },
    data: {
      name: data.name ?? header.name,
      taxPayerId: data.taxPayerId ?? header.taxPayerId,
      quarter: data.quarter ?? header.quarter,
      year: data.year ?? header.year,
      startDate: data.startDate ?? header.startDate,
      endDate: data.endDate ?? header.endDate,
    },
  });

  return NextResponse.json(updatedHeader, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { headerId: string } }
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
  await prisma.reportXNTHeader.delete({
    where: { id: parseInt(_params.headerId) },
  });
  return NextResponse.json(
    { message: "header deleted successfully" },
    { status: 200 }
  );
}
