import { z } from "zod";
import { transformCurrencyStringToNumber } from "@/utils/";
// Enum cho loại thanh toán
export const paymentTypeEnum = z.enum(["cash", "bank"]);

// Khoản thanh toán
export const rawPaymentAmountSchema = z.object({
  type: paymentTypeEnum,
  amount: z.string().min(1, "Số tiền không được để trống"),
});

// Chi tiết giao dịch vàng
export const rawGoldTransactionDetailSchema = z.object({
  id: z.string().optional(),
  goldId: z
    .string()
    .min(1, "id không được để trống")
    .transform(transformCurrencyStringToNumber),
  price: z
    .string()
    .min(1, "Giá không được để trống")
    .transform(transformCurrencyStringToNumber),
  weight: z
    .string()
    .min(1, "Trọng lượng không được để trống")
    .transform(transformCurrencyStringToNumber),
  discount: z.string().transform(transformCurrencyStringToNumber),
  amount: z
    .string()
    .min(1, "Thành tiền không được để trống")
    .transform(transformCurrencyStringToNumber),
});

// Chi tiết giao dịch trang sức
export const rawJewelryTransactionDetailSchema = z.object({
  id: z.string().min(1, "ID không được để trống"),
  jewelryId: z
    .string()
    .min(1, "id không được để trống")
    .transform(transformCurrencyStringToNumber),
  price: z
    .string()
    .min(1, "Giá không được để trống")
    .transform(transformCurrencyStringToNumber),
  weight: z
    .string()
    .min(1, "Trọng lượng không được để trống")
    .transform(transformCurrencyStringToNumber),
  discount: z.string().transform(transformCurrencyStringToNumber),
  amount: z
    .string()
    .min(1, "Thành tiền không được để trống")
    .transform(transformCurrencyStringToNumber),
});

// Schema giao dịch tổng
export const rawTransactionSchema = z.object({
  contactId: z.string().min(1, "Vui lòng chọn khách hàng"),
  note: z.string().optional(),
  date: z.string().optional(), // thường lấy new Date().toISOString() ở client
  //   paymentAmounts: z
  //     .array(rawPaymentAmountSchema)
  //     .min(1, "Phải có ít nhất một phương thức thanh toán"),
  goldDetails: z.array(rawGoldTransactionDetailSchema),
  jewelryDetails: z.array(rawJewelryTransactionDetailSchema),
  // })
  //   .refine((data) => data.goldDetails.length + data.jewelryDetails.length >= 1, {
  //     message: "Cần ít nhất một chi tiết giao dịch (vàng hoặc trang sức)",
  //     path: ["goldDetails"], // bạn có thể đặt ở `["jewelryDetails"]` tùy UI
});

export type TransactionInputDataForm = z.input<typeof rawTransactionSchema>;
export type TransactionOutputDataForm = z.output<typeof rawTransactionSchema>;
