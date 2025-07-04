import { Contact, ContactGroup } from "@prisma/client";
import { z } from "zod";

export const rawContactGroup = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Xin nhập tên nhóm khách hàng").max(255),
  color: z.string().optional(),
  description: z.string().optional(),
});

export const pathContactGroupSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  color: z.string(),
});

export const rawContactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Xin nhập tên khách hàng").max(255),
  groupId: z.string().min(1, "Xin chọn nhóm khách hàng"),
  phone: z.string().nullable().optional(),
  cccd: z.string().nullable().optional(),
  taxcode: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});

export const contactSchema = rawContactSchema.transform((data) => ({
  ...data,
  groupId: parseInt(data.groupId!),
}));

export type RawContactDataForm = z.infer<typeof rawContactSchema>;

// export function toRawContact(
//   contact: Contact & { group: ContactGroup }
// ): RawContactDataForm {
//   return {
//     id: contact.id.toString(), // vì rawContactSchema yêu cầu id là string
//     name: contact.name,
//     group: {
//       id: contact.group.id.toString(),
//       name: contact.group.name,
//       description: contact.group.description ?? "",
//       color: contact.group.color ?? "gray",
//     },
//     phone: contact.phone ?? "",
//     cccd: contact.cccd ?? "",
//     taxcode: contact.taxcode ?? "",
//     address: contact.address ?? "",
//     note: contact.note ?? "",
//   };
// }
