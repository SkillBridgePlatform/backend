import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateClassDto {
  @ApiPropertyOptional()
  @IsString()
  name?: string;
}
