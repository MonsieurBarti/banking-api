import {
  Body,
  Controller,
  Post,
  Put,
  Get,
  BadRequestException,
  Headers,
  UseGuards,
  Param,
} from '@nestjs/common';
import { BankingService } from './banking.service';
import { BankAccounts, BankOperations } from '@prisma/client';
import {
  CreateBankAccountDto,
  IdAccountDto,
  OppositionDto,
  OperationDto,
} from './utils/banking.dtos';
import { CreateAccountResponse } from './utils/banking.models';
import { AuthGuard } from '@utils/authguard';
import { verify } from 'jsonwebtoken';
import { ApiTags } from '@nestjs/swagger';
import { AppException } from '@utils/app-exception';

@Controller('banking')
@UseGuards(AuthGuard)
@ApiTags('banking')
export class BankingController {
  constructor(private banking: BankingService) {}

  @Post('/accounts')
  async register(
    @Body() account: CreateBankAccountDto,
    @Headers() headers: any,
  ): Promise<CreateAccountResponse> {
    try {
      const decoded = await verify(
        headers.authorization,
        process.env.JWT_SECRET,
      );
      if (decoded.id_user)
        return await this.banking.createAccount(account, decoded.id_user);
      else
        throw new AppException(`Can't access this ressource`, {
          token: headers.authorization,
        });
    } catch (error) {
      throw new BadRequestException(error.message, error.details);
    }
  }

  @Get('/accounts')
  async getAll(@Headers() headers: any): Promise<BankAccounts[]> {
    try {
      const decoded = await verify(
        headers.authorization,
        process.env.JWT_SECRET,
      );
      if (decoded.id_user)
        return await this.banking.getAllAccounts(decoded.id_user);
      else
        throw new AppException(`Can't access this ressource`, {
          token: headers.authorization,
        });
    } catch (error) {
      throw new BadRequestException(error.message, error.details);
    }
  }

  @Get('/accounts/:id_bank_account')
  async getById(
    @Param() params: IdAccountDto,
    @Headers() headers: any,
  ): Promise<BankAccounts> {
    try {
      const decoded = await verify(
        headers.authorization,
        process.env.JWT_SECRET,
      );
      if (decoded.id_user)
        return await this.banking.getAccount(params.id_bank_account);
      else
        throw new AppException(`Can't access this ressource`, {
          token: headers.authorization,
        });
    } catch (error) {
      throw new BadRequestException(error.message, error.details);
    }
  }

  @Put('/accounts/:id_bank_account/oppose')
  async makeOpposition(
    @Param() params: IdAccountDto,
    @Body() body: OppositionDto,
    @Headers() headers: any,
  ): Promise<BankAccounts> {
    try {
      const decoded = await verify(
        headers.authorization,
        process.env.JWT_SECRET,
      );
      if (decoded.id_user) {
        const validDate = await this.banking.validOppositionDate(
          body.opposition_date,
        );
        if (validDate) {
          return await this.banking.blockAccount(
            params.id_bank_account,
            body.opposition_date,
          );
        } else {
          throw new AppException(
            `The date must be in between now and 72h before now`,
            {
              date: body.opposition_date,
            },
          );
        }
      } else {
        throw new AppException(`Can't access this ressource`, {
          token: headers.authorization,
        });
      }
    } catch (error) {
      throw new BadRequestException(error.message, error.details);
    }
  }

  @Post('/operations')
  async createOperation(
    @Body() body: OperationDto,
    @Headers() headers: any,
  ): Promise<BankOperations> {
    try {
      const decoded = await verify(
        headers.authorization,
        process.env.JWT_SECRET,
      );
      if (decoded.id_user) {
        return await this.banking.createOperation(
          body.source_bank_account,
          body.destination_bank_account,
          body.amount,
          { id_user: decoded.id_user },
        );
      } else if (decoded.id_service) {
        return await this.banking.createOperation(
          body.source_bank_account,
          body.destination_bank_account,
          body.amount,
          { id_service: decoded.id_service },
        );
      } else {
        throw new AppException(`Can't access this ressource`, {
          token: headers.authorization,
        });
      }
    } catch (error) {
      throw new BadRequestException(error.message, error.details);
    }
  }
}
