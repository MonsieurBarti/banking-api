import { IsString, IsNumber, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'test@test.fr',
    description: 'Email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 't3st&*',
    description: 'Password of the user',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'Doe',
    description: 'Lastname of the user',
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'John',
    description: 'Firstname of the user',
  })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({
    type: 'number',
    required: true,
    example: 27,
    description: 'Age of the user',
  })
  @IsNotEmpty()
  @IsNumber()
  age: number;
}

export class UpdateUserDto {
  @ApiProperty({
    type: 'string',
    example: 'test@test.fr',
    description: 'Email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    example: 't3st&*',
    description: 'Password of the user',
  })
  @IsString()
  password: string;

  @ApiProperty({
    type: 'string',
    example: 'Doe',
    description: 'Lastname of the user',
  })
  @IsString()
  lastname: string;

  @ApiProperty({
    type: 'string',
    example: 'John',
    description: 'Firstname of the user',
  })
  @IsString()
  firstname: string;

  @ApiProperty({
    type: 'number',
    example: 27,
    description: 'Age of the user',
  })
  @IsNumber()
  age: number;
}

export class LoginDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'test@test.fr',
    description: 'Email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 't3st&*',
    description: 'Password of the user',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
