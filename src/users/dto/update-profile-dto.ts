import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserLanguage } from 'src/common/enums';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  first_name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  last_name?: string;

  @IsOptional()
  @IsEnum(UserLanguage)
  language?: UserLanguage;
}
