import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateSchoolDto {
  @ApiProperty()
  @IsString()
  name?: string;
}
