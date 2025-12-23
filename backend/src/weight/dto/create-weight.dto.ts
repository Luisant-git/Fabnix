import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWeightDto {
  @ApiProperty({ example: 500 })
  @IsNumber()
  value: number;

  @ApiProperty({ example: 'g' })
  @IsString()
  @IsNotEmpty()
  unit: string;
}