import { Prisma } from "@prisma/client";

// Tạo include object như bình thường
export const transactionWithRelation = {
  include: {
    contact: {
      include: {
        group: true,
      },
    },
    goldTransactionDetails: {
      include: {
        gold: true,
      },
    },
    jewelryTransactionDetails: {
      include: {
        jewelry: {
          include: {
            category: true,
            jewelryType: true,
          },
        },
      },
    },
    paymentAmounts: true,
  },
};

export type TransactionHeaderWithRelation = Prisma.TransactionHeaderGetPayload<
  typeof transactionWithRelation
>;

export const contactWithGroup = {
  include: {
    group: true,
  },
} as const;

export type ContactWithGroup = Prisma.ContactGetPayload<
  typeof contactWithGroup
>;

export const jewelryWithRelation = {
  include: {
    category: true,
    jewelryType: true,
  },
} as const;

export type JewelryWithRelation = Prisma.JewelryGetPayload<
  typeof jewelryWithRelation
>;

export const reportXNTHeaderWithRelation = {
  include: {
    taxPayer: true,
    reportXNTs: {
      include: {
        golds: true,
        jewelries: {
          include: {
            category: true,
            jewelryType: true,
          },
        },
      },
    },
  },
};

export type ReportXNTHeaderWithRelation = Prisma.ReportXNTHeaderGetPayload<
  typeof reportXNTHeaderWithRelation
>;
