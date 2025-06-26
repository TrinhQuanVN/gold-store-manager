/*
  Warnings:

  - You are about to drop the column `baoCaoXNTId` on the `Jewelry` table. All the data in the column will be lost.
  - You are about to drop the column `nhapValue` on the `ReportXNTHeader` table. All the data in the column will be lost.
  - You are about to drop the column `thueValue` on the `ReportXNTHeader` table. All the data in the column will be lost.
  - You are about to drop the column `tonCuoiKyValue` on the `ReportXNTHeader` table. All the data in the column will be lost.
  - You are about to drop the column `tonDauKyValue` on the `ReportXNTHeader` table. All the data in the column will be lost.
  - You are about to drop the column `xuatThucTeValue` on the `ReportXNTHeader` table. All the data in the column will be lost.
  - You are about to drop the column `xuatValue` on the `ReportXNTHeader` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JewerlyCategory" ADD COLUMN "color" TEXT DEFAULT 'gray';

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Jewelry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "goldWeight" REAL NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" INTEGER NOT NULL,
    "jewelryTypeId" INTEGER NOT NULL,
    "gemWeight" REAL NOT NULL DEFAULT 0,
    "totalWeight" REAL NOT NULL DEFAULT 0,
    "gemName" TEXT,
    "description" TEXT,
    "madeIn" TEXT DEFAULT 'Việt Nam',
    "size" TEXT,
    "reportXNTId" TEXT,
    "supplierId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Jewelry_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "JewerlyCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Jewelry_jewelryTypeId_fkey" FOREIGN KEY ("jewelryTypeId") REFERENCES "JewelryType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Jewelry" ("categoryId", "createdAt", "description", "gemName", "gemWeight", "goldWeight", "id", "inStock", "jewelryTypeId", "madeIn", "name", "size", "totalWeight", "updatedAt") SELECT "categoryId", "createdAt", "description", "gemName", "gemWeight", "goldWeight", "id", "inStock", "jewelryTypeId", "madeIn", "name", "size", "totalWeight", "updatedAt" FROM "Jewelry";
DROP TABLE "Jewelry";
ALTER TABLE "new_Jewelry" RENAME TO "Jewelry";
CREATE TABLE "new_ReportXNTHeader" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "taxPayerId" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "ReportXNTHeader_taxPayerId_fkey" FOREIGN KEY ("taxPayerId") REFERENCES "TaxPayer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReportXNTHeader" ("createdAt", "endDate", "id", "name", "quarter", "startDate", "taxPayerId", "updatedAt", "year") SELECT "createdAt", "endDate", "id", "name", "quarter", "startDate", "taxPayerId", "updatedAt", "year" FROM "ReportXNTHeader";
DROP TABLE "ReportXNTHeader";
ALTER TABLE "new_ReportXNTHeader" RENAME TO "ReportXNTHeader";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
