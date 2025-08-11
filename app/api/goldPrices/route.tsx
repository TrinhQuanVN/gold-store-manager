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
  const dateStr = searchParams.get("date");

  if (!dateStr) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }
  const targetDate = parseISO(dateStr); // ví dụ: 2025-07-01T14:00:00.000Z

  const goldPrice = await prisma.goldPrice.findFirst({
    where: {
      createdAt: {
        lte: targetDate, // tìm bản ghi gần nhất trước thời điểm này
      },
    },
    orderBy: {
      createdAt: "desc", // mới nhất trước thời điểm truyền vào
    },
  });

  if (!goldPrice) {
    return NextResponse.json(
      { error: "Không tìm thấy giá vàng phù hợp" },
      { status: 404 }
    );
  }

  return NextResponse.json(goldPrice, { status: 200 });
}
