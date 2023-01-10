/*
  Warnings:

  - You are about to drop the column `type` on the `bank_operations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bank_operations" DROP COLUMN "type";

-- DropEnum
DROP TYPE "OperationType";
