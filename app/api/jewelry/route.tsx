import { jewelrySchema } from "@/app/validationSchemas/jewelrySchemas";
import { prisma } from "@/prisma/client";
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
    where: { id: data.typeId },
  });
  if (!jewelryType) {
    return NextResponse.json(
      { error: "Invalid jewelry type id" },
      { status: 404 }
    );
  }
  //check if categoryId is a valid number
  const category = await prisma.jewelryCategory.findUnique({
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
      typeId: data.typeId,
      gemName: data.gemName || null,
      gemWeight: data.gemWeight ? data.gemWeight : 0,
      totalWeight: data.totalWeight ? data.totalWeight : 0.0,
      description: data.description || null,
      madeIn: data.madeIn || null,
      size: data.size || null,
      supplierId: data.supplierId ? data.supplierId : null,
      reportXNTId: data.reportXNTId ? data.reportXNTId : null, // Optional field
    },
  });

  return NextResponse.json(jewelry, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code"); // ex: "2025-06-20"
  if (!code) {
    return NextResponse.json(
      { error: "thiếu mã của nhà hoặc mã rỗng" },
      { status: 400 }
    );
  }

  const jewelry = await prisma.jewelry.findFirst({
    where: {
      supplierId: code,
    },
    include: {
      jewelryType: true,
      category: true,
    },
  });

  return NextResponse.json(jewelry, { status: 201 });
}
