import { contactGrouptSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = contactGrouptSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }

  const contactGroup = await prisma.contactGroup.create({
    data: {
      name: body.name,
      description: body.description || null,
    },
  });

  return NextResponse.json(contactGroup, { status: 201 });
}
