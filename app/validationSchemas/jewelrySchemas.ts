import { z } from "zod";

export const rawJewelrySchema = z.object({
  name: z.string().min(1, "Tên không được để trống").max(255, "Tên quá dài"),

  goldWeight: z.string().regex(/^\d+(\.\d+)?$/, "Trọng lượng vàng phải là số"),

  jewelryTypeId: z.string().regex(/^\d+$/, "Loại vàng không hợp lệ"),

  categoryId: z.string().regex(/^\d+$/, "Loại trang sức không hợp lệ"),

  gemName: z.string().nullable().optional(),

  gemWeight: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || val.trim() === "" || !isNaN(Number(val)),
      "Trọng lượng đá phải là số hoặc để trống"
    ),

  totalWeight: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || val.trim() === "" || !isNaN(Number(val)),
      "Tổng trọng lượng phải là số hoặc để trống"
    ),

  description: z.string().nullable().optional(),
  madeIn: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  reportXNTId: z.string().nullable().optional(),

  inStock: z.enum(["true", "false"]).optional(),

  supplierId: z.string().nullable().optional(), // ✅ mới thêm
});

export const jewelrySchema = rawJewelrySchema.transform((data) => ({
  ...data,
  goldWeight: parseFloat(data.goldWeight),
  jewelryTypeId: parseInt(data.jewelryTypeId),
  categoryId: parseInt(data.categoryId),
  gemWeight:
    data.gemWeight?.trim() === "" || data.gemWeight == null
      ? 0
      : parseFloat(data.gemWeight),
  totalWeight:
    data.totalWeight?.trim() === "" || data.totalWeight == null
      ? 0
      : parseFloat(data.totalWeight),
  inStock: data.inStock === "true",
  supplierId: data.supplierId?.trim() || null, // ✅ chuyển chuỗi rỗng thành null
}));
