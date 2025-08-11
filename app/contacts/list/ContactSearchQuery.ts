import { ContactListView } from "@prisma/client";

export interface ContactSearchQuery {
  orderBy: keyof ContactListView;
  orderDirection: "asc" | "desc";
  page: string;
  pageSize: string;
  id?: string;
  name?: string; // ✅ thêm dòng này
  cccd?: string; // ✅ thêm dòng này
  phone?: string; // ✅ thêm dòng này
}
