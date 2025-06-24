import { z } from "zod";

export const getCurrentQuarter = (): string => {
  const month = new Date().getMonth(); // 0-based: Jan = 0, Dec = 11
  return (Math.floor(month / 3) + 1).toString(); // 1 to 4
};
export const getCurrentYear = (): string => {
  return new Date().getFullYear().toString();
};

export const rawReportXNTHeaderSchema = z.object({
  name: z.string().min(1).max(255),
  quarter: z.string().min(1).max(1), // Assuming quarter is a single digit (1-4),
  year: z.string(),
  taxPayerId: z.string(),
  tonDauKyValue: z.string(),
  nhapValue: z.string(),
  xuatValue: z.string(),
  tonCuoiKyValue: z.string(),
  xuatThucTeValue: z.string(),
  thueValue: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

// export const reportXNTHeaderSchema = rawReportXNTHeaderSchema.transform(
//   (data) => ({
//     ...data,
//     quarter: parseInt(data.quarter),
//     year: parseInt(data.year),
//     taxPayerId: parseInt(data.taxPayerId),
//     tonDauKyValue: parseFloat(data.tonDauKyValue),
//     nhapValue: parseFloat(data.nhapValue),
//     xuatValue: parseFloat(data.xuatValue),
//     tonCuoiKyValue: parseFloat(data.tonCuoiKyValue),
//     xuatThucTeValue: parseFloat(data.xuatThucTeValue),
//     thueValue: parseFloat(data.thueValue),
//     startDate: new Date(data.startDate),
//     endDate: new Date(data.endDate),
//   })
// );
