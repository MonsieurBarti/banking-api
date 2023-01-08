import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@users/users.module';
import { ServicesModule } from '@services/services.module';
import { BankingModule } from '@banking/banking.module';
import { LoggerModule } from 'nestjs-pino';
import * as pino from 'pino';
import * as pinoElastic from 'pino-elasticsearch';
import { PrismaService } from '@core/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        serializers: {
          err: pino.stdSerializers.err,
          req: pino.stdSerializers.req,
          res: pino.stdSerializers.res,
        },
        wrapSerializers: true,
        customLogLevel: (req, res, err) => {
          if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
          } else if (res.statusCode >= 500 || err) {
            return 'error';
          } else if (res.statusCode >= 300 && res.statusCode < 400) {
            return 'silent';
          }
          return 'info';
        },

        customSuccessMessage: (req, res) => {
          if (res.statusCode === 404) {
            return 'resource not found';
          }
          return `${req.method} completed`;
        },

        customReceivedMessage: (req, res) => {
          return `${req.method} request received`;
        },

        customErrorMessage: (req, res, err) => {
          return 'request errored with status code: ' + res.statusCode;
        },

        customAttributeKeys: {
          req: 'request',
          res: 'response',
          err: 'error',
          responseTime: 'timeTaken',
        },
        stream: pino.multistream([
          { stream: process.stdout },
          {
            stream: pinoElastic({
              node: process.env.ELASTIC_NODES.split(','),
            }),
          },
        ]),
      },
    }),
    UsersModule,
    ServicesModule,
    BankingModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
