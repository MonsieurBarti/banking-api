-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('DEPOSIT', 'WITHDRAWAL');

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id_bank_account" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "account_number" UUID NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "owner_id" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id_bank_account")
);

-- CreateTable
CREATE TABLE "bank_operations" (
    "id_bank_operation" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "account_id" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bank_operations_pkey" PRIMARY KEY ("id_bank_operation")
);

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_operations" ADD CONSTRAINT "bank_operations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "bank_accounts"("id_bank_account") ON DELETE RESTRICT ON UPDATE CASCADE;
