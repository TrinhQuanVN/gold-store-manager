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
  const groups = header.group.map(convertToRawReportXNTGroupForm);

  const sum = (getter: (g: RawReportXNTGroupForm) => number) =>
    groups.reduce((acc, g) => acc + getter(g), 0);

  const toNum = (v: string) => Number(v || "0");

  return {
    id: header.id.toString(),
    name: header.name,
    quarter: header.quarter.toString(),
    year: header.year.toString(),
    taxPayerId: header.taxPayerId.toString(),
    startDate: header.startDate.toISOString(),
    endDate: header.endDate.toISOString(),
    tonDauKyQuantityTotal: sum((g) =>
      toNum(g.tonDauKyQuantityTotal)
    ).toString(),
    tonDauKyValueTotal: sum((g) => toNum(g.tonDauKyValueTotal)).toString(),
    nhapQuantityTotal: sum((g) => toNum(g.nhapQuantityTotal)).toString(),
    nhapValueTotal: sum((g) => toNum(g.nhapValueTotal)).toString(),
    xuatQuantityTotal: sum((g) => toNum(g.xuatQuantityTotal)).toString(),
    xuatValueTotal: sum((g) => toNum(g.xuatValueTotal)).toString(),
    tonCuoiKyQuantityTotal: sum((g) =>
      toNum(g.tonCuoiKyQuantityTotal)
    ).toString(),
    tonCuoiKyValueTotal: sum((g) => toNum(g.tonCuoiKyValueTotal)).toString(),
    xuatThucTe: sum((g) => toNum(g.xuatThucTe)).toString(), // ✅ thêm
    thue: sum((g) => toNum(g.thue)).toString(), // ✅ thêm
    date: header.createdAt.toISOString(),
    currentGoldPrice: "0",
    taxPayer: {
      id: header.taxPayer.id.toString(),
      name: header.taxPayer.name,
      address: header.taxPayer.address ?? "",
      taxCode: header.taxPayer.taxCode,
    },
    groups,
  };
}

export function convertToRawReportXNTForm(r: ReportXNT): RawReportXNTForm {
  return {
    groupId: r.groupId.toString(),
    id: r.id.toString(),
    name: r.name,
    productCode: r.productCode ?? "",
    unit: r.unit ?? "chỉ",
    stt: r.stt.toString(),
    tonDauKyQuantity: r.tonDauKyQuantity.toString(),
    tonDauKyValue: r.tonDauKyValue.toString(),
    nhapQuantity: r.nhapQuantity.toString(),
    nhapValue: r.nhapValue.toString(),
    xuatQuantity: r.xuatQuantity.toString(),
    xuatValue: r.xuatValue.toString(),
    tonCuoiKyQuantity: r.tonCuoiKyQuantity.toString(),
    tonCuoiKyValue: r.tonCuoiKyValue.toString(),
    xuatThucTe: r.xuatThucTe.toString(),
    thue: r.thue.toString(),
  };
}

export function convertToRawReportXNTGroupForm(
  g: ReportXNTGroup & { ReportXNTs: ReportXNT[] }
): RawReportXNTGroupForm {
  const sum = <K extends keyof ReportXNT>(key: K) =>
    g.ReportXNTs.reduce((acc, r) => acc + Number(r[key] ?? 0), 0);

  return {
    headerId: g.headerId.toString(),
    id: g.id,
    name: g.name,
    stt: g.stt.toString(),
    tonDauKyQuantityTotal: sum("tonDauKyQuantity").toString(),
    tonDauKyValueTotal: sum("tonDauKyValue").toString(),
    nhapQuantityTotal: sum("nhapQuantity").toString(),
    nhapValueTotal: sum("nhapValue").toString(),
    xuatQuantityTotal: sum("xuatQuantity").toString(),
    xuatValueTotal: sum("xuatValue").toString(),
    tonCuoiKyQuantityTotal: sum("tonCuoiKyQuantity").toString(),
    tonCuoiKyValueTotal: sum("tonCuoiKyValue").toString(),
    xuatThucTe: sum("xuatThucTe").toString(),
    thue: sum("thue").toString(),
    reports: g.ReportXNTs.map(convertToRawReportXNTForm),
  };
}
