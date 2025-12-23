import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUnitDto {
  @ApiProperty({ example: 'kg' })
  @IsString()
  @IsNotEmpty()
  name: string;
}