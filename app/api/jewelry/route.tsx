import { jewelrySchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { toLowerCaseNonAccentVietnamese } from "@/utils/remove_accents";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = jewelrySchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }
  const data = validation.data;
  //check if goldKaraId is a valid number
  const jewelryType = await prisma.jewelryType.findUnique({
    where: { id: data.jewelryTypeId },
  });
  if (!jewelryType) {
    return NextResponse.json(
      { error: "Invalid jewelry type id" },
      { status: 404 }
    );
  }
  //check if categoryId is a valid number
  const category = await prisma.jewerlyCategory.findUnique({
    where: { id: data.categoryId },
  });
  if (!category) {
    return NextResponse.json(
      { error: "Invalid jewelry category id" },
      { status: 404 }
    );
  }

  const jewelry = await prisma.jewelry.create({
    data: {
      name: data.name,
      goldWeight: data.goldWeight,
      categoryId: data.categoryId,
      jewelryTypeId: data.jewelryTypeId,
      gemName: data.gemName || null,
      gemWeight: data.gemWeight ? data.gemWeight : 0,
      totalWeight: data.totalWeight ? data.totalWeight : 0.0,
      description: data.description || null,
      madeIn: data.madeIn || null,
      size: data.size || null,
    },
  });

  return NextResponse.json(jewelry, { status: 201 });
}
