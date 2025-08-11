import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.jewelryCategory.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch jewelry categories", error },
      { status: 500 }
    );
  }
}
