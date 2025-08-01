import { jewelrySchema } from "@/app/validationSchemas/jewelrySchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await request.json();
  const validation = jewelrySchema.safeParse(body);
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
    data.typeId &&
    (await prisma.jewelryType.findUnique({
      where: { id: data.typeId },
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
    (await prisma.jewelryCategory.findUnique({
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
      typeId: data.typeId ? data.typeId : jewelry.typeId,
      categoryId: data.categoryId ? data.categoryId : jewelry.categoryId,

      gemName: data.gemName ?? jewelry.gemName,
      gemWeight: data.gemWeight ? data.gemWeight : jewelry.gemWeight,
      totalWeight: data.totalWeight ? data.totalWeight : jewelry.totalWeight,

      description: data.description ?? jewelry.description,
      madeIn: data.madeIn ?? jewelry.madeIn,
      size: data.size ?? jewelry.size,
      reportProductCode: data.reportProductCode ?? jewelry.reportProductCode,

      supplierId: data.supplierId ?? jewelry.supplierId, // ✅ mới thêm
    },
  });

  return NextResponse.json(updatedJewelry, { status: 200 });
}

export async function DELETE(
  request: NextRequest, //dòng này phải có
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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const _params = await params;
  if (!_params.id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const id = Number(_params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const jewelryWithTypeAndCategory = await prisma.jewelry.findUnique({
      where: { id },
      include: {
        jewelryType: true,
        category: true,
      },
    });

    if (!jewelryWithTypeAndCategory) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(jewelryWithTypeAndCategory, { status: 200 });
  } catch (err) {
    console.error("Lỗi khi lấy thông tin trang sức:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
