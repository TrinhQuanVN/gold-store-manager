import { z } from "zod";

export const rawReportXNTSchema = z.object({
  groupId: z.string().regex(/^\d+$/, "Phải là số"),

  id: z.string().min(1, "id không được để trống"),

  name: z.string().min(1, "Tên không được để trống"),
  productCode: z.string().optional(),

  unit: z.string().optional(),
  stt: z.string(),

  tonDauKyQuantity: z.string().optional().nullable(),
  tonDauKyValue: z.string().optional().nullable(),

  nhapQuantity: z.string().optional().nullable(),
  nhapValue: z.string(),

  xuatQuantity: z.string().optional().nullable(),
  xuatValue: z.string().optional().nullable(),

  //   xuatDonGia: z.string().optional(),

  tonCuoiKyQuantity: z.string().optional().nullable(),
  tonCuoiKyValue: z.string().optional().nullable(),

  xuatThucTe: z.string().optional().nullable(),
  thue: z.string().optional().nullable(),
});

export const reportXNTSchema = rawReportXNTSchema.transform((data) => ({
  groupId: parseInt(data.groupId),

  name: data.name,
  id: data.id,
  unit: data.unit ?? "chỉ",

  tonDauKyQuantity: parseFloat(data.tonDauKyQuantity ?? "0"),
  tonDauKyValue: parseFloat(data.tonDauKyValue ?? "0"),

  nhapQuantity: parseFloat(data.nhapQuantity ?? "0"),
  nhapValue: parseFloat(data.nhapValue ?? "0"),

  xuatQuantity: parseFloat(data.xuatQuantity ?? "0"),
  xuatValue: parseFloat(data.xuatValue ?? "0"),

  //   xuatDonGia: transformCurrencyStringToNumber(data.xuatDonGia ?? "0"),

  tonCuoiKyQuantity: parseFloat(data.tonCuoiKyQuantity ?? "0"),
  tonCuoiKyValue: parseFloat(data.tonCuoiKyValue ?? "0"),
}));

export const reportXNTTransferedSchema = rawReportXNTSchema.transform(
  (data) => ({
    groupId: parseInt(data.groupId),

    id: data.id,
    name: data.name,
    productCode: data.productCode ?? "",
    unit: data.unit ?? "chỉ",
    stt: data.stt,

    tonDauKyQuantity: parseFloat(data.tonDauKyQuantity || "0"),
    tonDauKyValue: parseFloat(data.tonDauKyValue || "0"),

    nhapQuantity: parseFloat(data.nhapQuantity || "0"),
    nhapValue: parseFloat(data.nhapValue || "0"),

    xuatQuantity: parseFloat(data.xuatQuantity || "0"),
    xuatValue: parseFloat(data.xuatValue || "0"),

    tonCuoiKyQuantity: parseFloat(data.tonCuoiKyQuantity || "0"),
    tonCuoiKyValue: parseFloat(data.tonCuoiKyValue || "0"),

    xuatThucTe: parseFloat(data.xuatThucTe || "0"),
    thue: parseFloat(data.thue || "0"),
  })
);

export type RawReportXNTForm = z.input<typeof rawReportXNTSchema>;
