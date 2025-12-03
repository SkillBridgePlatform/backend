import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsNumber, IsOptional } from 'class-validator';

export class UpdateContentBlockProgressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  started_at?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  completed_at?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  last_video_position?: number | null;
}
