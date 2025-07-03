import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

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
      where: { id, inStock: true },
      include: {
        jewelryType: true,
        category: true,
      },
    });

    if (!jewelryWithTypeAndCategory) {
      return NextResponse.json(
        { error: "Id not found or out of stock" },
        { status: 404 }
      );
    }

    return NextResponse.json(jewelryWithTypeAndCategory);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin trang sức:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
