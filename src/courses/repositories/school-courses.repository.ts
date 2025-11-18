import { Injectable } from '@nestjs/common';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { School } from 'src/schools/entities/schools.entity';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SchoolCourseInsert } from '../entities/course.entity';

@Injectable()
export class CourseSchoolsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async assignSchoolsToCourse(
    courseId: string,
    schoolIds: string[],
  ): Promise<void> {
    if (schoolIds.length === 0) return;

    const rows: SchoolCourseInsert[] = schoolIds.map((schoolId) => ({
      course_id: courseId,
      school_id: schoolId,
    }));

    const { error } = await this.supabase.client
      .from('school_courses')
      .upsert(rows, { ignoreDuplicates: true });

    if (error) {
      console.error('Failed to assign schools to course:', error);
      throw new Error(error.message);
    }
  }

  async getSchoolsAssignedToCourse(
    courseId: string,
    pagination: PaginationOptions = {},
    sort?: SortOptions,
    search?: string,
  ): Promise<{ schools: School[]; total: number }> {
    const { data, error } = await this.supabase.client
      .from('school_courses')
      .select('schools(*)', { count: 'exact' })
      .eq('course_id', courseId);

    if (error) throw new Error(error.message);

    let schools = (data ?? []).map((row) => row.schools);

    // 2️⃣ Apply search
    if (search) {
      const lowerSearch = search.toLowerCase();
      schools = schools.filter((s) =>
        s.name?.toLowerCase().includes(lowerSearch),
      );
    }

    // 3️⃣ Apply sorting
    const allowedSortFields = ['name', 'created_at'];
    if (sort?.sortBy && allowedSortFields.includes(sort.sortBy)) {
      const sortBy = sort.sortBy;
      const ascending = sort.sortDirection !== 'desc';
      schools.sort((a, b) => {
        const aVal = (a as any)[sortBy] ?? '';
        const bVal = (b as any)[sortBy] ?? '';
        if (aVal < bVal) return ascending ? -1 : 1;
        if (aVal > bVal) return ascending ? 1 : -1;
        return 0;
      });
    }

    // 4️⃣ Apply pagination
    const total = schools.length;
    if (pagination.offset !== undefined && pagination.limit !== undefined) {
      schools = schools.slice(
        pagination.offset,
        pagination.offset + pagination.limit,
      );
    } else if (pagination.limit !== undefined) {
      schools = schools.slice(0, pagination.limit);
    }

    return { schools, total };
  }

  async getAvailableSchoolsForCourseAssignment(
    courseId: string,
  ): Promise<Partial<School>[]> {
    const { data: allSchools, error: allSchoolsErr } =
      await this.supabase.client
        .from('schools')
        .select('id, name, created_at')
        .order('name', { ascending: true });

    if (allSchoolsErr) throw new Error(allSchoolsErr.message);

    const { data: assignedSchools, error: assignedErr } =
      await this.supabase.client
        .from('school_courses')
        .select('school_id')
        .eq('course_id', courseId);

    if (assignedErr) throw new Error(assignedErr.message);

    const assignedIds = new Set(assignedSchools.map((s) => s.school_id));

    const availableSchools = allSchools.filter(
      (school) => !assignedIds.has(school.id),
    );

    return availableSchools;
  }

  async unassignSchoolsFromCourse(
    courseId: string,
    schoolIds: string[],
  ): Promise<void> {
    if (schoolIds.length === 0) return;

    const { error } = await this.supabase.client
      .from('school_courses')
      .delete()
      .eq('course_id', courseId)
      .in('school_id', schoolIds);

    if (error) {
      console.error('Failed to unassign schools from course:', error);
      throw new Error(error.message);
    }
  }
}
