import { Injectable } from '@nestjs/common';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Class, ClassTeacherInsert } from './entities/classes.entity';

@Injectable()
export class ClassTeachersRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getClassesForTeacher(
    teacherId: string,
    pagination: PaginationOptions = {},
    sort?: SortOptions,
    search?: string,
  ): Promise<{ classes: Class[]; total: number }> {
    let query = this.supabase.client
      .from('class_teachers')
      .select('classes(*), class_id', { count: 'exact' })
      .eq('teacher_id', teacherId);

    if (search) {
      const searchPattern = `%${search}%`;
      query = query.ilike('classes.name', searchPattern);
    }

    const allowedSortFields = ['classes.name', 'classes.created_at'];
    if (sort?.sortBy && allowedSortFields.includes(`classes.${sort.sortBy}`)) {
      const ascending = sort.sortDirection !== 'desc';
      query = query.order(`classes.${sort.sortBy}`, { ascending });
    }

    if (pagination.limit !== undefined) query = query.limit(pagination.limit);
    if (pagination.offset !== undefined && pagination.limit !== undefined)
      query = query.range(
        pagination.offset,
        pagination.offset + pagination.limit - 1,
      );

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    const classes = (data ?? []).map((row) => row.classes as Class);
    return { classes, total: count ?? 0 };
  }

  async assignTeachersToClass(
    classId: string,
    teacherIds: string[],
  ): Promise<void> {
    if (teacherIds.length === 0) return;

    const rows: ClassTeacherInsert[] = teacherIds.map((teacherId) => ({
      class_id: classId,
      teacher_id: teacherId,
    }));

    const { error } = await this.supabase.client
      .from('class_teachers')
      .upsert(rows, { ignoreDuplicates: true });

    if (error) {
      console.error('Failed to assign teachers to class:', error);
      throw new Error(error.message);
    }
  }
}
