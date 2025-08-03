"use client";

import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
// import ExportTransactionExcelButton from "./ExportTransactionExcelButton";
import dynamic from "next/dynamic";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

interface Props {
  transactions: {
    id: number;
    createdAt: string;
    note: string | null;
    isExport: boolean;
    contactName: string;
    goldAmount: string;
    jewelryAmount: string;
    totalAmount: string;
    goldItems: string;
    jewelryItems: string;
    cashAmount: string;
    bankAmount: string;
  }[];
}

const TransactionActions = ({ transactions }: Props) => {
  const handleExport = () => {
    const exportRows: any[][] = [
      [
        "ID",
        "Ngày",
        "Khách hàng",
        "Xuất",
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
        "Nhập",
        "Tiền mặt",
        "Chuyển khoản",
        "Tổng tiền",
        "Ghi chú",
      ],
    ];

    transactions.forEach((t) => {
      const itemSummary = [t.goldItems, t.jewelryItems]
        .filter(Boolean)
        .join(" | ");

      const row = [
        t.id,
        t.createdAt,
        t.contactName ?? "-",
        itemSummary,
        t.cashAmount,
        t.bankAmount,
        t.totalAmount,
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

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const filename = `BaoCao_GiaoDich.xlsx`;
    saveAs(blob, filename);
  };
  return (
    <Flex justify="end" gap="3">
      <Button>
        <Link href="/transactions/new">Thêm giao dịch</Link>
      </Button>
      <Button onClick={handleExport} color="green" variant="solid">
        Xuất Excel
      </Button>
    </Flex>
  );
};

export default TransactionActions;
