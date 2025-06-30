/*
  Warnings:

  - The primary key for the `Gold` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Gold` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `goldId` on the `GoldTransactionDetail` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Gold" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "goldPercent" REAL NOT NULL DEFAULT 0.0,
    "reportXNTId" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Gold" ("createdAt", "description", "goldPercent", "id", "name", "reportXNTId", "updatedAt") SELECT "createdAt", "description", "goldPercent", "id", "name", "reportXNTId", "updatedAt" FROM "Gold";
DROP TABLE "Gold";
ALTER TABLE "new_Gold" RENAME TO "Gold";
CREATE TABLE "new_GoldTransactionDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "goldId" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    "weight" REAL NOT NULL,
    "transactionHeaderId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "GoldTransactionDetail_goldId_fkey" FOREIGN KEY ("goldId") REFERENCES "Gold" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GoldTransactionDetail_transactionHeaderId_fkey" FOREIGN KEY ("transactionHeaderId") REFERENCES "TransactionHeader" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GoldTransactionDetail" ("createdAt", "goldId", "id", "transactionHeaderId", "unitPrice", "updatedAt", "weight") SELECT "createdAt", "goldId", "id", "transactionHeaderId", "unitPrice", "updatedAt", "weight" FROM "GoldTransactionDetail";
DROP TABLE "GoldTransactionDetail";
ALTER TABLE "new_GoldTransactionDetail" RENAME TO "GoldTransactionDetail";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
