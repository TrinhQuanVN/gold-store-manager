import { z } from "zod";
import { toNumberVN } from "@/utils/";
// Enum cho loại thanh toán

export const paymentTypeEnum = z.enum(["CK", "TM"]);

export const rawPaymentAmountSchema = z
  .object({
    amount: z.string().min(1, "Trống !!!"),
    type: paymentTypeEnum,
  })
  .transform((data) => ({
    ...data,
    amount: toNumberVN(data.amount),
  }));

// Chi tiết giao dịch vàng
export const rawGoldTransactionDetailSchema = z
  .object({
    goldId: z.string().min(1, "Id trống"),
    goldName: z.string().optional(),
    price: z.string().min(1, "Giá trống"),
    weight: z.string().min(1, "Trọng lượng trống"),
    discount: z.string().optional(),
    amount: z.string().min(1, "Thành tiền trống"),
  })
  .transform((data) => ({
    ...data,
    goldId: parseInt(data.goldId ?? ""),
    price: toNumberVN(data.price ?? ""),
    weight: toNumberVN(data.weight ?? ""),
    discount: toNumberVN(data.discount ?? ""),
    amount: toNumberVN(data.amount ?? ""),
  }));

// Chi tiết giao dịch trang sức
export const rawJewelryTransactionDetailSchema = z
  .object({
    jewelryId: z.string().min(1, "Id trống"),
    jewelryName: z.string().optional(),
    price: z.string().min(1, "Giá trống"),
    weight: z.string().min(1, "Trọng lượng trống"),
    discount: z.string().optional(),
    amount: z.string().min(1, "Thành tiền trống"),
  })
  .transform((data) => ({
    ...data,
    jewelryId: parseInt(data.jewelryId ?? ""),
    price: toNumberVN(data.price ?? ""),
    weight: toNumberVN(data.weight ?? ""),
    discount: toNumberVN(data.discount ?? ""),
    amount: toNumberVN(data.amount ?? ""),
  }));

export const paymentMethodeEnum = z.enum(["CK", "TM", "CK_TM"]);

export const rawTransactionHeaderSchema = z
  .object({
    isExport: z.boolean().default(true),
    contactId: z.string().min(1, "Vui lòng chọn khách hàng"),
    note: z.string(),
    date: z.string(),
    currentGoldPrice: z.string(),
    totalAmount: z.string(), // sẽ transform thành number
    paymentMethode: paymentMethodeEnum,
  })
  .transform((data) => ({
    ...data,
    contactId: parseInt(data.contactId),
    totalAmount: toNumberVN(data.totalAmount ?? "0"),
  }));

// Schema giao dịch tổng
export const rawTransactionSchema = z
  .object({
    header: rawTransactionHeaderSchema,
    paymentAmounts: z.array(rawPaymentAmountSchema).min(1),

    goldDetails: z.array(rawGoldTransactionDetailSchema),
    jewelryDetails: z.array(rawJewelryTransactionDetailSchema),
  })
  .refine(
    (data) => {
      const validGold = data.goldDetails.filter((d) =>
        Number.isFinite(d.goldId)
      );
      const validJewelry = data.jewelryDetails.filter((d) =>
        Number.isFinite(d.jewelryId)
      );
      return validGold.length + validJewelry.length >= 1;
    },
    {
      message:
        "Cần ít nhất một chi tiết giao dịch hợp lệ (vàng hoặc trang sức)",
      path: ["goldDetails"],
    }
  )
  .refine(
    (data) => {
      const total = data.paymentAmounts.reduce(
        (sum, p) => sum + p.amount, // amount đã là number
        0
      );
      return Math.round(total) === Math.round(data.header.totalAmount); // so sánh an toàn hơn
    },
    {
      message: "Tổng số tiền thanh toán không khớp với tổng cộng",
      path: ["paymentAmounts"],
    }
  );

export const transactionTransferSchema = z
  .object({
    header: z.object({
      isExport: z.boolean(),
      contactId: z.number(),
      note: z.string().optional(),
      date: z.string().optional(),
      totalAmount: z.number(),
      paymentMethode: z.enum(["CK", "TM", "CK_TM"]),
    }),
    paymentAmounts: z.array(
      z.object({
        amount: z.number(),
        type: z.enum(["CK", "TM"]),
      })
    ),
    goldDetails: z
      .array(
        z.object({
          id: z.string().optional(),
          goldId: z.number(),
          price: z.number(),
          weight: z.number(),
          discount: z.number().optional(),
          amount: z.number(),
        })
      )
      .optional(),
    jewelryDetails: z
      .array(
        z.object({
          id: z.string().optional(),
          jewelryId: z.number(),
          price: z.number(),
          weight: z.number(),
          discount: z.number().optional(),
          amount: z.number(),
        })
      )
      .optional(),
  })
  .transform((data) => ({
    ...data,
    header: {
      ...data.header,
      date: data.header.date ? new Date(data.header.date) : undefined,
    },
  }));

export type TransactionInputDataForm = z.input<typeof rawTransactionSchema>;
export type TransactionOutputDataForm = z.output<typeof rawTransactionSchema>;
