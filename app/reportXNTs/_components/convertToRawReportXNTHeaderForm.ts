import {
  RawReportXNTForm,
  RawReportXNTGroupForm,
  RawReportXNTHeaderForm,
} from "@/app/validationSchemas";
import {
  ReportXNTHeader,
  ReportXNTGroup,
  ReportXNT,
  TaxPayer,
} from "@prisma/client";

export function convertToRawReportXNTHeaderForm(
  header: ReportXNTHeader & {
    taxPayer: TaxPayer;
    group: (ReportXNTGroup & { ReportXNTs: ReportXNT[] })[];
  }
): RawReportXNTHeaderForm {
  return {
    id: header.id.toString(),
    name: header.name,
    quarter: header.quarter.toString(),
    year: header.year.toString(),
    taxPayerId: header.taxPayerId.toString(),
    startDate: header.startDate.toISOString(),
    endDate: header.endDate.toISOString(),
    tonDauKyQuantityTotal: "", // Optional nếu không tổng hợp
    tonDauKyValueTotal: "",
    nhapQuantityTotal: "",
    nhapValueTotal: "",
    xuatQuantityTotal: "",
    xuatValueTotal: "",
    tonCuoiKyQuantityTotal: "",
    tonCuoiKyValueTotal: "",
    xuatThucTe: "",
    thue: "",
    date: header.createdAt.toISOString(),
    currentGoldPrice: "0",
    taxPayer: {
      id: header.taxPayer.id.toString(),
      name: header.taxPayer.name,
      address: header.taxPayer.address ?? "",
      taxCode: header.taxPayer.taxCode,
    },
    groups: header.group.map(convertToRawReportXNTGroupForm),
  };
}

export function convertToRawReportXNTForm(r: ReportXNT): RawReportXNTForm {
  return {
    groupId: r.groupId.toString(),
    id: r.id,
    name: r.name,
    unit: r.unit ?? "chỉ",
    tonDauKyQuantity: r.tonDauKyQuantity.toString(),
    tonDauKyValue: r.tonDauKyValue.toString(),
    nhapQuantity: r.nhapQuantity.toString(),
    nhapValue: r.nhapValue.toString(),
    xuatQuantity: r.xuatQuantity.toString(),
    xuatValue: r.xuatValue.toString(),
    tonCuoiKyQuantity: r.tonCuoiKyQuantity.toString(),
    tonCuoiKyValue: r.tonCuoiKyValue.toString(),
    xuatThucTe: "0",
    thue: "0",
  };
}

export function convertToRawReportXNTGroupForm(
  g: ReportXNTGroup & { ReportXNTs: ReportXNT[] }
): RawReportXNTGroupForm {
  return {
    headerId: g.headerId.toString(),
    id: g.id,
    name: g.name,
    stt: g.stt.toString(),
    tonDauKyQuantityTotal: "",
    tonDauKyValueTotal: "",
    nhapQuantityTotal: "",
    nhapValueTotal: "",
    xuatQuantityTotal: "",
    xuatValueTotal: "",
    tonCuoiKyQuantityTotal: "",
    tonCuoiKyValueTotal: "",
    xuatThucTe: "0",
    thue: "0",
    reports: g.ReportXNTs.map(convertToRawReportXNTForm),
  };
}
