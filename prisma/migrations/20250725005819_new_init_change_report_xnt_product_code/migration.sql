/*
  Warnings:

  - You are about to drop the column `reportXNTId` on the `Gold` table. All the data in the column will be lost.
  - You are about to drop the column `reportXNTId` on the `Jewelry` table. All the data in the column will be lost.
  - The primary key for the `ReportXNT` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ReportXNT` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `productCode` to the `ReportXNT` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Gold" DROP CONSTRAINT "Gold_reportXNTId_fkey";

-- DropForeignKey
ALTER TABLE "Jewelry" DROP CONSTRAINT "Jewelry_reportXNTId_fkey";

-- AlterTable
ALTER TABLE "Gold" DROP COLUMN "reportXNTId",
ADD COLUMN     "reportProductCode" TEXT;

-- AlterTable
ALTER TABLE "Jewelry" DROP COLUMN "reportXNTId",
ADD COLUMN     "reportProductCode" TEXT;

-- AlterTable
ALTER TABLE "ReportXNT" DROP CONSTRAINT "ReportXNT_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "productCode" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "groupId" DROP DEFAULT,
ADD CONSTRAINT "ReportXNT_pkey" PRIMARY KEY ("id");
