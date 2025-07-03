import z from "zod";
import { rawGoldTransactionSchema } from "@/app/validationSchemas";

export function createEmptyGoldRows(
  count = 5
): z.infer<typeof rawGoldTransactionSchema>[] {
  return Array.from({ length: count }, (_, i) => ({
    detailId: i,
    goldId: "",
    name: "",
    weight: 0,
    price: 0,
    discount: 0,
    amount: 0,
  }));
}
