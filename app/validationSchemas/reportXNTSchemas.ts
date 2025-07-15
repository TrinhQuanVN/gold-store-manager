import { z } from "zod";
import { transformCurrencyStringToNumber } from "@/utils"; // nếu bạn dùng định dạng VND từ input

export const rawReportXNTSchema = z.object({
  headerId: z.string().regex(/^\d+$/, "Phải là số"),

  id: z.string().min(1, "id không được để trống"),

  name: z.string().min(1, "Tên không được để trống"),

  unit: z.string().optional(),

  tonDauKyQuantity: z.string().optional(),
  tonDauKyValue: z.string().optional(),

  nhapQuantity: z.string().optional(),
  nhapValue: z.string().optional(),

  xuatQuantity: z.string().optional(),
  xuatValue: z.string().optional(),

  //   xuatDonGia: z.string().optional(),

  tonCuoiKyQuantity: z.string().optional(),
  tonCuoiKyValue: z.string().optional(),
});

export const reportXNTSchema = rawReportXNTSchema.transform((data) => ({
  headerId: parseInt(data.headerId),

  name: data.name,
  id: data.id,
  unit: data.unit ?? "chỉ",

  tonDauKyQuantity: transformCurrencyStringToNumber(
    data.tonDauKyQuantity ?? "0"
  ),
  tonDauKyValue: transformCurrencyStringToNumber(data.tonDauKyValue ?? "0"),

  nhapQuantity: transformCurrencyStringToNumber(data.nhapQuantity ?? "0"),
  nhapValue: transformCurrencyStringToNumber(data.nhapValue ?? "0"),

  xuatQuantity: transformCurrencyStringToNumber(data.xuatQuantity ?? "0"),
  xuatValue: transformCurrencyStringToNumber(data.xuatValue ?? "0"),

  //   xuatDonGia: transformCurrencyStringToNumber(data.xuatDonGia ?? "0"),

  tonCuoiKyQuantity: transformCurrencyStringToNumber(
    data.tonCuoiKyQuantity ?? "0"
  ),
  tonCuoiKyValue: transformCurrencyStringToNumber(data.tonCuoiKyValue ?? "0"),
}));
