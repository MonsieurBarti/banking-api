import { Module } from '@nestjs/common';
import { PrismaService } from '@core/prisma.service';
import { BankingService } from './banking.service';
import { BankingController } from './banking.controller';

@Module({
  providers: [BankingService, PrismaService],
  controllers: [BankingController],
  exports: [BankingService],
})
export class BankingModule {}
