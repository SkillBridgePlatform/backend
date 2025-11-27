import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { UpdateContentBlockProgressDto } from '../dto/update-content-block-progress-dto';
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

  async createContentBlockProgressBulk(
    studentId: string,
    contentBlockIds: string[],
  ): Promise<void> {
    if (!contentBlockIds || contentBlockIds.length === 0) return;

    const { error } = await this.supabase.client
      .from('student_content_block_progress')
      .insert(
        contentBlockIds.map((id) => ({
          student_id: studentId,
          content_block_id: id,
          started_at: new Date().toISOString(),
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

  async updateContentBlockProgress(
    studentId: string,
    contentBlockId: string,
    update: UpdateContentBlockProgressDto,
  ) {
    const { error } = await this.supabase.client
      .from('student_content_block_progress')
      .update(update)
      .eq('student_id', studentId)
      .eq('content_block_id', contentBlockId);

    if (error) throw new InternalServerErrorException(error.message);
  }

  async getContentBlockIdsByLesson(lessonId: string): Promise<string[]> {
    const { data, error } = await this.supabase.client
      .from('content_blocks')
      .select('id')
      .eq('lesson_id', lessonId);

    if (error) throw new InternalServerErrorException(error.message);
    return data?.map((d) => d.id) ?? [];
  }

  async getContentBlockProgressByContentBlockIds(
    studentId: string,
    contentBlockIds: string[],
  ) {
    if (contentBlockIds.length === 0) return [];

    const { data, error } = await this.supabase.client
      .from('student_content_block_progress')
      .select('*')
      .eq('student_id', studentId)
      .in('content_block_id', contentBlockIds);

    if (error) throw new InternalServerErrorException(error.message);
    return data;
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
