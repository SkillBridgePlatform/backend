// src/modules/dto/create-lesson.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class ContentBlockDto {
  @ApiProperty({ enum: ['text', 'video'] })
  @IsNotEmpty()
  @IsString()
  type: 'text' | 'video';

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  videoUrl?: string;
}

export class CreateLessonDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  estimated_duration?: number;

  @ApiProperty({ type: [ContentBlockDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  contentBlocks: ContentBlockDto[];
}
