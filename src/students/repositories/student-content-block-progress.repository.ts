import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { UpdateContentBlockProgressDto } from '../dto/update-content-block-progress-dto';
import { StudentContentBlockProgress } from '../entities/student-lesson.entity';

@Injectable()
export class StudentContentBlockProgressRepository {
  constructor(private readonly supabase: SupabaseService) {}

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
}
