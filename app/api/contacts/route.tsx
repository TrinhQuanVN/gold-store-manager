import { contactSchema } from "@/app/validationSchemas/contactSchemas";
import { prisma } from "@/prisma/client";
import { toLowerCaseNonAccentVietnamese } from "@/utils/remove_accents";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = contactSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }
  const data = validation.data;
  const group = await prisma.contactGroup.findUnique({
    where: { id: data.groupId },
  });
  if (!group) {
    return NextResponse.json({ error: "Invalid group id" }, { status: 404 });
  }

  const contact = await prisma.contact.create({
    data: {
      name: data.name,
      unaccentName: toLowerCaseNonAccentVietnamese(data.name),
      groupId: data.groupId,
      phone: data.phone || null,
      cccd: data.cccd || null,
      taxcode: data.taxcode || null,
      address: data.address || null,
      note: data.note || null,
    },
  });

  return NextResponse.json(contact, { status: 201 });
}
