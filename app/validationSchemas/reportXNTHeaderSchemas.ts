import { z } from "zod";
import { rawReportXNTGroupSchema } from "./reportXNTGroupSchemas";
import { rawTaxPayerSchema } from "./taxPayerSchemas";

export const rawReportXNTHeaderSchema = z.object({
  id: z.string().default("-1"),
  name: z.string().min(1).max(255).default("Báo cáo xuất nhập tồn"),

  quarter: z.string().refine((val) => ["1", "2", "3", "4"].includes(val), {
    message: "Quý phải là 1, 2, 3 hoặc 4",
  }),

  date: z.string().default(new Date().toISOString()),
  currentGoldPrice: z.string().default("0"),

  year: z.string().regex(/^\d{4}$/, "Năm phải có định dạng 4 chữ số"),

  taxPayerId: z.string().regex(/^\d+$/, "taxPayerId phải là số").default("1"),
  taxPayer: rawTaxPayerSchema.optional(),

  tonDauKyQuantityTotal: z.string().default("0"),
  tonDauKyValueTotal: z.string().default("0"),

  nhapQuantityTotal: z.string().default("0"),
  nhapValueTotal: z.string().default("0"),

  xuatQuantityTotal: z.string().default("0"),
  xuatValueTotal: z.string().default("0"),

  tonCuoiKyQuantityTotal: z.string().default("0"),
  tonCuoiKyValueTotal: z.string().default("0"),

  xuatThucTe: z.string().default("0"),
  thue: z.string().default("0"),

  groups: z.array(rawReportXNTGroupSchema).optional(),

  startDate: z.string().min(1, "không bỏ trống"),

  endDate: z.string().min(1, "không bỏ trống"),
});

export const reportXNTHeaderSchema = rawReportXNTHeaderSchema.transform(
  (data) => ({
    ...data,
    quarter: parseInt(data.quarter),
    year: parseInt(data.year),
    taxPayerId: parseInt(data.taxPayerId),
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
  })
);

export type RawReportXNTHeaderForm = z.input<typeof rawReportXNTHeaderSchema>;
