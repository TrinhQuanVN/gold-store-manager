/*
  Warnings:

  - You are about to drop the column `jewelryTypeId` on the `Jewelry` table. All the data in the column will be lost.
  - Added the required column `typeId` to the `Jewelry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Jewelry" DROP CONSTRAINT "Jewelry_jewelryTypeId_fkey";

-- AlterTable
ALTER TABLE "Jewelry" DROP COLUMN "jewelryTypeId",
ADD COLUMN     "typeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Jewelry" ADD CONSTRAINT "Jewelry_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "JewelryType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
