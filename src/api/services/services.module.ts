import { Module } from '@nestjs/common';
import { PrismaService } from '@core/prisma.service';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';

@Module({
  providers: [ServicesService, PrismaService],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class ServicesModule {}
