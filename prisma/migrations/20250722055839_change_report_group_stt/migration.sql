/*
  Warnings:

  - The `stt` column on the `ReportXNTGroup` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ReportXNTGroup" DROP COLUMN "stt",
ADD COLUMN     "stt" INTEGER NOT NULL DEFAULT 1;
