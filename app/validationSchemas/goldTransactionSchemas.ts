import { z } from "zod";

export const rawGoldTransactionSchema = z.object({
  id: z.string(),

  goldId: z.string(),
  price: z.string(),
  discount: z.string(),
  weight: z.string(),
  amount: z.string(),
});

// export const jewelryTransactionSchema = rawGoldTransactionSchema.transform(
//   (data) => ({
//     groupId: parseInt(data.groupId),

//     name: data.name,
//     id: data.id,
//     unit: data.unit ?? "chỉ",

//     tonDauKyQuantity: parseFloat(data.tonDauKyQuantity ?? "0"),
//     tonDauKyValue: parseFloat(data.tonDauKyValue ?? "0"),

//     nhapQuantity: parseFloat(data.nhapQuantity ?? "0"),
//     nhapValue: parseFloat(data.nhapValue ?? "0"),

//     xuatQuantity: parseFloat(data.xuatQuantity ?? "0"),
//     xuatValue: parseFloat(data.xuatValue ?? "0"),

//     //   xuatDonGia: transformCurrencyStringToNumber(data.xuatDonGia ?? "0"),

//     tonCuoiKyQuantity: parseFloat(data.tonCuoiKyQuantity ?? "0"),
//     tonCuoiKyValue: parseFloat(data.tonCuoiKyValue ?? "0"),
//   })
// );

export type RawGoldTransactionForm = z.infer<typeof rawGoldTransactionSchema>;
