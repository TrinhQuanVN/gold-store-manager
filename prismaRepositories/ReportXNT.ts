import { prisma } from "@/prisma/client";
import {
  ReportXNTHeader,
  ReportXNT as PrismaReportXNT,
  TaxPayer,
  Prisma,
  ReportXNT,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type ReportXNTNumber = {
  name: string;
  id: string;
  headerId: number;
  unit: string;
  tonDauKyQuantity: number;
  tonDauKyValue: number;
  nhapQuantity: number;
  nhapValue: number;
  xuatQuantity: number;
  xuatValue: number;
  tonCuoiKyQuantity: number;
  tonCuoiKyValue: number;
};

export function toNumber(value: Decimal | number): number {
  return typeof value === "number" ? value : Number(value.toString());
}

export type ReportXNTHeaderWithNumber = Omit<ReportXNTHeader, "reportXNTs"> & {
  taxPayer: TaxPayer;
  reportXNTs: ReportXNTNumber[]; // đã chuyển Decimal thành number
};

export async function getReportXNTHeaderWithNumbers(
  headerId: number
): Promise<ReportXNTHeaderWithNumber | null> {
  const header = await prisma.reportXNTHeader.findUnique({
    where: { id: headerId },
    include: {
      taxPayer: true,
      reportXNTs: true,
    },
  });

  if (!header) return null;

  const formatted = {
    ...header,
    reportXNTs: header.reportXNTs.map((r) => ({
      id: r.id,
      name: r.name,
      headerId: r.headerId,
      unit: r.unit ?? "chỉ",
      tonDauKyQuantity: toNumber(r.tonDauKyQuantity),
      tonDauKyValue: toNumber(r.tonDauKyValue),
      nhapQuantity: toNumber(r.nhapQuantity),
      nhapValue: toNumber(r.nhapValue),
      xuatQuantity: toNumber(r.xuatQuantity),
      xuatValue: toNumber(r.xuatValue),
      tonCuoiKyQuantity: toNumber(r.tonCuoiKyQuantity),
      tonCuoiKyValue: toNumber(r.tonCuoiKyValue),
    })),
  };

  return formatted;
}

export const convertReportXNTToNumber = (
  report: ReportXNT
): ReportXNTNumber => ({
  id: report.id,
  name: report.name,
  headerId: report.headerId,
  unit: report.unit ?? "chỉ",
  tonDauKyQuantity: toNumber(report.tonDauKyQuantity),
  tonDauKyValue: toNumber(report.tonDauKyValue),
  nhapQuantity: toNumber(report.nhapQuantity),
  nhapValue: toNumber(report.nhapValue),
  xuatQuantity: toNumber(report.xuatQuantity),
  xuatValue: toNumber(report.xuatValue),
  tonCuoiKyQuantity: toNumber(report.tonCuoiKyQuantity),
  tonCuoiKyValue: toNumber(report.tonCuoiKyValue),
});
