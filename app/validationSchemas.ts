import z from "zod";
export const contactGrouptSchema = z.object({
  name: z.string().min(1, "name is required").max(255),
});

export const pathContactGroupSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  color: z.string(),
});

export const contactSchema = z.object({
  name: z.string().min(1, "name is required").max(255),
  groupId: z.string().min(1, "group_id is required"),
  phone: z.string().nullable().optional(), // Add more fields as needed
  cccd: z.string().nullable().optional(),
  taxcode: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});

export const pathContactSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  groupId: z
    .string()
    .min(1, "group id is required")
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), {
      message: "group id must be a number",
    }),
  phone: z.string().nullable().optional(), // Add more fields as needed
  cccd: z.string().nullable().optional(),
  taxcode: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});

export const jewelrySchema = z.object({
  name: z.string().min(1, "name is required").max(255),

  goldWeight: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "gold weight must be a positive number",
    }),

  jewelryTypeId: z
    .string()
    .min(1, "gold_kara_id is required")
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), {
      message: "gold_kara_id must be a number",
    }),

  categoryId: z
    .string()
    .min(1, "category_id is required")
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), {
      message: "category_id must be a number",
    }),

  gemName: z.string().nullable().optional(),
  gemWeight: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val.trim() === "") return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    }),

  totalWeight: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val.trim() === "") return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    }),

  description: z.string().nullable().optional(),
  madeIn: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
});

export const pathJewelrySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  goldWeight: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "gold weight must be a positive number",
    }),

  jewelryTypeId: z
    .string()
    .min(1, "gold_kara_id is required")
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), {
      message: "gold_kara_id must be a number",
    }),

  categoryId: z
    .string()
    .min(1, "category_id is required")
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), {
      message: "category_id must be a number",
    }),

  gemName: z.string().nullable().optional(),
  gemWeight: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val.trim() === "") return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    }),

  totalWeight: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val.trim() === "") return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    }),
  description: z.string().nullable().optional(),
  madeIn: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  inStock: z.enum(["true", "false"]).transform((val) => val === "true"),
});
