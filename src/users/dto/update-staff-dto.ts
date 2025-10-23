import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../common/enums';
import { UserLanguage } from './../../common/enums';

export class UpdateStaffUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  school_id?: string | null;

  @ApiPropertyOptional({ enum: UserLanguage })
  @IsOptional()
  @IsEnum(UserLanguage)
  language?: UserLanguage | null;
}
