import { Contact } from "@prisma/client";

export interface ContactSearchQuery {
  orderBy: keyof Contact;
  orderDirection: "asc" | "desc";
  page: string;
  pageSize: string;
  name?: string; // ✅ thêm dòng này
  cccd?: string; // ✅ thêm dòng này
  phone?: string; // ✅ thêm dòng này
}
