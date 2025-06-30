import { goldPriceSchema } from "@/app/validationSchemas/goldPriceSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { date } from "zod";
import { parseISO, addDays } from "date-fns";
import { start } from "repl";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = goldPriceSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {
      status: 400,
    });
  }
  const data = validation.data;

  const goldPrice = await prisma.goldPrice.create({
    data: {
      name: data.name,
      buy: data.buy,
      sell: data.sell,
      createdAt: data.createdAt,
    },
  });

  return NextResponse.json(goldPrice, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date"); // ex: "2025-06-20"
  if (!dateStr) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  const startDate = parseISO(dateStr); // 2025-06-25T00:00:00.000Z
  const endDate = addDays(startDate, 1); // 2025-06-26T00:00:00.000Z

  const goldPrice = await prisma.goldPrice.findFirst({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(goldPrice, { status: 201 });
}
