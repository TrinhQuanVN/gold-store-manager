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

const jewelryTempSchema = z
  .object({
    name: z.string().min(1),
    typeId: z.union([z.string(), z.number()]),
    categoryId: z.union([z.string(), z.number()]),
    goldWeight: z.union([z.string(), z.number()]),
    gemWeight: z.union([z.string(), z.number()]).optional(),
    totalWeight: z.union([z.string(), z.number()]).optional(),
    madeIn: z.string().nullable().optional(),
    size: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    supplierId: z.union([z.string(), z.number()]).nullable().optional(),
    reportProductCode: z.string().nullable().optional(),
  })
  .passthrough(); // giữ nguyên key chưa khai (nếu có)

// Chi tiết giao dịch trang sức
export const rawJewelryTransactionDetailSchema = z.object({
  tempId: z.string().optional(), //dùng cho import transaction
  jewelryId: z.string().optional(),
  jewelryName: z.string().optional(),
  price: z.string().min(1, "Giá trống"),
  weight: z.string().min(1, "Trọng lượng trống"),
  discount: z.string().optional(),
  amount: z.string().min(1, "Thành tiền trống"),
  jewelryTemp: jewelryTempSchema.optional().nullable(),
});

export const paymentMethodeEnum = z.enum(["CK", "TM", "CK_TM"]);

export const rawTransactionHeaderSchema = z
  .object({
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
  })
  .superRefine((data, ctx) => {
    // Ràng buộc jewelryDetails theo isExport
    for (let i = 0; i < data.jewelryDetails.length; i++) {
      const row = data.jewelryDetails[i];

      if (data.isExport) {
        if (!row.jewelryId || row.jewelryId.trim() === "") {
          ctx.addIssue({
            path: ["jewelryDetails", i, "jewelryId"],
            code: z.ZodIssueCode.custom,
            message: "Xuất: cần có Jewelry ID",
          });
        }
      } else {
        // Import: cho phép thiếu jewelryId; yêu cầu tối thiểu thông tin
        if (!row.jewelryName || !row.weight) {
          ctx.addIssue({
            path: ["jewelryDetails", i],
            code: z.ZodIssueCode.custom,
            message: "Nhập: cần tối thiểu Tên & Trọng lượng",
          });
        }
      }
    }

    // (Tuỳ chọn) Tổng tiền = tổng payments
    const sum = (xs: string[]) =>
      xs.reduce((a, b) => a + (parseFloat(b || "0") || 0), 0);
    const totalPayments = sum(data.payments.map((p) => p.amount));
    const totalAmount = parseFloat(data.totalAmount || "0") || 0;
    if (Math.abs(totalPayments - totalAmount) > 0.9) {
      ctx.addIssue({
        path: ["payments"],
        code: z.ZodIssueCode.custom,
        message: "Tổng thanh toán phải bằng Tổng tiền",
      });
    }
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
      ...detail,
      goldId: parseInt(detail.goldId),
      price: parseFloat(detail.price || "0"),
      weight: parseFloat(detail.weight || "0"),
      discount: parseFloat(detail.discount || "0"),
      amount: parseFloat(detail.amount || "0"),
    })),
    jewelryDetails: data.jewelryDetails.map((detail) => ({
      ...detail,
      jewelryId: parseInt(detail.jewelryId || "0"),
      price: parseFloat(detail.price || "0"),
      discount: parseFloat(detail.discount || "0"),
      amount: parseFloat(detail.amount || "0"),
      jewelryTemp: detail.jewelryTemp
        ? {
            ...detail.jewelryTemp, // lúc này đã không bị strip vì schema cho phép
            goldWeight: parseFloat(
              String(detail.jewelryTemp.goldWeight ?? "0")
            ),
            gemWeight: parseFloat(String(detail.jewelryTemp.gemWeight ?? "0")),
            totalWeight: parseFloat(
              String(detail.jewelryTemp.totalWeight ?? "0")
            ),
            typeId: parseInt(String(detail.jewelryTemp.typeId ?? "0")),
            categoryId: parseInt(String(detail.jewelryTemp.categoryId ?? "0")),
          }
        : undefined,
    })),
    payments: data.payments.map((payment) => ({
      ...payment,
      amount: parseFloat(payment.amount || "0"),
    })),
    totalAmount: parseFloat(data.totalAmount || "0"),
  }));
