import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserLanguage } from 'src/common/enums';

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
  @IsEmail()
  email: string;

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
}
