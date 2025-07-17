-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('BANK', 'CASH');

-- CreateEnum
CREATE TYPE "PaymentMethode" AS ENUM ('BANK', 'CASH', 'CASH_AND_BANK');

-- CreateTable
CREATE TABLE "ContactGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT 'gray',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ContactGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL,
    "unaccentName" TEXT NOT NULL,
    "address" TEXT,
    "cccd" TEXT,
    "taxcode" TEXT,
    "phone" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JewelryType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "goldPercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "description" TEXT,
    "color" TEXT DEFAULT 'gray',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "JewelryType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JewelryCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT 'gray',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "JewelryCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jewelry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "goldWeight" DOUBLE PRECISION NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "jewelryTypeId" INTEGER NOT NULL,
    "gemWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gemName" TEXT,
    "description" TEXT,
    "madeIn" TEXT DEFAULT 'Việt Nam',
    "size" TEXT,
    "reportXNTId" TEXT,
    "supplierId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Jewelry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxPayer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "taxCode" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "TaxPayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportXNTHeader" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "taxPayerId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ReportXNTHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportXNT" (
    "id" TEXT NOT NULL,
    "headerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT DEFAULT 'chỉ',
    "tonDauKyQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tonDauKyValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nhapQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nhapValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "xuatQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "xuatValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tonCuoiKyQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tonCuoiKyValue" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ReportXNT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gold" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "goldPercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "description" TEXT,
    "reportXNTId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Gold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JewelryTransactionDetail" (
    "id" SERIAL NOT NULL,
    "jewelryId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionHeaderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "JewelryTransactionDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoldTransactionDetail" (
    "id" SERIAL NOT NULL,
    "goldId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionHeaderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "GoldTransactionDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionHeader" (
    "id" SERIAL NOT NULL,
    "note" TEXT,
    "isExport" BOOLEAN NOT NULL,
    "paymentMethode" "PaymentMethode" NOT NULL,
    "contactId" INTEGER NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "TransactionHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentDetail" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionHeaderId" INTEGER NOT NULL,
    "type" "PaymentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PaymentDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoldPrice" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "buy" DOUBLE PRECISION NOT NULL,
    "sell" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "GoldPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaxPayer_taxCode_key" ON "TaxPayer"("taxCode");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ContactGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jewelry" ADD CONSTRAINT "Jewelry_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "JewelryCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jewelry" ADD CONSTRAINT "Jewelry_jewelryTypeId_fkey" FOREIGN KEY ("jewelryTypeId") REFERENCES "JewelryType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jewelry" ADD CONSTRAINT "Jewelry_reportXNTId_fkey" FOREIGN KEY ("reportXNTId") REFERENCES "ReportXNT"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportXNTHeader" ADD CONSTRAINT "ReportXNTHeader_taxPayerId_fkey" FOREIGN KEY ("taxPayerId") REFERENCES "TaxPayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportXNT" ADD CONSTRAINT "ReportXNT_headerId_fkey" FOREIGN KEY ("headerId") REFERENCES "ReportXNTHeader"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gold" ADD CONSTRAINT "Gold_reportXNTId_fkey" FOREIGN KEY ("reportXNTId") REFERENCES "ReportXNT"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JewelryTransactionDetail" ADD CONSTRAINT "JewelryTransactionDetail_jewelryId_fkey" FOREIGN KEY ("jewelryId") REFERENCES "Jewelry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JewelryTransactionDetail" ADD CONSTRAINT "JewelryTransactionDetail_transactionHeaderId_fkey" FOREIGN KEY ("transactionHeaderId") REFERENCES "TransactionHeader"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoldTransactionDetail" ADD CONSTRAINT "GoldTransactionDetail_goldId_fkey" FOREIGN KEY ("goldId") REFERENCES "Gold"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoldTransactionDetail" ADD CONSTRAINT "GoldTransactionDetail_transactionHeaderId_fkey" FOREIGN KEY ("transactionHeaderId") REFERENCES "TransactionHeader"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHeader" ADD CONSTRAINT "TransactionHeader_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentDetail" ADD CONSTRAINT "PaymentDetail_transactionHeaderId_fkey" FOREIGN KEY ("transactionHeaderId") REFERENCES "TransactionHeader"("id") ON DELETE CASCADE ON UPDATE CASCADE;
