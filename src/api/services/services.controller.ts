import {
  Body,
  Controller,
  Post,
  Put,
  BadRequestException,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { Services } from '@prisma/client';
import {
  CreateServiceDto,
  LoginDto,
  UpdateServiceDto,
} from './utils/services.dtos';
import { CreateServiceResponse } from './utils/services.models';
import { AuthGuard } from '@utils/authguard';
import { verify } from 'jsonwebtoken';
import { ApiTags } from '@nestjs/swagger';
import { AppException } from '@utils/app-exception';

@Controller('services')
@ApiTags('services')
export class ServicesController {
  constructor(private services: ServicesService) {}

  @Post('/register')
  async register(
    @Body() service: CreateServiceDto,
  ): Promise<CreateServiceResponse> {
    try {
      return await this.services.register(service);
    } catch (error) {
      throw new BadRequestException(error.message, error.details);
    }
  }

  @Post('/login')
  async login(@Body() body: LoginDto): Promise<{ token: string }> {
    try {
      const token = await this.services.login(body.public_key, body.secret_key);
      return { token };
    } catch (error) {
      throw new BadRequestException(error.message, error.details);
    }
  }

  @Put('/update')
  @UseGuards(AuthGuard)
  async update(
    @Body() service: UpdateServiceDto,
    @Headers() headers: any,
  ): Promise<Services> {
    try {
      const decoded = await verify(
        headers.authorization,
        process.env.JWT_SECRET,
      );
      if (decoded.id_service)
        return await this.services.update(decoded.id_service, service);
      else
        throw new AppException(`Can't access this ressource`, {
          token: headers.authorization,
        });
    } catch (error) {
      throw new BadRequestException(error.message, error.details);
    }
  }
}
