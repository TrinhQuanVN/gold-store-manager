import { prisma } from "@/prisma/client";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("reportProductCode")?.trim();

  if (!q) {
    return NextResponse.json(
      { error: "Thiếu reportProductCode" },
      { status: 400 }
    );
  }

  // 1) Lấy các mã duy nhất, loại bỏ null từ DB
  const codes = await prisma.jewelry.findMany({
    where: {
      reportProductCode: {
        not: null, // ✅ chặn null ngay từ đầu
        contains: q,
        mode: "insensitive",
      },
    },
    distinct: ["reportProductCode"],
    select: { reportProductCode: true },
    take: 50,
  });

  if (codes.length === 0) {
    return NextResponse.json({ message: "Không tìm thấy" }, { status: 404 });
  }

  // 2) Lấy record đại diện cho mỗi code
  const itemsMaybeNull = await Promise.all(
    codes.map((c) =>
      prisma.jewelry.findFirst({
        where: { reportProductCode: c.reportProductCode! }, // đã not:null ở trên
        include: { jewelryType: true, category: true },
        orderBy: { id: "desc" },
      })
    )
  );

  // 3) Filter null
  const items = itemsMaybeNull.filter(
    (x): x is NonNullable<typeof x> => x != null
  );

  if (items.length === 0) {
    return NextResponse.json({ message: "Không tìm thấy" }, { status: 404 });
  }

  // 4) Map an toàn (optional chaining + default)
  const result = items.map((data) => ({
    ...data,
    id: data.id?.toString() || "",
    goldWeight: data?.goldWeight?.toString() || "",
    typeId: data.jewelryType?.id?.toString() || "",
    categoryId: data.category?.id?.toString() || "",
    gemWeight: data?.gemWeight?.toString() || "",
    totalWeight: data?.totalWeight?.toString() || "",
    supplierId: data?.supplierId?.toString() || "",
    name: data?.name || "",
    description: data?.description || "",
    madeIn: data?.madeIn || "",
    size: data?.size || "",
    reportProductCode: data?.reportProductCode || "",
    gemName: data?.gemName || "",
    createdAt: data.createdAt,
    type: {
      id: data.jewelryType?.id?.toString() || "",
      name: data.jewelryType?.name ?? null,
      goldPercent: data.jewelryType?.goldPercent
        ? data.jewelryType.goldPercent.toString()
        : null,
      color: data.jewelryType?.color || "gray",
    },
    category: {
      id: data.category?.id?.toString() || "",
      name: data.category?.name ?? null,
      color: data.category?.color || "gray",
    },
  }));

  return NextResponse.json(result, { status: 200 });
}
