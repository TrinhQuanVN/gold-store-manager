import { pathContactGroupSchema } from "@/app/validation_shema";
import { prisma } from "@/prisma/client";
import { toLowerCaseNonAccentVietnamese } from "@/utils/remove_accents";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const validation = pathContactGroupSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }
  const contactGroup = await prisma.contactGroup.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!contactGroup) {
    return NextResponse.json(
      { error: "Contact group not found" },
      { status: 404 }
    );
  }
  const updatedContact = await prisma.contactGroup.update({
    where: { id: parseInt(params.id) },
    data: {
      name: body.name ?? contactGroup.name,
      description: body.description ?? contactGroup.description,
    },
  });

  return NextResponse.json(updatedContact, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const contactGroup = await prisma.contactGroup.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!contactGroup) {
    return NextResponse.json(
      { error: "Contact group not found" },
      { status: 404 }
    );
  }
  await prisma.contactGroup.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json(
    { message: "Contact group deleted successfully" },
    { status: 200 }
  );
}
