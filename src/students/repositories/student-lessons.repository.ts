import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import {
  StudentContentBlockProgress,
  StudentLessonProgress,
} from '../entities/student-lesson.entity';

@Injectable()
export class StudentLessonsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getStudentLessonProgress(
    studentId: string,
    lessonIds: string[],
  ): Promise<StudentLessonProgress[]> {
    if (!lessonIds.length) return [];

    const { data, error } = await this.supabase.client
      .from('student_lesson_progress')
      .select('*')
      .eq('student_id', studentId)
      .in('lesson_id', lessonIds);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as StudentLessonProgress[];
  }

  async getStudentContentBlockProgress(
    studentId: string,
    contentBlockIds: string[],
  ): Promise<StudentContentBlockProgress[]> {
    if (!contentBlockIds.length) return [];

    const { data, error } = await this.supabase.client
      .from('student_content_block_progress')
      .select('*')
      .eq('student_id', studentId)
      .in('content_block_id', contentBlockIds);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as StudentContentBlockProgress[];
  }
}
