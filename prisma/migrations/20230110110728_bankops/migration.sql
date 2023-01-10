/*
  Warnings:

  - You are about to drop the column `account_id` on the `bank_operations` table. All the data in the column will be lost.
  - Added the required column `from_id` to the `bank_operations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_id` to the `bank_operations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bank_operations" DROP CONSTRAINT "bank_operations_account_id_fkey";

-- AlterTable
ALTER TABLE "bank_operations" DROP COLUMN "account_id",
ADD COLUMN     "from_id" UUID NOT NULL,
ADD COLUMN     "to_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "bank_operations" ADD CONSTRAINT "bank_operations_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "bank_accounts"("id_bank_account") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_operations" ADD CONSTRAINT "bank_operations_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "bank_accounts"("id_bank_account") ON DELETE RESTRICT ON UPDATE CASCADE;
