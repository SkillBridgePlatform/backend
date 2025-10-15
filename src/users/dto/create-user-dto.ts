import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  challenging_subjects?: string[] | null;

  @IsOptional()
  @IsDateString()
  created_at?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string | null;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  gender?: string | null;

  @IsOptional()
  @IsString()
  grade_level?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hobbies?: string[] | null;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  interest_level?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  language_preferences?: string[] | null;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferred_learning_methods?: string[] | null;

  @IsOptional()
  @IsString()
  school_name?: string | null;

  @IsOptional()
  @IsBoolean()
  seen_dashboard_tour?: boolean | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects_of_interest?: string[] | null;

  @IsOptional()
  @IsDateString()
  updated_at?: string;
}
