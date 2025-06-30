import { GoldPrice } from "@prisma/client";

export interface GoldPriceSearchQuery {
  orderBy: keyof GoldPrice;
  orderDirection: "asc" | "desc";
  page: string;
  pageSize: string;
  startDate?: string; // ✅ thêm dòng này
  endDate?: string; // ✅ thêm dòng này
}
