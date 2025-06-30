import { z } from "zod";

// 📥 Schema thô từ form (chỉ string)
export const rawGoldPriceSchema = z.object({
  name: z.string().min(1, "Tên không được để trống").max(255, "Tên quá dài"),

  buy: z.string().regex(/^\d+(\.\d+)?$/, "Giá mua vào phải là số"),

  sell: z.string().regex(/^\d+(\.\d+)?$/, "Giá bán ra phải là số"),
  createdAt: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{2}\/\d{2}\/\d{4}$/.test(val),
      "Ngày tháng phải theo định dạng DD/MM/YYYY"
    ),
});

// 🎯 Schema đã chuyển đổi cho backend (number)
export const goldPriceSchema = rawGoldPriceSchema.transform((data) => ({
  name: data.name,
  buy: parseFloat(data.buy),
  sell: parseFloat(data.sell),
  createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
}));
