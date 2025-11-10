import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { UserLanguage } from 'src/common/enums';
import { CourseStatus } from '../entities/course.entity';

export class CreateCourseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserLanguage)
  language: UserLanguage;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  estimated_duration: number;

  @ApiPropertyOptional({ enum: CourseStatus })
  @IsNotEmpty()
  @IsEnum(CourseStatus)
  status: CourseStatus;
}
