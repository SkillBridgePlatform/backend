import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender, UserLanguage } from 'src/common/enums';

export class CreateStudentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pin: string;

  @ApiProperty()
  @IsString()
  school_id: string | null;

  @ApiProperty({ enum: UserLanguage })
  @IsEnum(UserLanguage)
  language: UserLanguage | null;

  @ApiProperty({ enum: Gender })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  curriculum: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  grade_level: string;
}
