export type JewelryCategoryNumber = {
  id: number;
  name: string;
  description?: string;
  color?: string;
};

export type JewelryTypeNumber = {
  id: number;
  name: string;
  goldPercent: number;
  description?: string;
  color?: string;
};

export type JewelryNumber = {
  id: number;
  name: string;

  goldWeight: number;
  gemWeight: number;
  totalWeight: number;

  categoryId: number;
  typeId: number;

  gemName?: string;
  description?: string;
  madeIn?: string;
  size?: string;
  reportXNTId?: string;
  supplierId?: string;

  createdAt: Date;
  updatedAt?: Date;
};

export type JewelryRelationNumber = {
  id: number;
  name: string;

  goldWeight: number;
  gemWeight: number;
  totalWeight: number;

  categoryId: number;
  category: JewelryCategoryNumber;

  typeId: number;
  jewelryType: JewelryTypeNumber;

  gemName?: string;
  description?: string;
  madeIn?: string;
  size?: string;
  reportXNTId?: string;
  supplierId?: string;

  createdAt: Date;
  updatedAt?: Date;
};

import { Jewelry, JewelryCategory, JewelryType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const toNumber = (value: number | Decimal | null | undefined): number =>
  value === null || value === undefined
    ? 0
    : typeof value === "number"
    ? value
    : Number(value.toString());

export const convertJewelryRelationToNumber = (
  jewelry: Jewelry & {
    category: JewelryCategory;
    jewelryType: JewelryType;
  }
): JewelryRelationNumber => {
  return {
    id: jewelry.id,
    name: jewelry.name,
    goldWeight: toNumber(jewelry.goldWeight),
    gemWeight: toNumber(jewelry.gemWeight),
    totalWeight: toNumber(jewelry.totalWeight),

    categoryId: jewelry.categoryId,
    category: {
      id: jewelry.category.id,
      name: jewelry.category.name,
      color: jewelry.category.color ?? undefined,
    },

    typeId: jewelry.typeId,
    jewelryType: {
      id: jewelry.jewelryType.id,
      name: jewelry.jewelryType.name,
      goldPercent: toNumber(jewelry.jewelryType.goldPercent),
      color: jewelry.jewelryType.color ?? undefined,
    },

    gemName: jewelry.gemName ?? undefined,
    description: jewelry.description ?? undefined,
    madeIn: jewelry.madeIn ?? undefined,
    size: jewelry.size ?? undefined,
    reportXNTId: jewelry.reportXNTId ?? undefined,
    supplierId: jewelry.supplierId ?? undefined,

    createdAt: jewelry.createdAt,
    updatedAt: jewelry.updatedAt ?? undefined,
  };
};

export const convertJewelryCategoryToNumber = (
  category: JewelryCategory
): JewelryCategoryNumber => ({
  id: category.id,
  name: category.name,
  description: category.description ?? undefined,
  color: category.color ?? undefined,
});

export const convertJewelryTypeToNumber = (
  type: JewelryType
): JewelryTypeNumber => ({
  id: type.id,
  name: type.name,
  goldPercent: toNumber(type.goldPercent),
  description: type.description ?? undefined,
  color: type.color ?? undefined,
});

export const convertJewelryToNumber = (jewelry: Jewelry): JewelryNumber => ({
  id: jewelry.id,
  name: jewelry.name,

  goldWeight: toNumber(jewelry.goldWeight),
  gemWeight: toNumber(jewelry.gemWeight),
  totalWeight: toNumber(jewelry.totalWeight),

  categoryId: jewelry.categoryId,

  typeId: jewelry.typeId,

  gemName: jewelry.gemName ?? undefined,
  description: jewelry.description ?? undefined,
  madeIn: jewelry.madeIn ?? undefined,
  size: jewelry.size ?? undefined,
  reportXNTId: jewelry.reportXNTId ?? undefined,
  supplierId: jewelry.supplierId ?? undefined,

  createdAt: jewelry.createdAt,
  updatedAt: jewelry.updatedAt ?? undefined,
});
