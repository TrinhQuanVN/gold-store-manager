/*
  Warnings:

  - You are about to drop the column `description` on the `TransactionHeader` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `TransactionHeader` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `TransactionHeader` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TransactionHeader" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "note" TEXT,
    "type" INTEGER NOT NULL,
    "contactId" INTEGER,
    "totalAmount" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "TransactionHeader_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TransactionHeader" ("contactId", "createdAt", "id", "totalAmount", "type", "updatedAt") SELECT "contactId", "createdAt", "id", "totalAmount", "type", "updatedAt" FROM "TransactionHeader";
DROP TABLE "TransactionHeader";
ALTER TABLE "new_TransactionHeader" RENAME TO "TransactionHeader";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
