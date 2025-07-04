import { z } from "zod";

// Enum cho loại thanh toán
export const paymentTypeEnum = z.enum(["cash", "bank"]);

// Khoản thanh toán
export const rawPaymentAmountSchema = z.object({
  type: paymentTypeEnum,
  amount: z.string().min(1, "Số tiền không được để trống"),
});

// Chi tiết giao dịch vàng
export const rawGoldTransactionDetailSchema = z.object({
  id: z.string().min(1, "ID không được để trống"),
  price: z.string().min(1, "Giá không được để trống"),
  weight: z.string().min(1, "Trọng lượng không được để trống"),
  discount: z.string().min(1, "Giảm giá không được để trống"),
  amount: z.string().min(1, "Thành tiền không được để trống"),
});

// Chi tiết giao dịch trang sức
export const rawJewelryTransactionDetailSchema = z.object({
  id: z.string().min(1, "ID không được để trống"),
  price: z.string().min(1, "Giá không được để trống"),
  weight: z.string().min(1, "Trọng lượng không được để trống"),
  discount: z.string().min(1, "Giảm giá không được để trống"),
  amount: z.string().min(1, "Thành tiền không được để trống"),
});

// Schema giao dịch tổng
export const rawTransactionSchema = z.object({
  contactId: z.string().min(1, "Vui lòng chọn khách hàng"),
  note: z.string().optional(),
  date: z.string().optional(), // thường lấy new Date().toISOString() ở client
  //     paymentAmounts: z
  //       .array(rawPaymentAmountSchema)
  //       .min(1, "Phải có ít nhất một phương thức thanh toán"),
  //     goldDetails: z.array(rawGoldTransactionDetailSchema),
  //     jewelryDetails: z.array(rawJewelryTransactionDetailSchema),
  //   })
  //   .refine((data) => data.goldDetails.length + data.jewelryDetails.length >= 1, {
  //     message: "Cần ít nhất một chi tiết giao dịch (vàng hoặc trang sức)",
  //     path: ["goldDetails"], // bạn có thể đặt ở `["jewelryDetails"]` tùy UI
});

export type RawTransactionDataForm = z.infer<typeof rawTransactionSchema>;
