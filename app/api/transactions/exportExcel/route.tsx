// app/api/transactions/exportExcel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import * as XLSX from "xlsx";
import { DateToStringVN, toStringVN } from "@/utils";

// Render chi tiết vàng/trang sức
const renderItemDetails = (items?: any[] | null) => {
  if (!items || !Array.isArray(items)) return "";
  return items
    .map((item) => {
      if (!item?.name || typeof item?.weight !== "number") return null;
      return `${toStringVN(item.weight, 0, 4)} chỉ ${item.name} x ${toStringVN(
        item.price,
        0,
        0
      )}`;
    })
    .filter(Boolean)
    .join("; ");
};

export async function POST(req: NextRequest) {
  const params = await req.json();

  if (!params.excelFromDate || !params.excelToDate) {
    return NextResponse.json(
      { error: "Thiếu excelFromDate hoặc excelToDate" },
      { status: 400 }
    );
  }

  const transactions = await prisma.transactionListView.findMany({
    where: {
      createdAt: {
        gte: new Date(params.excelFromDate),
        lte: new Date(params.excelToDate),
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Header giống TransactionActions
  const exportRows: any[][] = [
    [
      "ID",
      "Ngày",
      "Khách hàng",
      "Căn cước",
      "Sản phẩm",
      "Tiền mặt",
      "Chuyển khoản",
      "Tổng tiền",
      "Ghi chú",
    ],
  ];
  const importRows: any[][] = [
    [
      "ID",
      "Ngày",
      "Khách hàng",
      "Căn cước",
      "Sản phẩm",
      "Tiền mặt",
      "Chuyển khoản",
      "Tổng tiền",
      "Ghi chú",
    ],
  ];

  transactions.forEach((t) => {
    const productDetails = [
      renderItemDetails(t.goldDetails as any[]),
      renderItemDetails(t.jewelryDetails as any[]),
    ]
      .filter(Boolean)
      .join(" | ");

    const row = [
      t.id,
      DateToStringVN(t.createdAt),
      t.contactName ?? "-",
      t.contactCccd ?? "-",
      productDetails,
      toStringVN(Number(t.cashAmount ?? 0)),
      toStringVN(Number(t.bankAmount ?? 0)),
      Number(t.totalAmount ?? 0),
      t.note ?? "",
    ];

    if (t.isExport) exportRows.push(row);
    else importRows.push(row);
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(exportRows),
    "Xuất"
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(importRows),
    "Nhập"
  );

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="BaoCao_GiaoDich.xlsx"`,
    },
  });
}
