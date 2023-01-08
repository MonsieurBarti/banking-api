import {
  Body,
  Controller,
  Post,
  Put,
  BadRequestException,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from '@prisma/client';
import { CreateUserDto, LoginDto, UpdateUserDto } from './utils/users.dtos';
import { AuthGuard } from '@utils/authguard';
import { verify } from 'jsonwebtoken';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Post('/register')
  async register(@Body() user: CreateUserDto): Promise<Users> {
    try {
      return await this.users.register(user);
    } catch (error) {
      throw new BadRequestException(error.message, error.details);
    }
  }

  @Post('/login')
  async login(@Body() body: LoginDto): Promise<{ token: string }> {
    try {
      const token = await this.users.login(body.email, body.password);
      return { token };
    } catch (error) {
      throw new BadRequestException(error.message, error.details);
    }
  }

  @Put('/update')
  @UseGuards(AuthGuard)
  async update(
    @Body() user: UpdateUserDto,
    @Headers() headers: any,
  ): Promise<Users> {
    try {
      const decoded = await verify(
        headers.authorization,
        process.env.JWT_SECRET,
      );
      return await this.users.update(decoded.id_user, user);
    } catch (error) {
      throw new BadRequestException(error.message, error.details);
    }
  }
}
