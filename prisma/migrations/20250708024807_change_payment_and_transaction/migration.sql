/*
  Warnings:

  - You are about to drop the `PaymentAmount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentHeader` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `unitPrice` on the `GoldTransactionDetail` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `JewelryTransactionDetail` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `TransactionHeader` table. All the data in the column will be lost.
  - Added the required column `amount` to the `GoldTransactionDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `GoldTransactionDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `JewelryTransactionDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `JewelryTransactionDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isExport` to the `TransactionHeader` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethode` to the `TransactionHeader` table without a default value. This is not possible if the table is not empty.
  - Made the column `contactId` on table `TransactionHeader` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PaymentAmount";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PaymentHeader";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PaymentDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "transactionHeaderId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "PaymentDetail_transactionHeaderId_fkey" FOREIGN KEY ("transactionHeaderId") REFERENCES "TransactionHeader" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GoldTransactionDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "goldId" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "weight" REAL NOT NULL,
    "discount" REAL NOT NULL DEFAULT 0,
    "amount" REAL NOT NULL,
    "transactionHeaderId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "GoldTransactionDetail_goldId_fkey" FOREIGN KEY ("goldId") REFERENCES "Gold" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GoldTransactionDetail_transactionHeaderId_fkey" FOREIGN KEY ("transactionHeaderId") REFERENCES "TransactionHeader" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GoldTransactionDetail" ("createdAt", "goldId", "id", "transactionHeaderId", "updatedAt", "weight") SELECT "createdAt", "goldId", "id", "transactionHeaderId", "updatedAt", "weight" FROM "GoldTransactionDetail";
DROP TABLE "GoldTransactionDetail";
ALTER TABLE "new_GoldTransactionDetail" RENAME TO "GoldTransactionDetail";
CREATE TABLE "new_JewelryTransactionDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jewelryId" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "discount" REAL NOT NULL DEFAULT 0,
    "amount" REAL NOT NULL,
    "transactionHeaderId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "JewelryTransactionDetail_jewelryId_fkey" FOREIGN KEY ("jewelryId") REFERENCES "Jewelry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "JewelryTransactionDetail_transactionHeaderId_fkey" FOREIGN KEY ("transactionHeaderId") REFERENCES "TransactionHeader" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_JewelryTransactionDetail" ("createdAt", "id", "jewelryId", "transactionHeaderId", "updatedAt") SELECT "createdAt", "id", "jewelryId", "transactionHeaderId", "updatedAt" FROM "JewelryTransactionDetail";
DROP TABLE "JewelryTransactionDetail";
ALTER TABLE "new_JewelryTransactionDetail" RENAME TO "JewelryTransactionDetail";
CREATE TABLE "new_TransactionHeader" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "note" TEXT,
    "isExport" BOOLEAN NOT NULL,
    "paymentMethode" TEXT NOT NULL,
    "contactId" INTEGER NOT NULL,
    "totalAmount" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "TransactionHeader_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TransactionHeader" ("contactId", "createdAt", "id", "note", "totalAmount", "updatedAt") SELECT "contactId", "createdAt", "id", "note", "totalAmount", "updatedAt" FROM "TransactionHeader";
DROP TABLE "TransactionHeader";
ALTER TABLE "new_TransactionHeader" RENAME TO "TransactionHeader";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
