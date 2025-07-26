import { z } from "zod";
import { rawReportXNTSchema } from "./reportXNTSchemas";

export const rawGroup = z.object({
  name: z
    .string()
    .min(1, "Tên không được để trống")
    .default("Tên nhóm báo cáo"),
  stt: z.string().min(1, "số thứ tự không bỏ trống").default("1"),
});

export type rawGroupFormData = z.input<typeof rawGroup>;

export const rawReportXNTGroupSchema = z.object({
  headerId: z.string().regex(/^\d+$/, "Phải là số"),

  id: z.number().min(1, "id không được để trống"),

  name: z.string().min(1, "Tên không được để trống"),

  stt: z.string().min(1),

  tonDauKyQuantityTotal: z.string(),
  tonDauKyValueTotal: z.string(),

  nhapQuantityTotal: z.string(),
  nhapValueTotal: z.string(),

  xuatQuantityTotal: z.string(),
  xuatValueTotal: z.string(),

  tonCuoiKyQuantityTotal: z.string(),
  tonCuoiKyValueTotal: z.string(),
  xuatThucTe: z.string(),
  thue: z.string(),
  reports: z.array(rawReportXNTSchema).optional(),
});

export const reportXNTSGroupchema = rawReportXNTGroupSchema.transform(
  (data) => ({
    headerId: parseInt(data.headerId),

    name: data.name,
    id: data.id,

    tonDauKyQuantityTotal: parseFloat(data.tonDauKyQuantityTotal ?? "0"),
    tonDauKyValueTotal: parseFloat(data.tonDauKyValueTotal ?? "0"),

    nhapQuantityTotal: parseFloat(data.nhapQuantityTotal ?? "0"),
    nhapValueTotal: parseFloat(data.nhapValueTotal ?? "0"),

    xuatQuantityTotal: parseFloat(data.xuatQuantityTotal ?? "0"),
    xuatValueTotal: parseFloat(data.xuatValueTotal ?? "0"),

    //   xuatDonGia: transformCurrencyStringToNumber(data.xuatDonGia ?? "0"),

    tonCuoiKyQuantityTotal: parseFloat(data.tonCuoiKyQuantityTotal ?? "0"),
    tonCuoiKyValueTotal: parseFloat(data.tonCuoiKyValueTotal ?? "0"),
  })
);

export const reportXNTGroupTransferedSchema = z.object({
  headerId: z.number().min(1),
  id: z.string().min(1),
  name: z.string().min(1),
  stt: z.string().min(1),
});

export type RawReportXNTGroupForm = z.input<typeof rawReportXNTGroupSchema>;
