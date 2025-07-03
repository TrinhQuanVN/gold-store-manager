import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name"); // Ví dụ: "24K", "18K", "16K"

  if (!name) {
    return NextResponse.json(
      { error: "Missing gold name (e.g., 24K)" },
      { status: 400 }
    );
  }

  const goldPrice = await prisma.goldPrice.findFirst({
    where: {
      name,
    },
    orderBy: {
      createdAt: "desc", // Sắp xếp theo thời gian mới nhất
    },
  });

  if (!goldPrice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(goldPrice); // status 200 mặc định
}
