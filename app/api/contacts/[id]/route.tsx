import { pathContactSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { toLowerCaseNonAccentVietnamese } from "@/utils/remove_accents";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const validation = pathContactSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }
  const _params = await params;
  const contact = await prisma.contact.findUnique({
    where: { id: parseInt(_params.id) },
  });
  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  // Check if groupId is provided and valid
  if (
    body.groupId &&
    (await prisma.contactGroup.findUnique({
      where: { id: parseInt(body.groupId) },
    })) === null
  ) {
    return NextResponse.json({ error: "Invalid group id" }, { status: 404 });
  }

  const updatedContact = await prisma.contact.update({
    where: { id: parseInt(_params.id) },
    data: {
      name: body.name ?? contact.name,
      unaccentName: body.name
        ? toLowerCaseNonAccentVietnamese(body.name)
        : contact.unaccentName,
      groupId: body.groupId ? parseInt(body.groupId) : contact.groupId,
      phone: body.phone ?? contact.phone,
      cccd: body.cccd ?? contact.cccd,
      taxcode: body.taxcode ?? contact.taxcode,
      address: body.address ?? contact.address,
      note: body.note ?? contact.note,
    },
  });

  return NextResponse.json(updatedContact, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const contact = await prisma.contact.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  await prisma.contact.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json(
    { message: "Contact deleted successfully" },
    { status: 200 }
  );
}
