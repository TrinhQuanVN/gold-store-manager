import { z } from "zod";

export const rawTaxPayerSchema = z.object({
  id: z.string().nullable(),

  name: z
    .string()
    .min(1, "Tên không được để trống")
    .default("Tên người nộp thuế"),

  taxCode: z.string().min(1, "không được để trống").default("mã số thuế"),

  address: z.string().min(1, "không được để trống").default("Địa chỉ"),
});

export type RawTaxPayerForm = z.input<typeof rawTaxPayerSchema>;
