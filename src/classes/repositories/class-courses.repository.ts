import { Injectable } from '@nestjs/common';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { Course } from 'src/courses/entities/course.entity';
import { SupabaseService } from 'src/supabase/supabase.service';
import { ClassCourseInsert } from '../entities/classes.entity';

@Injectable()
export class ClassCoursesRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getCoursesForClass(
    classId: string,
    pagination: PaginationOptions = {},
    sort?: SortOptions,
    search?: string,
  ): Promise<{ courses: Course[]; total: number }> {
    const { data, error } = await this.supabase.client
      .from('class_courses')
      .select('courses(*), course_id', { count: 'exact' })
      .eq('class_id', classId);

    if (error) throw new Error(error.message);

    let courses = (data ?? []).map((row) => row.courses);

    if (search) {
      const lowerSearch = search.toLowerCase();
      courses = courses.filter((u) =>
        u.title?.toLowerCase().includes(lowerSearch),
      );
    }

    const allowedSortFields = ['title', 'created_at'];
    if (sort?.sortBy && allowedSortFields.includes(sort.sortBy)) {
      const sortBy = sort.sortBy;
      const ascending = sort.sortDirection !== 'desc';
      courses.sort((a, b) => {
        const aVal = (a as any)[sortBy] ?? '';
        const bVal = (b as any)[sortBy] ?? '';
        if (aVal < bVal) return ascending ? -1 : 1;
        if (aVal > bVal) return ascending ? 1 : -1;
        return 0;
      });
    }

    const total = courses.length;
    if (pagination.offset !== undefined && pagination.limit !== undefined) {
      courses = courses.slice(
        pagination.offset,
        pagination.offset + pagination.limit,
      );
    } else if (pagination.limit !== undefined) {
      courses = courses.slice(0, pagination.limit);
    }

    return { courses, total };
  }

  async getAvailableCoursesForClass(
    classId: string,
  ): Promise<Partial<Course>[]> {
    const { data: allCourses, error: allCoursesErr } =
      await this.supabase.client.from('courses').select('id, title');

    if (allCoursesErr) throw new Error(allCoursesErr.message);

    const { data: assignedCourses, error: assignedErr } =
      await this.supabase.client
        .from('class_courses')
        .select('course_id')
        .eq('class_id', classId);

    if (assignedErr) throw new Error(assignedErr.message);

    const assignedIds = new Set(assignedCourses.map((t) => t.course_id));

    const availableCourses = allCourses.filter(
      (course) => !assignedIds.has(course.id),
    );

    return availableCourses;
  }

  async assignCoursesToClass(
    classId: string,
    courseIds: string[],
  ): Promise<void> {
    if (courseIds.length === 0) return;

    const rows: ClassCourseInsert[] = courseIds.map((courseId) => ({
      class_id: classId,
      course_id: courseId,
    }));

    const { error } = await this.supabase.client
      .from('class_courses')
      .upsert(rows, { ignoreDuplicates: true });

    if (error) {
      console.error('Failed to assign courses to class:', error);
      throw new Error(error.message);
    }
  }

  async unassignCoursesFromClass(
    classId: string,
    courseIds: string[],
  ): Promise<void> {
    if (courseIds.length === 0) return;

    const { error } = await this.supabase.client
      .from('class_courses')
      .delete()
      .eq('class_id', classId)
      .in('course_id', courseIds);

    if (error) {
      console.error('Failed to unassign courses from class:', error);
      throw new Error(error.message);
    }
  }
}
