import { toNumberVN } from "@/utils";
import { z } from "zod";

export const rawJewelrySchema = z.object({
  name: z.string().min(1, "Tên không được để trống").max(255, "Tên quá dài"),

  goldWeight: z.string().regex(/^\d+(\.\d+)?$/, "Trọng lượng vàng phải là số"),

  typeId: z.string().regex(/^\d+$/, "Loại vàng không hợp lệ"),

  categoryId: z.string().regex(/^\d+$/, "Loại trang sức không hợp lệ"),

  gemName: z.string(),

  gemWeight: z
    .string()
    .refine(
      (val) => !val || val.trim() === "" || !isNaN(toNumberVN(val)),
      "Trọng lượng đá phải là số hoặc để trống"
    ),

  totalWeight: z
    .string()
    .refine(
      (val) => !val || val.trim() === "" || !isNaN(toNumberVN(val)),
      "Tổng trọng lượng phải là số hoặc để trống"
    ),

  description: z.string(),
  madeIn: z.string(),
  size: z.string(),
  reportXNTId: z.string(),

  supplierId: z.string(), // ✅ mới thêm
});

export const jewelrySchema = rawJewelrySchema.transform((data) => ({
  ...data,
  goldWeight: toNumberVN(data.goldWeight),
  typeId: parseInt(data.typeId),
  categoryId: parseInt(data.categoryId),
  gemWeight:
    data.gemWeight?.trim() === "" || data.gemWeight == null
      ? 0
      : toNumberVN(data.gemWeight),
  totalWeight:
    data.totalWeight?.trim() === "" || data.totalWeight == null
      ? 0
      : toNumberVN(data.totalWeight),
  supplierId: data.supplierId?.trim() || null, // ✅ chuyển chuỗi rỗng thành null
}));
