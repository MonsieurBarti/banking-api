import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBankAccountDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'test',
    description: 'Name of the bank account',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class IdAccountDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'a02697da-bbd6-478a-869a-43620cfd1d04',
    description: 'Number of the account',
  })
  @IsNotEmpty()
  @IsUUID()
  id_bank_account: string;
}

export class OppositionDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2022-07-01T00:00:00.000Z',
    description: 'Date for the start of the opposition',
  })
  @IsNotEmpty()
  @IsDateString()
  opposition_date: string;
}

export class OperationDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'a02697da-bbd6-478a-869a-43620cfd1d04',
    description: 'Number of the source account',
  })
  @IsNotEmpty()
  @IsUUID()
  source_bank_account: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'a02697da-bbd6-478a-869a-43620cfd1d04',
    description: 'Number of the destination account',
  })
  @IsNotEmpty()
  @IsUUID()
  destination_bank_account: string;

  @ApiProperty({
    type: 'number',
    required: true,
    example: 50.5,
    description: 'Value of the transaction',
  })
  @IsNotEmpty()
  @IsUUID()
  @Min(0)
  amount: number;
}
