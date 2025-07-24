import { RawTransactionHeaderFormData } from "@/app/validationSchemas";
import {
  PaymentDetail,
  Contact,
  ContactGroup,
  GoldTransactionDetail,
  Jewelry,
  JewelryTransactionDetail,
  TransactionHeader,
  Gold,
} from "@prisma/client";

export function converttoRawTransactionHeaderFormData(
  transaction: TransactionHeader & {
    contact: Contact & {
      group: ContactGroup;
    };
    goldTransactionDetails: (GoldTransactionDetail & { gold: Gold })[];
    jewelryTransactionDetails: (JewelryTransactionDetail & {
      jewelry: Jewelry;
    })[];
    paymentAmounts: PaymentDetail[];
  }
): RawTransactionHeaderFormData {
  return {
    id: transaction.id.toString(),
    paymentMethode: transaction.paymentMethode,
    isExport: transaction.isExport || true,
    contactId: transaction.contact.id.toString(),
    contactName: transaction.contact.name,
    note: transaction.note || "",
    date: transaction.createdAt.toISOString(),
    goldDetails: transaction.goldTransactionDetails.map((g) => ({
      goldId: g.goldId.toString(),
      goldName: g.gold.name,
      amount: g.amount.toString(),
      price: g.price.toString(),
      weight: g.weight.toString(),
    })),
    jewelryDetails: transaction.jewelryTransactionDetails.map((j) => ({
      jewelryId: j.jewelryId.toString(),
      jewelryName: j.jewelry.name,
      weight: j.jewelry.goldWeight.toString(),
      amount: j.amount.toString(),
      price: j.price.toString(),
    })),
    payments: transaction.paymentAmounts.map((p) => ({
      id: p.id,
      type: p.type,
      amount: p.amount.toString(),
    })),
    totalAmount:
      (
        transaction.goldTransactionDetails.reduce(
          (sum, g) => sum + Number(g.amount ?? 0),
          0
        ) +
        transaction.jewelryTransactionDetails.reduce(
          (sum, j) => sum + Number(j.amount ?? 0),
          0
        )
      ).toString() || "0",
    currentGoldPrice: transaction.goldPrice.toString() || "0",
  };
}
