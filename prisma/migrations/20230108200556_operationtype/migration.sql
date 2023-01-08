/*
  Warnings:

  - You are about to drop the column `destination_account_id` on the `bank_operations` table. All the data in the column will be lost.
  - You are about to drop the column `source_account_id` on the `bank_operations` table. All the data in the column will be lost.
  - Added the required column `account_id` to the `bank_operations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `bank_operations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bank_operations" DROP CONSTRAINT "bank_operations_source_account_id_fkey";

-- AlterTable
ALTER TABLE "bank_operations" DROP COLUMN "destination_account_id",
DROP COLUMN "source_account_id",
ADD COLUMN     "account_id" UUID NOT NULL,
ADD COLUMN     "type" "OperationType" NOT NULL;

-- AddForeignKey
ALTER TABLE "bank_operations" ADD CONSTRAINT "bank_operations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "bank_accounts"("id_bank_account") ON DELETE RESTRICT ON UPDATE CASCADE;
