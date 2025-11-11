// src/modules/dto/create-module.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCourseModuleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  estimated_duration: number;
}
