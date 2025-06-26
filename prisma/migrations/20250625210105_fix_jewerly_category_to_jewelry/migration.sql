/*
  Warnings:

  - You are about to drop the `JewerlyCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "JewerlyCategory";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "JewelryCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT 'gray',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

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
    CONSTRAINT "Jewelry_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "JewelryCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Jewelry_jewelryTypeId_fkey" FOREIGN KEY ("jewelryTypeId") REFERENCES "JewelryType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Jewelry" ("categoryId", "createdAt", "description", "gemName", "gemWeight", "goldWeight", "id", "inStock", "jewelryTypeId", "madeIn", "name", "reportXNTId", "size", "supplierId", "totalWeight", "updatedAt") SELECT "categoryId", "createdAt", "description", "gemName", "gemWeight", "goldWeight", "id", "inStock", "jewelryTypeId", "madeIn", "name", "reportXNTId", "size", "supplierId", "totalWeight", "updatedAt" FROM "Jewelry";
DROP TABLE "Jewelry";
ALTER TABLE "new_Jewelry" RENAME TO "Jewelry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
