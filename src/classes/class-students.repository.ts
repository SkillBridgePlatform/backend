import { Injectable } from '@nestjs/common';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { Student } from 'src/students/entities/students.entity';
import { SupabaseService } from 'src/supabase/supabase.service';
import { ClassStudentInsert } from './entities/classes.entity';

@Injectable()
export class ClassStudentsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async assignStudentsToClass(
    classId: string,
    studentIds: string[],
  ): Promise<void> {
    if (studentIds.length === 0) return;

    const rows: ClassStudentInsert[] = studentIds.map((studentId) => ({
      class_id: classId,
      student_id: studentId,
    }));

    const { error } = await this.supabase.client
      .from('class_students')
      .upsert(rows, { ignoreDuplicates: true });

    if (error) {
      console.error('Failed to assign students to class:', error);
      throw new Error(error.message);
    }
  }

  async getStudentsForClass(
    classId: string,
    pagination: PaginationOptions = {},
    sort?: SortOptions,
    search?: string,
  ): Promise<{ students: Student[]; total: number }> {
    const { data, error } = await this.supabase.client
      .from('class_students')
      .select('students(*), student_id', { count: 'exact' })
      .eq('class_id', classId);

    if (error) throw new Error(error.message);

    let students = (data ?? []).map((row) => row.students);

    if (search) {
      const lowerSearch = search.toLowerCase();
      students = students.filter(
        (u) =>
          u.first_name?.toLowerCase().includes(lowerSearch) ||
          u.last_name?.toLowerCase().includes(lowerSearch) ||
          u.username?.toLowerCase().includes(lowerSearch),
      );
    }

    const allowedSortFields = ['first_name', 'created_at'];
    if (sort?.sortBy && allowedSortFields.includes(sort.sortBy)) {
      const sortBy = sort.sortBy;
      const ascending = sort.sortDirection !== 'desc';
      students.sort((a, b) => {
        const aVal = a[sortBy] ?? '';
        const bVal = b[sortBy] ?? '';
        if (aVal < bVal) return ascending ? -1 : 1;
        if (aVal > bVal) return ascending ? 1 : -1;
        return 0;
      });
    }

    const total = students.length;
    if (pagination.offset !== undefined && pagination.limit !== undefined) {
      students = students.slice(
        pagination.offset,
        pagination.offset + pagination.limit,
      );
    } else if (pagination.limit !== undefined) {
      students = students.slice(0, pagination.limit);
    }

    return { students, total };
  }

  async getAvailableStudentsForClass(classId: string): Promise<Student[]> {
    const { data: allStudents, error: allStudentsErr } =
      await this.supabase.client
        .from('students')
        .select('*', { count: 'exact' });

    if (allStudentsErr) throw new Error(allStudentsErr.message);

    const { data: assignedStudents, error: assignedErr } =
      await this.supabase.client
        .from('class_students')
        .select('student_id')
        .eq('class_id', classId);

    if (assignedErr) throw new Error(assignedErr.message);

    const assignedIds = new Set(assignedStudents.map((t) => t.student_id));

    const availableStudents = allStudents.filter(
      (student) => !assignedIds.has(student.id),
    );

    return availableStudents;
  }

  async unassignStudentsFromClass(
    classId: string,
    studentIds: string[],
  ): Promise<void> {
    if (studentIds.length === 0) return;

    const { error } = await this.supabase.client
      .from('class_students')
      .delete()
      .eq('class_id', classId)
      .in('student_id', studentIds);

    if (error) {
      console.error('Failed to unassign students from class:', error);
      throw new Error(error.message);
    }
  }
}
