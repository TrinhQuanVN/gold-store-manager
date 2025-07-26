import { toNumberVN } from "@/utils";
import { Jewelry, JewelryType, JewelryCategory } from "@prisma/client";
import { create } from "domain";
import { z } from "zod";

export const rawJewelrySchema = z.object({
  id: z.string().optional(),
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
  reportProductCode: z.string(),

  type: z.object({
    id: z.string().optional(),
    name: z.string(),
    goldPercent: z.string(),
    color: z.string(),
  }),
  category: z.object({
    id: z.string().regex(/^\d+$/, "ID loại trang sức không hợp lệ"),
    name: z.string(),
    color: z.string(),
  }),

  supplierId: z.string(), // ✅ mới thêm
  createdAt: z.string(),
});

export const jewelrySchema = rawJewelrySchema.transform((data) => ({
  ...data,
  goldWeight: parseFloat(data.goldWeight),
  typeId: parseInt(data.typeId),
  categoryId: parseInt(data.categoryId),
  gemWeight:
    data.gemWeight?.trim() === "" || data.gemWeight == null
      ? 0
      : parseFloat(data.gemWeight),
  totalWeight:
    data.totalWeight?.trim() === "" || data.totalWeight == null
      ? 0
      : parseFloat(data.totalWeight),
  supplierId: data.supplierId?.trim() || null, // ✅ chuyển chuỗi rỗng thành null
}));

export type JewleryWithCategoryAndTypeDataForm = z.input<typeof jewelrySchema>;

export const convertJewleryWithCategoryAndTypeToRaw = (
  data: Jewelry & { jewelryType: JewelryType; category: JewelryCategory }
): JewleryWithCategoryAndTypeDataForm => {
  return {
    ...data,
    id: data.id?.toString() || "",
    goldWeight: data.goldWeight?.toString() || "",
    typeId: data.jewelryType.id?.toString() || "",
    categoryId: data.category.id?.toString() || "",
    gemWeight: data.gemWeight?.toString() || "",
    totalWeight: data.totalWeight?.toString() || "",
    supplierId: data.supplierId?.toString() || "",
    name: data.name,
    description: data.description || "",
    madeIn: data.madeIn || "",
    size: data.size || "",
    reportProductCode: data.reportProductCode || "",
    gemName: data.gemName || "",
    createdAt: data.createdAt.toISOString(),
    type: {
      id: data.jewelryType.id?.toString() || "",
      name: data.jewelryType.name,
      goldPercent: data.jewelryType.goldPercent?.toString() || "",
      color: data.jewelryType.color || "gray",
    },
    category: {
      id: data.category.id?.toString() || "",
      name: data.category.name,
      color: data.category.color || "gray",
    },
  };
};
