import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'test',
    description: 'Name of the service',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateServiceDto {
  @ApiProperty({
    type: 'string',
    example: 'test',
    description: 'Name of the service',
  })
  @IsString()
  name: string;
}

export class LoginDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'a02697da-bbd6-478a-869a-43620cfd1d04',
    description: 'Public key of the service',
  })
  @IsNotEmpty()
  @IsUUID()
  public_key: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'c0f020ad-6fdd-480d-8143-10b871749efe',
    description: 'Secret key of the service',
  })
  @IsNotEmpty()
  @IsUUID()
  secret_key: string;
}
