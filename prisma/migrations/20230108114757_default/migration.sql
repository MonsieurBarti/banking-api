/*
  Warnings:

  - You are about to drop the column `account_number` on the `bank_accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bank_accounts" DROP COLUMN "account_number",
ALTER COLUMN "balance" SET DEFAULT 0;
