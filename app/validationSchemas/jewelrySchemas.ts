import { z } from "zod";

export const rawJewelrySchema = z.object({
  name: z.string().min(1).max(255),
  goldWeight: z.string(),
  jewelryTypeId: z.string().min(1),
  categoryId: z.string().min(1),
  gemName: z.string().nullable().optional(),
  gemWeight: z.string().nullable().optional(),
  totalWeight: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  madeIn: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  inStock: z.enum(["true", "false"]).optional(),
});

export const jewelrySchema = rawJewelrySchema.transform((data) => ({
  ...data,
  goldWeight: parseFloat(data.goldWeight),
  jewelryTypeId: parseInt(data.jewelryTypeId),
  categoryId: parseInt(data.categoryId),
  gemWeight: data.gemWeight?.trim() ? parseFloat(data.gemWeight) : null,
  totalWeight: data.totalWeight?.trim() ? parseFloat(data.totalWeight) : null,
  inStock: data.inStock === "true",
}));
