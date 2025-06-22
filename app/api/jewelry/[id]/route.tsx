import { pathJewelrySchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const validation = pathJewelrySchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }
  const data = validation.data;

  const _params = await params;
  const jewelry = await prisma.jewelry.findUnique({
    where: { id: parseInt(_params.id) },
  });
  if (!jewelry) {
    return NextResponse.json({ error: "Jewelry not found" }, { status: 404 });
  }

  // Check if goldKara is provided and valid
  if (
    data.jewelryTypeId &&
    (await prisma.jewelryType.findUnique({
      where: { id: data.jewelryTypeId },
    })) === null
  ) {
    return NextResponse.json(
      { error: "Invalid gold kara id" },
      { status: 404 }
    );
  }

  // Check if jewelry category is provided and valid
  if (
    data.categoryId &&
    (await prisma.jewerlyCategory.findUnique({
      where: { id: data.categoryId },
    })) === null
  ) {
    return NextResponse.json(
      { error: "Invalid jewelry categroy id" },
      { status: 404 }
    );
  }

  const updatedJewelry = await prisma.jewelry.update({
    where: { id: parseInt(_params.id) },
    data: {
      name: data.name ?? jewelry.name,
      goldWeight: data.goldWeight ? data.goldWeight : jewelry.goldWeight,
      jewelryTypeId: data.jewelryTypeId
        ? data.jewelryTypeId
        : jewelry.jewelryTypeId,
      categoryId: data.categoryId ? data.categoryId : jewelry.categoryId,

      gemName: data.gemName ?? jewelry.gemName,
      gemWeight: data.gemWeight ? data.gemWeight : jewelry.gemWeight,
      totalWeight: data.totalWeight ? data.totalWeight : jewelry.totalWeight,

      description: data.description ?? jewelry.description,
      madeIn: data.madeIn ?? jewelry.madeIn,
      size: data.size ?? jewelry.size,
      inStock: data.inStock ? data.inStock : jewelry.inStock,
    },
  });

  return NextResponse.json(updatedJewelry, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const _params = await params;
  const jewelry = await prisma.jewelry.findUnique({
    where: { id: parseInt(_params.id) },
  });
  if (!jewelry) {
    return NextResponse.json({ error: "jewelry not found" }, { status: 404 });
  }
  await prisma.jewelry.delete({
    where: { id: parseInt(_params.id) },
  });
  return NextResponse.json(
    { message: "jewelry deleted successfully" },
    { status: 200 }
  );
}
