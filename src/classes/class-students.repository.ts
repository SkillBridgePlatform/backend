import { Injectable } from '@nestjs/common';
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
}
