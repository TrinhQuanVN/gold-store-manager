import { z } from "zod";

export const contactGrouptSchema = z.object({
  name: z.string().min(1, "name is required").max(255),
});

export const pathContactGroupSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  color: z.string(),
});

export const rawContactSchema = z.object({
  name: z.string().min(1).max(255),
  groupId: z.string().min(1),
  phone: z.string().nullable().optional(),
  cccd: z.string().nullable().optional(),
  taxcode: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});

export const contactSchema = rawContactSchema.transform((data) => ({
  ...data,
  groupId: parseInt(data.groupId),
}));
