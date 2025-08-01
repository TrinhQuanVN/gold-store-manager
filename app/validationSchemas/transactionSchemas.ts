import { z } from "zod";
import { toNumberVN } from "@/utils/";
import { rawContactGroup, rawContactSchema } from "./contactSchemas";
// Enum cho loại thanh toán

export const paymentTypeEnum = z.enum(["CK", "TM"]);

export const rawPaymentAmountSchema = z.object({
  amount: z.string(),
  type: paymentTypeEnum,
});

// Chi tiết giao dịch vàng
export const rawGoldTransactionDetailSchema = z.object({
  goldId: z.string().min(1, "Id trống"),
  goldName: z.string().optional(),
  price: z.string().min(1, "Giá trống"),
  weight: z.string().min(1, "Trọng lượng trống"),
  discount: z.string().optional(),
  amount: z.string().min(1, "Thành tiền trống"),
});

// Chi tiết giao dịch trang sức
export const rawJewelryTransactionDetailSchema = z.object({
  jewelryId: z.string().min(1, "Id trống"),
  jewelryName: z.string().optional(),
  price: z.string().min(1, "Giá trống"),
  weight: z.string().min(1, "Trọng lượng trống"),
  discount: z.string().optional(),
  amount: z.string().min(1, "Thành tiền trống"),
});

export const paymentMethodeEnum = z.enum(["CK", "TM", "CK_TM"]);

export const rawTransactionHeaderSchema = z.object({
  id: z.string().optional(),
  isExport: z.boolean(),
  contactId: z.string().min(1, "Xin chọn khách hàng"),
  contactName: z.string().optional(),
  goldDetails: z.array(rawGoldTransactionDetailSchema),
  jewelryDetails: z.array(rawJewelryTransactionDetailSchema),
  payments: z
    .array(rawPaymentAmountSchema)
    .min(1, "Phải có ít nhất một phương thức thanh toán"),
  note: z.string().optional(),
  date: z.string(),
  currentGoldPrice: z.string(),
  totalAmount: z.string(), // sẽ transform thành number
  paymentMethode: paymentMethodeEnum,
});

export type RawTransactionHeaderFormData = z.input<
  typeof rawTransactionHeaderSchema
>;

export const transferedTransactionHeaderSchema =
  rawTransactionHeaderSchema.transform((data) => ({
    ...data,
    contactId: parseInt(data.contactId),
    currentGoldPrice: parseFloat(data.currentGoldPrice || "0"),
    date: new Date(data.date),
    goldDetails: data.goldDetails.map((detail) => ({
      goldId: parseInt(detail.goldId),
      price: parseFloat(detail.price || "0"),
      weight: parseFloat(detail.weight || "0"),
      discount: parseFloat(detail.discount || "0"),
      amount: parseFloat(detail.amount || "0"),
    })),
    jewelryDetails: data.jewelryDetails.map((detail) => ({
      jewelryId: parseInt(detail.jewelryId),
      price: parseFloat(detail.price || "0"),
      discount: parseFloat(detail.discount || "0"),
      amount: parseFloat(detail.amount || "0"),
    })),
    payments: data.payments.map((payment) => ({
      ...payment,
      amount: parseFloat(payment.amount || "0"),
    })),
    totalAmount: parseFloat(data.totalAmount || "0"),
  }));

// Schema giao dịch tổng
// export const rawTransactionSchema = z
//   .object({
//     header: rawTransactionHeaderSchema,
//     paymentAmounts: z.array(rawPaymentAmountSchema).min(1),

//     goldDetails: z.array(rawGoldTransactionDetailSchema),
//     jewelryDetails: z.array(rawJewelryTransactionDetailSchema),
//   })
//   .refine(
//     (data) => {
//       const validGold = data.goldDetails.filter((d) =>
//         Number.isFinite(d.goldId)
//       );
//       const validJewelry = data.jewelryDetails.filter((d) =>
//         Number.isFinite(d.jewelryId)
//       );
//       return validGold.length + validJewelry.length >= 1;
//     },
//     {
//       message:
//         "Cần ít nhất một chi tiết giao dịch hợp lệ (vàng hoặc trang sức)",
//       path: ["goldDetails"],
//     }
//   )
//   .refine(
//     (data) => {
//       const total = data.paymentAmounts.reduce(
//         (sum, p) => sum + p.amount, // amount đã là number
//         0
//       );
//       return Math.round(total) === Math.round(data.header.totalAmount); // so sánh an toàn hơn
//     },
//     {
//       message: "Tổng số tiền thanh toán không khớp với tổng cộng",
//       path: ["paymentAmounts"],
//     }
//   );

// export const transactionTransferSchema = z
//   .object({
//     header: z.object({
//       isExport: z.boolean(),
//       contactId: z.number(),
//       note: z.string().optional(),
//       date: z.string().optional(),
//       totalAmount: z.number(),
//       paymentMethode: z.enum(["CK", "TM", "CK_TM"]),
//     }),
//     paymentAmounts: z.array(
//       z.object({
//         amount: z.number(),
//         type: z.enum(["CK", "TM"]),
//       })
//     ),
//     goldDetails: z
//       .array(
//         z.object({
//           id: z.string().optional(),
//           goldId: z.number(),
//           price: z.number(),
//           weight: z.number(),
//           discount: z.number().optional(),
//           amount: z.number(),
//         })
//       )
//       .optional(),
//     jewelryDetails: z
//       .array(
//         z.object({
//           id: z.string().optional(),
//           jewelryId: z.number(),
//           price: z.number(),
//           weight: z.number(),
//           discount: z.number().optional(),
//           amount: z.number(),
//         })
//       )
//       .optional(),
//   })
//   .transform((data) => ({
//     ...data,
//     header: {
//       ...data.header,
//       date: data.header.date ? new Date(data.header.date) : undefined,
//     },
//   }));

// export type TransactionInputDataForm = z.input<typeof rawTransactionSchema>;
// export type TransactionOutputDataForm = z.output<typeof rawTransactionSchema>;
