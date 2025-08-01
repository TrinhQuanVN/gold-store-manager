"use client";

import { Button } from "@radix-ui/themes";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { RawTransactionHeaderFormData } from "@/app/validationSchemas";
import { DateToStringVN, toStringVN } from "@/utils";

interface Props {
  transactions: RawTransactionHeaderFormData[];
}

const ExportTransactionExcelButton = ({ transactions }: Props) => {
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
      const goldItems = t.goldDetails.map(
        (g) => `${toStringVN(+g.weight, 0, 4)} chỉ ${g.goldName}`
      );
      const jewelryItems = t.jewelryDetails.map(
        (j) => `${toStringVN(+j.weight, 0, 4)} chỉ ${j.jewelryName}`
      );
      const itemSummary = [goldItems.join("; "), jewelryItems.join("; ")]
        .filter(Boolean)
        .join(" | ");

      const cash = t.payments
        .filter((p) => p.type === "TM")
        .reduce((sum, p) => sum + +p.amount, 0);
      const bank = t.payments
        .filter((p) => p.type === "CK")
        .reduce((sum, p) => sum + +p.amount, 0);

      const row = [
        t.id,
        DateToStringVN(t.date),
        t.contactName ?? "-",
        itemSummary,
        cash,
        bank,
        +t.totalAmount,
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
    <Button onClick={handleExport} color="green" variant="solid">
      Xuất Excel
    </Button>
  );
};

export default ExportTransactionExcelButton;
