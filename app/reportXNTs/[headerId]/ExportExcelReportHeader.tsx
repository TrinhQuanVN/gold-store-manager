"use client";

import { Button } from "@radix-ui/themes";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { RawReportXNTHeaderForm } from "@/app/validationSchemas";

interface Props {
  data: RawReportXNTHeaderForm;
}

const ExportExcelReportHeader = ({ data }: Props) => {
  const handleExport = () => {
    const rows: any[][] = [];

    // Header row
    rows.push([
      "STT",
      "Tên",
      "Đơn vị",
      "TDK SL",
      "TDK GT",
      "Nhập SL",
      "Nhập GT",
      "XTK SL",
      "XTK GT",
      "TCK SL",
      "TCK GT",
      "Xuất TT",
      "Thuế",
    ]);

    // Biến lưu tổng cộng
    const total = {
      tonDauKyQuantity: 0,
      tonDauKyValue: 0,
      nhapQuantity: 0,
      nhapValue: 0,
      xuatQuantity: 0,
      xuatValue: 0,
      tonCuoiKyQuantity: 0,
      tonCuoiKyValue: 0,
      xuatThucTe: 0,
      thue: 0,
    };

    data.groups?.forEach((group) => {
      // Dòng tiêu đề nhóm
      rows.push([group.stt, group.name]);

      group.reports?.forEach((r) => {
        rows.push([
          r.stt,
          r.name,
          r.unit ?? "chỉ",
          +r.tonDauKyQuantity,
          +r.tonDauKyValue,
          +r.nhapQuantity,
          +r.nhapValue,
          +r.xuatQuantity,
          +r.xuatValue,
          +r.tonCuoiKyQuantity,
          +r.tonCuoiKyValue,
          +r.xuatThucTe,
          +r.thue,
        ]);

        total.tonDauKyQuantity += +r.tonDauKyQuantity;
        total.tonDauKyValue += +r.tonDauKyValue;
        total.nhapQuantity += +r.nhapQuantity;
        total.nhapValue += +r.nhapValue;
        total.xuatQuantity += +r.xuatQuantity;
        total.xuatValue += +r.xuatValue;
        total.tonCuoiKyQuantity += +r.tonCuoiKyQuantity;
        total.tonCuoiKyValue += +r.tonCuoiKyValue;
        total.xuatThucTe += +(r.xuatThucTe ?? 0);
        total.thue += +(r.thue ?? 0);
      });
    });

    // Dòng tổng cộng
    rows.push([
      "",
      "Tổng",
      "",
      total.tonDauKyQuantity,
      total.tonDauKyValue,
      total.nhapQuantity,
      total.nhapValue,
      total.xuatQuantity,
      total.xuatValue,
      total.tonCuoiKyQuantity,
      total.tonCuoiKyValue,
      total.xuatThucTe,
      total.thue,
    ]);

    // Xuất file Excel
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Báo cáo");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });

    const fileName = `BaoCao_XNT_Q${data.quarter}_${data.year}.xlsx`;
    saveAs(blob, fileName);
  };

  return (
    <Button onClick={handleExport} color="green" variant="solid">
      Xuất excel
    </Button>
  );
};

export default ExportExcelReportHeader;
