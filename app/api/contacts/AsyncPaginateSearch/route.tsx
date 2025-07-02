import { prisma } from "@/prisma/client";
import { toLowerCaseNonAccentVietnamese } from "@/utils/remove_accents";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search")?.trim() || "";
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  const whereClause = search
    ? {
        OR: [
          { name: { contains: search } },
          { phone: { contains: search } },
          { cccd: { contains: search } },
          {
            unaccentName: {
              contains: toLowerCaseNonAccentVietnamese(search),
            },
          },
        ],
      }
    : {};

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where: whereClause,
      skip: offset,
      take: PAGE_SIZE,
      orderBy: { id: "desc" },
      include: { group: true },
    }),
    prisma.contact.count({ where: whereClause }),
  ]);

  const hasMore = offset + PAGE_SIZE < total;

  return NextResponse.json(
    {
      contactWithGroups: contacts,
      hasMore,
    },
    { status: 200 }
  );
}
