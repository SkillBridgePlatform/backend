import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserLanguage } from 'src/common/enums';

export class CreateSchoolDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserLanguage)
  language: UserLanguage;
}
