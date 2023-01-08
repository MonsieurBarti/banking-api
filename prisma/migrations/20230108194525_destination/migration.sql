/*
  Warnings:

  - Added the required column `destination_account_id` to the `bank_operations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bank_operations" ADD COLUMN     "destination_account_id" UUID NOT NULL;
