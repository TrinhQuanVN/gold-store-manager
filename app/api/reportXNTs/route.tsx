import { reportXNTHeaderSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = reportXNTHeaderSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }
  const data = validation.data;
  const taxPayer = await prisma.taxPayer.findUnique({
    where: { id: data.taxPayerId },
  });
  if (!taxPayer) {
    return NextResponse.json({ error: "Invalid taxPayer id" }, { status: 404 });
  }

  const header = await prisma.reportXNTHeader.create({
    data: {
      name: data.name,
      quarter: data.quarter,
      year: data.year,
      taxPayerId: data.taxPayerId,
      startDate: data.startDate,
      endDate: data.endDate,
    },
  });

  return NextResponse.json(header, { status: 201 });
}
