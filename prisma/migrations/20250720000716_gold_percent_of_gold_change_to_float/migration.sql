/*
  Warnings:

  - You are about to alter the column `goldPercent` on the `Gold` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Gold" ALTER COLUMN "goldPercent" SET DATA TYPE DOUBLE PRECISION;
