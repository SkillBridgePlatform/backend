import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { StudentCourseProgress } from '../entities/student-course.entity';

@Injectable()
export class StudentCourseProgressRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getStudentCourseProgress(
    studentId: string,
    courseIds: string[],
  ): Promise<StudentCourseProgress[]> {
    if (!courseIds.length) return [];

    const { data, error } = await this.supabase.client
      .from('student_course_progress')
      .select('*')
      .eq('student_id', studentId)
      .in('course_id', courseIds);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as StudentCourseProgress[];
  }

  async startStudentCourse(studentId: string, courseId: string): Promise<void> {
    const { error } = await this.supabase.client.rpc('start_student_course', {
      p_student_id: studentId,
      p_course_id: courseId,
    });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to start course: ${error.message}`,
      );
    }
  }

  async updateCourseProgress(
    studentId: string,
    courseId: string,
    update: Partial<{
      started_at: string | null;
      completed_at: string | null;
      progress_percentage: number | null;
      status: string | null;
    }>,
  ): Promise<void> {
    const { error } = await this.supabase.client
      .from('student_course_progress')
      .update({
        ...update,
        progress_percentage: update.progress_percentage ?? undefined,
        status: update.status ?? undefined,
      })
      .eq('student_id', studentId)
      .eq('course_id', courseId);

    if (error) throw new InternalServerErrorException(error.message);
  }
}
