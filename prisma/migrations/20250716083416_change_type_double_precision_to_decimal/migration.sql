/*
  Warnings:

  - You are about to alter the column `goldPercent` on the `Gold` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `buy` on the `GoldPrice` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `sell` on the `GoldPrice` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `price` on the `GoldTransactionDetail` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `weight` on the `GoldTransactionDetail` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `discount` on the `GoldTransactionDetail` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `amount` on the `GoldTransactionDetail` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `goldWeight` on the `Jewelry` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `gemWeight` on the `Jewelry` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `totalWeight` on the `Jewelry` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `price` on the `JewelryTransactionDetail` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `discount` on the `JewelryTransactionDetail` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `amount` on the `JewelryTransactionDetail` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `amount` on the `PaymentDetail` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `tonDauKyQuantity` on the `ReportXNT` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `tonDauKyValue` on the `ReportXNT` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `nhapQuantity` on the `ReportXNT` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `nhapValue` on the `ReportXNT` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `xuatQuantity` on the `ReportXNT` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `xuatValue` on the `ReportXNT` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `tonCuoiKyQuantity` on the `ReportXNT` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `tonCuoiKyValue` on the `ReportXNT` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `totalAmount` on the `TransactionHeader` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Gold" ALTER COLUMN "goldPercent" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "GoldPrice" ALTER COLUMN "buy" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "sell" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "GoldTransactionDetail" ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "weight" SET DEFAULT 0,
ALTER COLUMN "weight" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "discount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Jewelry" ALTER COLUMN "goldWeight" SET DEFAULT 0,
ALTER COLUMN "goldWeight" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "gemWeight" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "totalWeight" SET DATA TYPE DECIMAL(10,4);

-- AlterTable
ALTER TABLE "JewelryTransactionDetail" ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "discount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "PaymentDetail" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "ReportXNT" ALTER COLUMN "tonDauKyQuantity" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "tonDauKyValue" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "nhapQuantity" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "nhapValue" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "xuatQuantity" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "xuatValue" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "tonCuoiKyQuantity" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "tonCuoiKyValue" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "TransactionHeader" ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(10,2);
