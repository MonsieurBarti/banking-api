import { Injectable } from '@nestjs/common';
import { AppException } from '@utils/app-exception';
import { Services } from '@prisma/client';
import {
  CreateService,
  UpdateService,
  CreateServiceResponse,
} from './utils/services.models';
import { PrismaService } from 'src/core/prisma.service';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async register(service: CreateService): Promise<CreateServiceResponse> {
    try {
      const secret_key_uuid = uuid();
      const secret_key = await argon2.hash(secret_key_uuid);
      const public_key = await this.prisma.services.create({
        data: { ...service, secret_key },
        select: { id_service: true },
      });
      return { public_key: public_key.id_service, secret_key: secret_key_uuid };
    } catch (error) {
      throw new AppException(`Error while registering service`, {
        message: error.message,
        data: service,
      });
    }
  }

  async login(id_service: string, secret_key: string): Promise<string> {
    try {
      const service = await this.prisma.services.findUnique({
        where: { id_service },
      });
      if (!service)
        throw new Error(`Service with public_key ${id_service} not found`);
      const isMatch = await argon2.verify(service.secret_key, secret_key);
      if (!isMatch) {
        throw new Error('Wrong secret_key');
      }
      const payload = { id_service: service.id_service };
      const options = { expiresIn: '2d' };
      return jwt.sign(payload, process.env.JWT_SECRET, options);
    } catch (error) {
      throw new AppException(`Error while trying to login as a service`, {
        message: error.message,
        data: id_service,
      });
    }
  }

  async update(id_service: string, service: UpdateService): Promise<Services> {
    try {
      return await this.prisma.services.update({
        where: { id_service },
        data: { name: service.name },
      });
    } catch (error) {
      throw new AppException(`Error while updating service`, {
        message: error.message,
        data: service,
      });
    }
  }
}
