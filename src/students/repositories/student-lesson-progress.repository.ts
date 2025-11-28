import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { StudentLessonProgress } from '../entities/student-lesson.entity';

@Injectable()
export class StudentLessonProgressRepository {
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

  async createLessonProgressBulk(
    studentId: string,
    lessonIds: string[],
  ): Promise<void> {
    if (!lessonIds || lessonIds.length === 0) return;

    const { error } = await this.supabase.client
      .from('student_lesson_progress')
      .insert(
        lessonIds.map((lessonId) => ({
          student_id: studentId,
          lesson_id: lessonId,
          started_at: null,
          completed_at: null,
        })),
      );

    if (error) throw new InternalServerErrorException(error.message);
  }

  async updateLessonProgress(
    studentId: string,
    lessonId: string,
    update: Partial<{
      started_at: string | null;
      completed_at: string | null;
    }>,
  ): Promise<void> {
    const { error } = await this.supabase.client
      .from('student_lesson_progress')
      .update(update)
      .eq('student_id', studentId)
      .eq('lesson_id', lessonId);

    if (error) throw new InternalServerErrorException(error.message);
  }

  async getLessonProgressByCourse(studentId: string, courseId: string) {
    // Get all module IDs for this course
    const { data: modulesInCourse, error: modulesError } =
      await this.supabase.client
        .from('modules')
        .select('id')
        .eq('course_id', courseId);

    if (modulesError || !modulesInCourse)
      throw new Error(modulesError?.message || 'No modules found for course');

    const moduleIds = modulesInCourse.map((m) => m.id);

    // Get all lessons for those modules
    const { data: lessonsInCourse, error: lessonsError } =
      await this.supabase.client
        .from('lessons')
        .select('id')
        .in('module_id', moduleIds);

    if (lessonsError || !lessonsInCourse)
      throw new Error(lessonsError?.message || 'No lessons found for course');

    const lessonIds = lessonsInCourse.map((l) => l.id);

    // Get student progress for those lessons
    const { data: lessonProgress, error: progressError } =
      await this.supabase.client
        .from('student_lesson_progress')
        .select('*')
        .in('lesson_id', lessonIds)
        .eq('student_id', studentId);

    if (progressError) throw new Error(progressError?.message);

    return lessonProgress;
  }
}
