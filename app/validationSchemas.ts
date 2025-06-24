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

export const reportXNTHeaderSchema = z.object({
  name: z.string().min(1, "name is required").max(255),
  quarter: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => [1, 2, 3, 4].includes(val), {
      message: "quarter must be 1 to 4",
    }),
  year: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 2000 && val < 2100, {
      message: "year must be a valid year",
    }),

  taxPayerId: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), {
      message: "taxPayerId must be a number",
    }),

  tonDauKyValue: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, {
      message: "tonDauKyValue must be a positive number",
    }),

  nhapValue: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, {
      message: "nhapValue must be a positive number",
    }),

  xuatValue: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, {
      message: "xuatValue must be a positive number",
    }),

  tonCuoiKyValue: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, {
      message: "tonCuoiKyValue must be a positive number",
    }),

  xuatThucTeValue: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, {
      message: "xuatThucTeValue must be a positive number",
    }),

  thueValue: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, {
      message: "thueValue must be a positive number",
    }),

  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "startDate must be a valid date",
  }),

  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "endDate must be a valid date",
  }),
});

export const pathReportXNTHeaderSchema = z.object({
  name: z.string().min(1).max(255).optional(),

  quarter: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => [1, 2, 3, 4].includes(val), {
      message: "quarter must be 1 to 4",
    })
    .optional(),

  year: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 2000 && val < 2100, {
      message: "year must be valid",
    })
    .optional(),

  taxPayerId: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), {
      message: "taxPayerId must be a number",
    })
    .optional(),

  tonDauKyValue: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, {
      message: "tonDauKyValue must be a positive number",
    })
    .optional(),

  nhapValue: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, {
      message: "nhapValue must be a positive number",
    })
    .optional(),

  xuatValue: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, {
      message: "xuatValue must be a positive number",
    })
    .optional(),

  tonCuoiKyValue: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, {
      message: "tonCuoiKyValue must be a positive number",
    })
    .optional(),

  xuatThucTeValue: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, {
      message: "xuatThucTeValue must be a positive number",
    })
    .optional(),

  thueValue: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, {
      message: "thueValue must be a positive number",
    })
    .optional(),

  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "startDate must be a valid date",
    })
    .optional(),

  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "endDate must be a valid date",
    })
    .optional(),
});
