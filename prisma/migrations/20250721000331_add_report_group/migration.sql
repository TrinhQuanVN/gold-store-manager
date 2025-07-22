/*
  Warnings:

  - You are about to drop the column `headerId` on the `ReportXNT` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReportXNT" DROP CONSTRAINT "ReportXNT_headerId_fkey";

-- AlterTable
ALTER TABLE "ReportXNT" DROP COLUMN "headerId",
ADD COLUMN     "groupId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "stt" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "name" SET DEFAULT 'sản phẩm thuộc báo';

-- CreateTable
CREATE TABLE "ReportXNTGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'nhóm sản phẩm thuộc báo cáo',
    "stt" TEXT NOT NULL DEFAULT 'I',
    "headerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ReportXNTGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportXNTGroup" ADD CONSTRAINT "ReportXNTGroup_headerId_fkey" FOREIGN KEY ("headerId") REFERENCES "ReportXNTHeader"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportXNT" ADD CONSTRAINT "ReportXNT_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ReportXNTGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
