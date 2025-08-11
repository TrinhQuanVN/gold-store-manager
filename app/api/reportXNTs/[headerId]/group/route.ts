import { rawGroup } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { headerId: string } }
) {
  const _params = await params;
  const headerId = parseInt(_params.headerId);
  const body = await request.json();
  const validation = rawGroup.safeParse(body);
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
    return NextResponse.json(
      { error: "Invalid header report id" },
      { status: 404 }
    );
  }

  const group = await prisma.reportXNTGroup.create({
    data: {
      headerId: headerId,
      name: data.name,
      stt: parseInt(data.stt),
    },
  });

  return NextResponse.json(group, { status: 201 });
}
