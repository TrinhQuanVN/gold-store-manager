import { Contact, ContactGroup } from "@prisma/client";
import { group } from "console";
import { z } from "zod";

export const rawContactGroup = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Xin nhập tên nhóm khách hàng").max(255),
  color: z.string().default("gray"),
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
  group: rawContactGroup.nullable(),
  phone: z.string().nullable(),
  cccd: z.string().nullable(),
  taxcode: z.string().nullable(),
  address: z.string().nullable(),
  note: z.string().nullable(),
});

export const contactSchema = rawContactSchema.transform((data) => ({
  ...data,
  groupId: parseInt(data.groupId!),
}));

export type RawContactDataForm = z.input<typeof rawContactSchema>;

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
