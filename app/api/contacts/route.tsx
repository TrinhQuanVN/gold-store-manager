import { contactSchema } from "@/app/validationSchemas";
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
  const group = await prisma.contactGroup.findUnique({
    where: { id: parseInt(body.groupId) },
  });
  if (!group) {
    return NextResponse.json({ error: "Invalid group id" }, { status: 404 });
  }

  const contact = await prisma.contact.create({
    data: {
      name: body.name,
      unaccentName: toLowerCaseNonAccentVietnamese(body.name),
      groupId: parseInt(body.groupId),
      phone: body.phone || null,
      cccd: body.cccd || null,
      taxcode: body.taxcode || null,
      address: body.address || null,
    },
  });

  return NextResponse.json(contact, { status: 201 });
}
