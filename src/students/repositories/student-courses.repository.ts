import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CourseProgress } from '../entities/student-course.entity';

@Injectable()
export class StudentCoursesRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getCourseProgressForStudent(
    studentId: string,
    courseIds: string[],
  ): Promise<CourseProgress[]> {
    if (!courseIds.length) return [];

    const { data, error } = await this.supabase.client
      .from('course_progress')
      .select('*')
      .eq('student_id', studentId)
      .in('course_id', courseIds);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as CourseProgress[];
  }

  async createCourseProgress(
    studentId: string,
    courseId: string,
  ): Promise<CourseProgress> {
    const payload = {
      student_id: studentId,
      course_id: courseId,
      status: 'in_progress',
      progress_percentage: 0,
      started_at: new Date().toISOString(),
      completed_at: null,
    };

    const { data, error } = await this.supabase.client
      .from('course_progress')
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as CourseProgress;
  }
}
