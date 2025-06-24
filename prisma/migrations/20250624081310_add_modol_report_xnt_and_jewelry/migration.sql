-- AlterTable
ALTER TABLE "Jewelry" ADD COLUMN "baoCaoXNTId" TEXT;

-- CreateTable
CREATE TABLE "TaxPayer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "taxCode" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "ReportXNTHeader" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "taxPayerId" INTEGER NOT NULL,
    "tonDauKyValue" REAL NOT NULL DEFAULT 0,
    "nhapValue" REAL NOT NULL DEFAULT 0,
    "xuatValue" REAL NOT NULL DEFAULT 0,
    "tonCuoiKyValue" REAL NOT NULL DEFAULT 0,
    "xuatThucTeValue" REAL NOT NULL DEFAULT 0,
    "thueValue" REAL NOT NULL DEFAULT 0,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "ReportXNTHeader_taxPayerId_fkey" FOREIGN KEY ("taxPayerId") REFERENCES "TaxPayer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReportXNT" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "headerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT DEFAULT 'chỉ',
    "tonDauKyQuantity" REAL NOT NULL DEFAULT 0,
    "tonDauKyValue" REAL NOT NULL DEFAULT 0,
    "nhapQuantity" REAL NOT NULL DEFAULT 0,
    "nhapValue" REAL NOT NULL DEFAULT 0,
    "xuatQuantity" REAL NOT NULL DEFAULT 0,
    "xuatValue" REAL NOT NULL DEFAULT 0,
    "xuatDonGia" REAL NOT NULL DEFAULT 0,
    "tonCuoiKyQuantity" REAL NOT NULL DEFAULT 0,
    "tonCuoiKyValue" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "ReportXNT_headerId_fkey" FOREIGN KEY ("headerId") REFERENCES "ReportXNTHeader" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TaxPayer_taxCode_key" ON "TaxPayer"("taxCode");
