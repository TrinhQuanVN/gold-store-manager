import z from "zod";
import {
  rawGoldTransactionSchema,
  rawJewelryTransactionSchema,
} from "@/app/validationSchemas";

export function createEmptyGoldRows(count = 5) {
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

export function createEmptyJewelryRows(): z.infer<
  typeof rawJewelryTransactionSchema
>[] {
  return Array.from({ length: 5 }, (_, i) => {
    return {
      detailId: i,
      jewelryId: "",
      jewelryCode: "",
      fullName: {},
      weight: 0,
      price: 0,
      discount: 0,
      amount: 0,
    };
  });
}
