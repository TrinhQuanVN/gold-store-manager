import { z } from "zod";

export const rawGoldTransactionSchema = z.object({
  detailId: z.number(),
  goldId: z.string().optional(),
  name: z.string().optional(),
  weight: z.number().default(0),
  price: z.number().default(0),
  discount: z.number().default(0),
  amount: z.number().default(0),
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
  //   contactId: z.string().min(1),
});

export const pathContactGroupSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  color: z.string(),
});
