import { Injectable } from '@nestjs/common';
import { AppException } from '@utils/app-exception';
import { Users } from '@prisma/client';
import { CreateUser, UpdateUser } from './utils/users.models';
import { PrismaService } from 'src/core/prisma.service';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(user: CreateUser): Promise<Users> {
    try {
      const password = await argon2.hash(user.password);
      return await this.prisma.users.create({
        data: { ...user, password },
      });
    } catch (error) {
      throw new AppException(`Error while registering user`, {
        message: error.message,
        data: user,
      });
    }
  }

  async login(email: string, password: string): Promise<string> {
    try {
      const user = await this.prisma.users.findFirst({
        where: { email },
      });
      if (!user) throw new Error(`User with email ${email} not found`);
      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) {
        throw new Error('Wrong password');
      }
      const payload = { id_user: user.id_user };
      const options = { expiresIn: '2d' };
      return jwt.sign(payload, process.env.JWT_SECRET, options);
    } catch (error) {
      throw new AppException(`Error while trying to login as a user`, {
        message: error.message,
        data: email,
      });
    }
  }

  async update(id_user: string, user: UpdateUser): Promise<Users> {
    try {
      const data = { ...user };
      if (user.password) data.password = await argon2.hash(user.password);

      return await this.prisma.users.update({
        where: { id_user },
        data,
      });
    } catch (error) {
      throw new AppException(`Error while updating user`, {
        message: error.message,
        data: user,
      });
    }
  }
}
