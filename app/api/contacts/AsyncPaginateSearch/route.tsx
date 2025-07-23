import { RawContactDataForm } from "@/app/validationSchemas";
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

  const convertToRawContact: RawContactDataForm[] = contacts.map((c) => ({
    id: c.id.toString(),
    groupId: c.group?.id.toString(),
    name: c.name,
    phone: c.phone,
    cccd: c.cccd,
    address: c.address,
    taxcode: c.taxcode,
    note: c.note,
    unaccentName: c.unaccentName,
    group: {
      id: c.group.id.toString(),
      name: c.group?.name,
      description: c.group?.description || "",
      color: c.group?.color || "gray",
    },
  }));

  const hasMore = offset + PAGE_SIZE < total;

  return NextResponse.json(
    {
      contactWithGroups: convertToRawContact,
      hasMore,
    },
    { status: 200 }
  );
}
