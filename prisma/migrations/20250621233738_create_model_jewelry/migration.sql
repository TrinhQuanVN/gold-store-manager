-- CreateTable
CREATE TABLE "JewelryType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "goldPercent" REAL NOT NULL DEFAULT 0.0,
    "description" TEXT,
    "color" TEXT DEFAULT 'gray',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "JewerlyCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Jewelry" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Jewelry_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "JewerlyCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Jewelry_jewelryTypeId_fkey" FOREIGN KEY ("jewelryTypeId") REFERENCES "JewelryType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
