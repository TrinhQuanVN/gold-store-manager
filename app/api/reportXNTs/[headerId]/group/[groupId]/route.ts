import { rawGroup } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { headerId: string; groupId: string } }
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
  const validation = rawGroup.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }
  const data = validation.data;

  const groupIdparse = parseInt(_params.groupId);

  const group = await prisma.reportXNTGroup.findUnique({
    where: { id: groupIdparse },
  });
  if (!group) {
    return NextResponse.json(
      { error: "reportXNT group not found" },
      {
        status: 400,
      }
    );
  }

  const updatedReport = await prisma.reportXNTGroup.update({
    where: { id: groupIdparse },
    data: {
      name: data.name ?? group.name,
      stt: parseInt(data.stt) ?? group.stt,
    },
  });

  return NextResponse.json(updatedReport, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { headerId: string; groupId: string } }
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
  const groupIdparse = parseInt(_params.groupId);

  const group = await prisma.reportXNTGroup.findUnique({
    where: { id: groupIdparse },
  });
  if (!group) {
    return NextResponse.json(
      { error: "reportXNT group not found" },
      {
        status: 400,
      }
    );
  }
  await prisma.reportXNTGroup.delete({
    where: { id: groupIdparse },
  });
  return NextResponse.json(
    { message: "reportXNT group deleted successfully" },
    { status: 200 }
  );
}
