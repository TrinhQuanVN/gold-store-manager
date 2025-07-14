import { z } from "zod";

export const rawReportXNTHeaderSchema = z.object({
  name: z.string().min(1).max(255),

  quarter: z.string().refine((val) => ["1", "2", "3", "4"].includes(val), {
    message: "Quý phải là 1, 2, 3 hoặc 4",
  }),

  year: z.string().regex(/^\d{4}$/, "Năm phải có định dạng 4 chữ số"),

  taxPayerId: z.string().regex(/^\d+$/, "taxPayerId phải là số"),

  startDate: z.string().min(1, "không bỏ trống"),

  endDate: z.string().min(1, "không bỏ trống"),
});

export const reportXNTHeaderSchema = rawReportXNTHeaderSchema.transform(
  (data) => ({
    ...data,
    quarter: parseInt(data.quarter),
    year: parseInt(data.year),
    taxPayerId: parseInt(data.taxPayerId),
    startDate: new Date(data.startDate)!,
    endDate: new Date(data.endDate)!,
  })
);
