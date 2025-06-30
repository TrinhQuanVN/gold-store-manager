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
    const gold = await prisma.gold.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        goldPercent: true,
      },
    });

    if (!gold) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(gold);
  } catch (err) {
    console.error("Error fetching gold:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
