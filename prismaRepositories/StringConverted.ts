import { JewelryWithRelation, TransactionHeaderWithRelation } from "@/types";
import { toDateStringVn, toStringVN } from "@/utils";
import {
  Contact,
  ContactGroup,
  Gold,
  GoldPrice,
  GoldTransactionDetail,
  Jewelry,
  JewelryCategory,
  JewelryTransactionDetail,
  JewelryType,
  PaymentDetail,
  TransactionHeader,
} from "@prisma/client";

export type ConvertedJewlery = {
  id: number;
  name: string;

  goldWeight: number;
  gemWeight: number;
  totalWeight: number;

  categoryId: number;
  typeId: number;

  gemName: string;

  description: string;
  madeIn: string;
  size: string;

  reportXNTId: string;

  supplierId: string;

  createdAt: string;
  updatedAt: string;
};

export type ConvertedJewelryWithCateogryAndType = ConvertedJewlery & {
  category: JewelryCategory;
  jewelryType: JewelryType;
};

export const convertPrismaJewelryWithCateogryAndTypeToString = (
  j: JewelryWithRelation
): ConvertedJewelryWithCateogryAndType => {
  const base = convertPrismaJewelryToString(j);

  return {
    ...base,
    category: j.category,
    jewelryType: j.jewelryType,
  };
};

export const convertPrismaJewelryToString = (j: Jewelry): ConvertedJewlery => ({
  id: j.id,
  name: j.name,

  goldWeight: Number(j.goldWeight),
  gemWeight: Number(j.gemWeight),
  totalWeight: Number(j.totalWeight),

  categoryId: j.categoryId,
  typeId: j.categoryId,

  gemName: j.gemName ?? "",

  description: j.description ?? "",
  madeIn: j.madeIn ?? "",
  size: j.size ?? "",

  reportXNTId: j.reportXNTId ?? "",

  supplierId: j.supplierId?.toString() ?? "",

  createdAt: j.createdAt.toISOString(),
  updatedAt: j.updatedAt?.toISOString() ?? "",
});

export type ConvertedGoldPrice = {
  id: number;
  name: string;
  buy: number;
  sell: number;
  createdAt: string;
  updatedAt: string;
};

export const convertGoldPriceToString = (g: GoldPrice): ConvertedGoldPrice => ({
  id: g.id,
  name: g.name,
  buy: Number(g.buy),
  sell: Number(g.sell),
  createdAt: g.createdAt.toISOString(),
  updatedAt: g.updatedAt?.toISOString() ?? "",
});

export type ConvertedPaymentDetail = {
  id: number;
  transactionHeaderId: number;
  amount: number;
  type: "CK" | "TM";
  createdAt: string;
  updatedAt: string;
};

export const convertPaymentDetailToString = (
  p: PaymentDetail
): ConvertedPaymentDetail => ({
  id: p.id,
  transactionHeaderId: p.transactionHeaderId,
  amount: Number(p.amount),
  type: p.type,
  createdAt: p.createdAt.toISOString(),
  updatedAt: p.updatedAt?.toISOString() ?? "",
});

export type ConvertedJewelryTransactionDetail = {
  id: number;
  jewelryId: number;
  transactionHeaderId: number;
  price: number;
  discount: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

export const convertJewelryTransactionDetailToString = (
  d: JewelryTransactionDetail
): ConvertedJewelryTransactionDetail => ({
  id: d.id,
  jewelryId: d.jewelryId,
  transactionHeaderId: d.transactionHeaderId,
  price: Number(d.price),
  discount: Number(d.discount),
  amount: Number(d.amount),
  createdAt: d.createdAt.toISOString(),
  updatedAt: d.updatedAt?.toISOString() ?? "",
});

export type ConvertedGoldTransactionDetail = {
  id: number;
  goldId: number;
  transactionHeaderId: number;
  price: number;
  weight: number;
  discount: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

export const convertGoldTransactionDetailToString = (
  d: GoldTransactionDetail
): ConvertedGoldTransactionDetail => ({
  id: d.id,
  goldId: d.goldId,
  transactionHeaderId: d.transactionHeaderId,
  price: Number(d.price),
  weight: Number(d.weight),
  discount: Number(d.discount),
  amount: Number(d.amount),
  createdAt: d.createdAt.toISOString(),
  updatedAt: d.updatedAt?.toISOString() ?? "",
});

export type ConvertedTransactionHeader = {
  id: number;
  note: string;
  contactId: number;
  paymentMethode: "CK" | "TM" | "CK_TM";
  isExport: boolean;
  createdAt: string;
  updatedAt: string;
};

export const convertTransactionHeaderToString = (
  d: TransactionHeader
): ConvertedTransactionHeader => ({
  id: d.id,
  note: d.note ?? "",
  contactId: d.contactId,
  paymentMethode: d.paymentMethode,
  isExport: d.isExport,
  createdAt: d.createdAt.toISOString(),
  updatedAt: d.updatedAt?.toISOString() ?? "",
});

export type ConvertedTransactionHeaderWithRelation =
  ConvertedTransactionHeader & {
    contact: Contact & { group: ContactGroup };
    goldTransactionDetails: (ConvertedGoldTransactionDetail & { gold: Gold })[];
    jewelryTransactionDetails: (ConvertedJewelryTransactionDetail & {
      jewelry: ConvertedJewelryWithCateogryAndType;
    })[];
    paymentAmounts: ConvertedPaymentDetail[];
  };

export const convertPrismaTransactionHeaderWithRelationToString = (
  t: TransactionHeaderWithRelation
): ConvertedTransactionHeaderWithRelation => {
  const base = convertTransactionHeaderToString(t);

  return {
    ...base,
    contact: t.contact as Contact & { group: ContactGroup },

    goldTransactionDetails: t.goldTransactionDetails.map((d) => ({
      ...convertGoldTransactionDetailToString(d),
      gold: d.gold,
    })),

    jewelryTransactionDetails: t.jewelryTransactionDetails.map((d) => ({
      ...convertJewelryTransactionDetailToString(d),
      jewelry: convertPrismaJewelryWithCateogryAndTypeToString(d.jewelry),
    })),

    paymentAmounts: t.paymentAmounts.map(convertPaymentDetailToString),
  };
};
