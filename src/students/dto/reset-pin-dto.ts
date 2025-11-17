import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPinDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pin: string;
}
