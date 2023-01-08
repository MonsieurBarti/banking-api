/*
  Warnings:

  - You are about to drop the column `account_id` on the `bank_operations` table. All the data in the column will be lost.
  - Added the required column `source_account_id` to the `bank_operations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bank_operations" DROP CONSTRAINT "bank_operations_account_id_fkey";

-- AlterTable
ALTER TABLE "bank_operations" DROP COLUMN "account_id",
ADD COLUMN     "service_id" UUID,
ADD COLUMN     "source_account_id" UUID NOT NULL,
ADD COLUMN     "user_id" UUID;

-- AddForeignKey
ALTER TABLE "bank_operations" ADD CONSTRAINT "bank_operations_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id_service") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_operations" ADD CONSTRAINT "bank_operations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_operations" ADD CONSTRAINT "bank_operations_source_account_id_fkey" FOREIGN KEY ("source_account_id") REFERENCES "bank_accounts"("id_bank_account") ON DELETE RESTRICT ON UPDATE CASCADE;
