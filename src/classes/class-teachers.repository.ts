import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/common/enums';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { SupabaseService } from 'src/supabase/supabase.service';
import { User } from 'src/users/entities/user.entity';
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

  async getTeachersForClass(
    classId: string,
    pagination: PaginationOptions = {},
    sort?: SortOptions,
    search?: string,
  ): Promise<{ teachers: User[]; total: number }> {
    const { data, error } = await this.supabase.client
      .from('class_teachers')
      .select('users(*), teacher_id', { count: 'exact' })
      .eq('class_id', classId);

    if (error) throw new Error(error.message);

    let teachers = (data ?? []).map((row) => row.users);

    if (search) {
      const lowerSearch = search.toLowerCase();
      teachers = teachers.filter(
        (u) =>
          u.first_name?.toLowerCase().includes(lowerSearch) ||
          u.last_name?.toLowerCase().includes(lowerSearch) ||
          u.email?.toLowerCase().includes(lowerSearch),
      );
    }

    const allowedSortFields = ['first_name', 'created_at'];
    if (sort?.sortBy && allowedSortFields.includes(sort.sortBy)) {
      const sortBy = sort.sortBy;
      const ascending = sort.sortDirection !== 'desc';
      teachers.sort((a, b) => {
        const aVal = (a as any)[sortBy] ?? '';
        const bVal = (b as any)[sortBy] ?? '';
        if (aVal < bVal) return ascending ? -1 : 1;
        if (aVal > bVal) return ascending ? 1 : -1;
        return 0;
      });
    }

    const total = teachers.length;
    if (pagination.offset !== undefined && pagination.limit !== undefined) {
      teachers = teachers.slice(
        pagination.offset,
        pagination.offset + pagination.limit,
      );
    } else if (pagination.limit !== undefined) {
      teachers = teachers.slice(0, pagination.limit);
    }

    return { teachers, total };
  }

  async getAvailableTeachersForClass(
    classId: string,
  ): Promise<Partial<User>[]> {
    const { data: allTeachers, error: allTeachersErr } =
      await this.supabase.client
        .from('users')
        .select('id, first_name, last_name, email, role')
        .eq('role', UserRole.Teacher);

    if (allTeachersErr) throw new Error(allTeachersErr.message);

    const { data: assignedTeachers, error: assignedErr } =
      await this.supabase.client
        .from('class_teachers')
        .select('teacher_id')
        .eq('class_id', classId);

    if (assignedErr) throw new Error(assignedErr.message);

    const assignedIds = new Set(assignedTeachers.map((t) => t.teacher_id));

    const availableTeachers = allTeachers.filter(
      (teacher) => !assignedIds.has(teacher.id),
    );

    return availableTeachers;
  }

  async unassignTeachersFromClass(
    classId: string,
    teacherIds: string[],
  ): Promise<void> {
    if (teacherIds.length === 0) return;

    const { error } = await this.supabase.client
      .from('class_teachers')
      .delete()
      .eq('class_id', classId)
      .in('teacher_id', teacherIds);

    if (error) {
      console.error('Failed to unassign teachers from class:', error);
      throw new Error(error.message);
    }
  }
}
