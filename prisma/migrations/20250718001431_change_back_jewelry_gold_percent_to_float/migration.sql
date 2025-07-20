/*
  Warnings:

  - You are about to alter the column `goldPercent` on the `JewelryType` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "JewelryType" ALTER COLUMN "goldPercent" SET DATA TYPE DOUBLE PRECISION;
