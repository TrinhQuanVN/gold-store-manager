import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const types = await prisma.jewelryType.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(types);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch jewelry types", error },
      { status: 500 }
    );
  }
}
