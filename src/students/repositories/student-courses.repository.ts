import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class StudentCoursesRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getStudentCourseIds(studentId: string): Promise<string[]> {
    const { data, error } = await this.supabase.client.rpc(
      'get_student_course_ids',
      {
        student_uuid: studentId,
      },
    );

    if (error) throw new Error(error.message);

    return (data || []).map((row) => row.course_id);
  }
}
