import { Injectable } from '@nestjs/common';
import { AppException } from '@utils/app-exception';
import { BankAccounts, BankOperations } from '@prisma/client';
import {
  CreateAccount,
  CreateAccountResponse,
  OperationIssuer,
} from './utils/banking.models';
import { PrismaService } from 'src/core/prisma.service';

@Injectable()
export class BankingService {
  constructor(private prisma: PrismaService) {}

  async createAccount(
    account: CreateAccount,
    owner_id: string,
  ): Promise<CreateAccountResponse> {
    try {
      return await this.prisma.bankAccounts.create({
        data: { name: account.name, owner_id },
        select: { id_bank_account: true },
      });
    } catch (error) {
      throw new AppException(`Error while creating new bank account`, {
        message: error.message,
        data: account,
      });
    }
  }

  async getAllAccounts(owner_id: string): Promise<BankAccounts[]> {
    try {
      return await this.prisma.bankAccounts.findMany({
        where: { owner_id },
      });
    } catch (error) {
      throw new AppException(
        `Error while getting all bank accounts for owner ${owner_id}`,
        {
          message: error.message,
          data: owner_id,
        },
      );
    }
  }

  async getAccount(id_bank_account: string): Promise<BankAccounts> {
    try {
      const bankAccount = await this.prisma.bankAccounts.findUnique({
        where: { id_bank_account },
        include: {
          BankWithdrawals: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 15,
          },
          BankDeposits: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 15,
          },
        },
      });
      let withdrawals = 0;
      bankAccount.BankWithdrawals.map((withdrawal) => {
        if (!withdrawal.is_canceled && !withdrawal.is_completed)
          withdrawals += withdrawal.amount;
      });
      let deposits = 0;
      bankAccount.BankDeposits.map((deposit) => {
        if (!deposit.is_canceled && !deposit.is_completed)
          deposits += deposit.amount;
      });
      return {
        ...bankAccount,
        balance:
          Math.round(
            (bankAccount.balance - withdrawals + deposits + Number.EPSILON) *
              100,
          ) / 100,
      };
    } catch (error) {
      throw new AppException(
        `Error while getting bank account with id ${id_bank_account}`,
        {
          message: error.message,
          data: id_bank_account,
        },
      );
    }
  }

  async validOppositionDate(dateString: string): Promise<boolean> {
    const now = new Date();
    const date = new Date(dateString);
    const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);
    return date > seventyTwoHoursAgo && date <= now;
  }

  async blockAccount(
    id_bank_account: string,
    opposition_date: string,
  ): Promise<BankAccounts> {
    try {
      return await this.prisma.bankAccounts.update({
        where: { id_bank_account },
        data: {
          is_blocked: true,
          BankWithdrawals: {
            updateMany: {
              where: {
                createdAt: {
                  gte: opposition_date,
                },
              },
              data: { is_canceled: true },
            },
          },
        },
        include: {
          BankWithdrawals: {
            where: {
              createdAt: {
                gte: opposition_date,
              },
            },
          },
        },
      });
    } catch (error) {
      throw new AppException(
        `Error while blocking bank account with id ${id_bank_account}`,
        {
          message: error.message,
          data: id_bank_account,
        },
      );
    }
  }

  async createOperation(
    source_bank_account: string,
    destination_bank_account: string,
    amount: number,
    issuer: OperationIssuer,
  ): Promise<BankOperations> {
    try {
      const source = await this.prisma.bankAccounts.findUnique({
        where: { id_bank_account: source_bank_account },
      });
      const destination = await this.prisma.bankAccounts.findUnique({
        where: { id_bank_account: destination_bank_account },
      });
      await this.checkOperationValidity(source, destination, amount, issuer);
      return await this.prisma.bankOperations.create({
        data: {
          amount,
          service_id: issuer.id_service ?? undefined,
          user_id: issuer.id_user ?? undefined,
          from_id: source_bank_account,
          to_id: destination_bank_account,
        },
      });
    } catch (error) {
      throw new AppException(`Error while creating operation`, {
        message: error.message,
        data: {
          source_bank_account,
          destination_bank_account,
          amount,
          issuer,
        },
      });
    }
  }

  async checkOperationValidity(
    source: BankAccounts,
    destination: BankAccounts,
    amount: number,
    issuer: OperationIssuer,
  ): Promise<boolean> {
    try {
      if (source.is_blocked) {
        throw new Error(
          `Can't perform operation on bank account ${source.id_bank_account}. This account is blocked`,
        );
      }
      if (destination.is_blocked) {
        throw new Error(
          `Can't perform operation on bank account ${destination.id_bank_account}. This account is blocked`,
        );
      }
      if (issuer.id_user && source.owner_id !== issuer.id_user) {
        throw new Error(
          `Issuer must be the owner of the bank account ${source.id_bank_account}`,
        );
      }
      if (source.balance - amount < 0) {
        throw new Error(
          `Not enough funds to perform operation on bank account ${source.id_bank_account}`,
        );
      }
      return true;
    } catch (error) {
      throw new Error(`Invalid Operation: ${error.message}`);
    }
  }
}
