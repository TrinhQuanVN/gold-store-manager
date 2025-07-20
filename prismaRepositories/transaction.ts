// import {
//   Contact,
//   ContactGroup,
//   Gold,
//   GoldTransactionDetail,
//   Jewelry,
//   JewelryCategory,
//   JewelryTransactionDetail,
//   JewelryType,
// } from "@prisma/client";
// import { convertJewelryRelationToNumber, JewelryRelationNumber } from ".";
// import { Decimal } from "@prisma/client/runtime/library";
// import { TransactionHeaderWithRelation } from "@/types";

// export type PaymentDetailNumber = {
//   id: number;
//   amount: number;
//   transactionHeaderId: number;
//   type: "BANK" | "CASH";
//   createdAt: Date;
//   updatedAt?: Date;
// };

// export type GoldTransactionDetailNumber = {
//   id: number;
//   goldId: number;
//   price: number;
//   weight: number;
//   discount: number;
//   amount: number;
//   transactionHeaderId: number;
//   createdAt: Date;
//   updatedAt?: Date;
//   gold: Gold; // hoặc GoldNumber nếu bạn có định nghĩa dạng number
// };

// export type JewelryTransactionDetailNumber = {
//   id: number;
//   jewelryId: number;
//   price: number;
//   discount: number;
//   amount: number;
//   transactionHeaderId: number;
//   createdAt: Date;
//   updatedAt?: Date;
//   jewelry: JewelryRelationNumber;
// };

// // export type TransactionHeaderRelationNumber = {
// //   id: number;
// //   note?: string;
// //   isExport: boolean;
// //   paymentMethode: "CK" | "TM" | "CK_TM";
// //   contactId: number;
// //   contact: ContactWithGroup;
// //   totalAmount: number;
// //   createdAt: Date;
// //   updatedAt?: Date;
// //   paymentAmounts: PaymentDetailNumber[];
// //   goldTransactionDetails: GoldTransactionDetailNumber[];
// //   jewelryTransactionDetails: JewelryTransactionDetailNumber[];
// // };

// const toNumber = (value: number | Decimal | null | undefined): number =>
//   value === null || value === undefined
//     ? 0
//     : typeof value === "number"
//     ? value
//     : Number(value.toString());

// export const convertTransactionHeaderRelationToNumber = (
//   transaction: TransactionHeaderWithRelation
// ): TransactionHeaderRelationNumber => ({
//   id: transaction.id,
//   note: transaction.note ?? undefined,
//   isExport: transaction.isExport,
//   paymentMethode: transaction.paymentMethode,
//   contactId: transaction.contactId,
//   contact: transaction.contact,
//   totalAmount: toNumber(transaction.totalAmount),
//   createdAt: transaction.createdAt,
//   updatedAt: transaction.updatedAt ?? undefined,

//   paymentAmounts: transaction.paymentAmounts.map((p) => ({
//     id: p.id,
//     amount: toNumber(p.amount),
//     transactionHeaderId: p.transactionHeaderId,
//     type: p.type,
//     createdAt: p.createdAt,
//     updatedAt: p.updatedAt ?? undefined,
//   })),

//   goldTransactionDetails: transaction.goldTransactionDetails.map((g) => ({
//     id: g.id,
//     goldId: g.goldId,
//     price: toNumber(g.price),
//     weight: toNumber(g.weight),
//     discount: toNumber(g.discount),
//     amount: toNumber(g.amount),
//     transactionHeaderId: g.transactionHeaderId,
//     createdAt: g.createdAt,
//     updatedAt: g.updatedAt ?? undefined,
//     gold: g.gold,
//   })),

//   jewelryTransactionDetails: transaction.jewelryTransactionDetails.map((j) => ({
//     id: j.id,
//     jewelryId: j.jewelryId,
//     price: toNumber(j.price),
//     discount: toNumber(j.discount),
//     amount: toNumber(j.amount),
//     transactionHeaderId: j.transactionHeaderId,
//     createdAt: j.createdAt,
//     updatedAt: j.updatedAt ?? undefined,
//     jewelry: convertJewelryRelationToNumber(j.jewelry),
//   })),
// });

// export const convertGoldTransactionDetailToNumber = (
//   detail: GoldTransactionDetail & { gold: Gold }
// ): GoldTransactionDetailNumber => ({
//   id: detail.id,
//   goldId: detail.goldId,
//   price: toNumber(detail.price),
//   weight: toNumber(detail.weight),
//   discount: toNumber(detail.discount),
//   amount: toNumber(detail.amount),
//   transactionHeaderId: detail.transactionHeaderId,
//   createdAt: detail.createdAt,
//   updatedAt: detail.updatedAt ?? undefined,
//   gold: detail.gold,
// });

// export const convertJewelryTransactionDetailToNumber = (
//   detail: JewelryTransactionDetail & {
//     jewelry: Jewelry & {
//       category: JewelryCategory;
//       jewelryType: JewelryType;
//     };
//   }
// ): JewelryTransactionDetailNumber => ({
//   id: detail.id,
//   jewelryId: detail.jewelryId,
//   price: toNumber(detail.price),
//   discount: toNumber(detail.discount),
//   amount: toNumber(detail.amount),
//   transactionHeaderId: detail.transactionHeaderId,
//   createdAt: detail.createdAt,
//   updatedAt: detail.updatedAt ?? undefined,
//   jewelry: convertJewelryRelationToNumber(detail.jewelry),
// });
