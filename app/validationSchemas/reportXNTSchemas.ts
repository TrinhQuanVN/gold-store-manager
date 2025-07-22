import { z } from "zod";

export const rawReportXNTSchema = z.object({
  groupId: z.string().regex(/^\d+$/, "Phải là số").default("0"),

  id: z.string().min(1, "id không được để trống").default("mã sản phẩm"),

  name: z.string().min(1, "Tên không được để trống").default("tên sản phẩm"),

  unit: z.string().optional(),
  stt: z.string().default("1"),

  tonDauKyQuantity: z.string().default("0"),
  tonDauKyValue: z.string().default("0"),

  nhapQuantity: z.string().default("0"),
  nhapValue: z.string().default("0"),

  xuatQuantity: z.string().default("0"),
  xuatValue: z.string().default("0"),

  //   xuatDonGia: z.string().optional(),

  tonCuoiKyQuantity: z.string().default("0"),
  tonCuoiKyValue: z.string().default("0"),

  xuatThucTe: z.string().default("0"),
  thue: z.string().default("0"),
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

export const reportXNTTransferedSchema = z.object({
  headerId: z.number().min(1),
  id: z.string().min(1),
  name: z.string().min(1),
  nhapQuantity: z.number().optional(),
  nhapValue: z.number().optional(),
  tonCuoiKyQuantity: z.number().optional(),
  tonCuoiKyValue: z.number().optional(),
  tonDauKyQuantity: z.number().optional(),
  tonDauKyValue: z.number().optional(),
  xuatQuantity: z.number().optional(),
  xuatValue: z.number().optional(),
});

export type RawReportXNTForm = z.input<typeof rawReportXNTSchema>;
