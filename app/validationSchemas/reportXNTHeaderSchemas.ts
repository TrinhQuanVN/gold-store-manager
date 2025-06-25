import { z } from "zod";

// Hàm parse chuỗi dd/MM/yyyy thành Date
const parseDDMMYYYY = (val: string) => {
  const [day, month, year] = val.split("/").map(Number);
  const date = new Date(year, month - 1, day); // tháng bắt đầu từ 0
  return isNaN(date.getTime()) ? null : date;
};

export const rawReportXNTHeaderSchema = z.object({
  name: z.string().min(1).max(255),

  quarter: z.string().refine((val) => ["1", "2", "3", "4"].includes(val), {
    message: "Quý phải là 1, 2, 3 hoặc 4",
  }),

  year: z.string().regex(/^\d{4}$/, "Năm phải có định dạng 4 chữ số"),

  taxPayerId: z.string().regex(/^\d+$/, "taxPayerId phải là số"),

  startDate: z
    .string()
    .regex(
      /^\d{2}\/\d{2}\/\d{4}$/,
      "Ngày bắt đầu phải có định dạng dd/MM/yyyy"
    ),

  endDate: z
    .string()
    .regex(
      /^\d{2}\/\d{2}\/\d{4}$/,
      "Ngày kết thúc phải có định dạng dd/MM/yyyy"
    ),
});

export const reportXNTHeaderSchema = rawReportXNTHeaderSchema
  .refine(
    (data) => {
      const start = parseDDMMYYYY(data.startDate);
      const end = parseDDMMYYYY(data.endDate);
      return start && end && start < end;
    },
    {
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      path: ["endDate"],
    }
  )
  .transform((data) => ({
    ...data,
    quarter: parseInt(data.quarter),
    year: parseInt(data.year),
    taxPayerId: parseInt(data.taxPayerId),
    startDate: parseDDMMYYYY(data.startDate)!,
    endDate: parseDDMMYYYY(data.endDate)!,
  }));
