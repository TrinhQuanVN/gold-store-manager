/*
  Warnings:

  - The values [BANK,CASH,CASH_AND_BANK] on the enum `PaymentMethode` will be removed. If these variants are still used in the database, this will fail.
  - The values [BANK,CASH] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `totalAmount` on the `TransactionHeader` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethode_new" AS ENUM ('CK', 'TM', 'CK_TM');
ALTER TABLE "TransactionHeader" ALTER COLUMN "paymentMethode" TYPE "PaymentMethode_new" USING ("paymentMethode"::text::"PaymentMethode_new");
ALTER TYPE "PaymentMethode" RENAME TO "PaymentMethode_old";
ALTER TYPE "PaymentMethode_new" RENAME TO "PaymentMethode";
DROP TYPE "PaymentMethode_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('CK', 'TM');
ALTER TABLE "PaymentDetail" ALTER COLUMN "type" TYPE "PaymentType_new" USING ("type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "PaymentType_old";
COMMIT;

-- AlterTable
ALTER TABLE "TransactionHeader" DROP COLUMN "totalAmount";
