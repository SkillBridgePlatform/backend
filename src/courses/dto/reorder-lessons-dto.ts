// src/modules/dto/reorder-course-modules.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class LessonOrder {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  order: number;
}

export class ReorderLessonsDto {
  @ApiProperty({ type: [LessonOrder] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => LessonOrder)
  lessons: LessonOrder[] = [];
}
