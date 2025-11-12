// src/modules/modules-supabase.repository.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Course } from '../entities/course.entity';
import { Lesson } from '../entities/lesson.entity';
import { CourseModule } from '../entities/module.entity';

@Injectable()
export class LessonsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getLessons(moduleId: string): Promise<Lesson[]> {
    const { data, error } = await this.supabase.client
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order', { ascending: true });

    if (error) throw new InternalServerErrorException(error.message);

    return data as Lesson[];
  }

  async getLessonById(
    id: string,
  ): Promise<
    (Lesson & { courseModule: CourseModule & { course: Course } }) | null
  > {
    const { data, error } = await this.supabase.client
      .from('lessons')
      .select(
        `
      *,
      courseModule:module_id(
        *,
        course:course_id(*)
      )
    `,
      )
      .eq('id', id)
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);

    return data;
  }

  async reorderLessons(
    moduleId: string,
    lessonOrders: { id: string; order: number }[],
  ): Promise<void> {
    const updates = lessonOrders.map((m) =>
      this.supabase.client
        .from('lessons')
        .update({ order: m.order })
        .eq('id', m.id)
        .eq('module_id', moduleId),
    );

    const results = await Promise.all(updates);

    for (const res of results) {
      if (res.error) {
        throw new Error(`Failed to update lesson order: ${res.error.message}`);
      }
    }
  }
}
