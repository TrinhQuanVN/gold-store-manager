import {
  contactSchema,
  RawContactDataForm,
} from "@/app/validationSchemas/contactSchemas";
import { prisma } from "@/prisma/client";
import { toLowerCaseNonAccentVietnamese } from "@/utils/remove_accents";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const validation = contactSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }
  const data = validation.data;

  const _params = await params;
  const contact = await prisma.contact.findUnique({
    where: { id: parseInt(_params.id) },
  });
  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  // Check if groupId is provided and valid
  if (
    data.groupId &&
    (await prisma.contactGroup.findUnique({
      where: { id: data.groupId },
    })) === null
  ) {
    return NextResponse.json({ error: "Invalid group id" }, { status: 404 });
  }

  const updatedContact = await prisma.contact.update({
    where: { id: parseInt(_params.id) },
    data: {
      name: data.name ?? contact.name,
      unaccentName: data.name
        ? toLowerCaseNonAccentVietnamese(data.name)
        : contact.unaccentName,
      groupId: data.groupId ? data.groupId : contact.groupId,
      phone: data.phone ?? contact.phone,
      cccd: data.cccd ?? contact.cccd,
      taxcode: data.taxcode ?? contact.taxcode,
      address: data.address ?? contact.address,
      note: data.note ?? contact.note,
    },
  });
  const contactWithGroup = await prisma.contact.findUnique({
    where: { id: updatedContact.id },
    include: { group: true },
  });

  return NextResponse.json(contactWithGroup, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const _params = await params;
  const contact = await prisma.contact.findUnique({
    where: { id: parseInt(_params.id) },
  });
  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  await prisma.contact.delete({
    where: { id: parseInt(_params.id) },
  });
  return NextResponse.json(
    { message: "Contact deleted successfully" },
    { status: 200 }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const _params = await params;
  const contactId = parseInt(_params.id);
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    include: { group: true },
  });

  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  const rawContact: RawContactDataForm = {
    id: contact.id.toString(),
    name: contact.name,
    groupId: contact.groupId.toString(),
    group: contact.group
      ? {
          id: contact.group.id.toString(),
          name: contact.group.name,
          description: contact.group.description ?? "",
          color: contact.group.color ?? "gray",
        }
      : null,
    phone: contact.phone ?? "",
    cccd: contact.cccd ?? "",
    taxcode: contact.taxcode ?? "",
    address: contact.address ?? "",
    note: contact.note ?? "",
  };

  return NextResponse.json(rawContact, { status: 200 });
}
