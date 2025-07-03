import { z } from "zod";

export const rawGoldTransactionSchema = z.object({
  detailId: z.number(),
  goldId: z.string().optional(),
  name: z.string().optional(),
  weight: z.number().optional().default(0),
  price: z.number().optional().default(0),
  discount: z.number().optional().default(0),
  amount: z.number().optional().default(0),
});

export const SummaryRowSchema = z.object({
  id: z.string().default("summary"),
  totalCount: z.number().default(0),
  totalWeight: z.number().default(0),
  totalDiscount: z.number().default(0),
  totalAmount: z.number().default(0),
});

export const rawTransactionSchema = z.object({
  note: z.string().optional(),
  //   goldDetails: z.array(rawGoldTransactionSchema),
  // contactId: z.string().min(1),
});

export const rawJewelryTransactionSchema = z.object({
  detailId: z.number(), // Unique identifier for the row
  jewelryId: z.string().optional(),
  jewelryCode: z.string().optional(),
  fullName: z
    .object({
      jewelryName: z.string().optional(),
      typeName: z.string().optional(),
      typeColor: z.string().optional(),
      categoryName: z.string().optional(),
      categoryColor: z.string().optional(),
    })
    .optional(),
  weight: z.number().default(0),
  price: z.number().default(0),
  discount: z.number().default(0),
  amount: z.number().default(0),
});
