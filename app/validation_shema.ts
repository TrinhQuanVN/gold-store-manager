import z from "zod";
export const contactGrouptSchema = z.object({
  name: z.string().min(1, "name is required").max(255),
});

export const pathContactGroupSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, "name is required").max(255),
  groupId: z.string().min(1, "group_id is required"),
  phone: z.string().nullable().optional(), // Add more fields as needed
  cccd: z.string().nullable().optional(),
  taxcode: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});

export const pathContactSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  groupId: z.string().min(1).optional(),
  phone: z.string().nullable().optional(), // Add more fields as needed
  cccd: z.string().nullable().optional(),
  taxcode: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});
