// import { DateToStringVN, toStringVN } from "@/utils";
// import { TransactionListView } from "@prisma/client";
// import { Button } from "@radix-ui/themes";
// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";

// interface Props {
//   transactions: TransactionListView[];
// }

// const ExportTransactionExcelButton = ({ transactions }: Props) => {
//   const handleExport = () => {
//     const exportRows: any[][] = [
//       [
//         "ID",
//         "Ngày",
//         "Khách hàng",
//         "Xuất",
//         "Tiền mặt",
//         "Chuyển khoản",
//         "Tổng tiền",
//         "Ghi chú",
//       ],
//     ];
//     const importRows: any[][] = [
//       [
//         "ID",
//         "Ngày",
//         "Khách hàng",
//         "Nhập",
//         "Tiền mặt",
//         "Chuyển khoản",
//         "Tổng tiền",
//         "Ghi chú",
//       ],
//     ];

//     transactions.forEach((t) => {
//       const itemSummary = [t.goldItems, t.jewelryItems]
//         .filter(Boolean)
//         .join(" | ");

//       const row = [
//         t.id,
//         DateToStringVN(t.createdAt),
//         t.contactName ?? "-",
//         itemSummary,
//         +(t.cashAmount ?? 0),
//         +(t.bankAmount ?? 0),
//         +(t.totalAmount ?? 0),
//         t.note ?? "",
//       ];

//       if (t.isExport) exportRows.push(row);
//       else importRows.push(row);
//     });

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(
//       workbook,
//       XLSX.utils.aoa_to_sheet(exportRows),
//       "Xuất"
//     );
//     XLSX.utils.book_append_sheet(
//       workbook,
//       XLSX.utils.aoa_to_sheet(importRows),
//       "Nhập"
//     );

//     const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([buffer], { type: "application/octet-stream" });
//     const filename = `BaoCao_GiaoDich.xlsx`;
//     saveAs(blob, filename);
//   };

//   return (
//     <Button onClick={handleExport} color="green" variant="solid">
//       Xuất Excel
//     </Button>
//   );
// };

// export default ExportTransactionExcelButton;
