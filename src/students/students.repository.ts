import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaginationOptions } from 'src/common/interfaces';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateStudentDto } from './dto/create-student-dto';
import { UpdateStudentDto } from './dto/update-student-dto';
import {
  Student,
  StudentFilters,
  StudentInsert,
} from './entities/students.entity';

@Injectable()
export class StudentsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getStudents(
    filters: StudentFilters = {},
    pagination: PaginationOptions = {},
    search?: string,
  ): Promise<{ students: Student[]; total: number }> {
    let query = this.supabase.client
      .from('students')
      .select('*', { count: 'exact' });

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        query = query.eq(key, value);
      }
    });

    // Apply search
    if (search) {
      const searchPattern = `%${search}%`;
      query = query.or(
        `first_name.ilike.${searchPattern},last_name.ilike.${searchPattern},username.ilike.${searchPattern}`,
      );
    }

    // Apply pagination
    if (pagination.limit !== undefined) query = query.limit(pagination.limit);
    if (pagination.offset !== undefined)
      query = query.range(
        pagination.offset,
        pagination.offset + (pagination.limit ?? 0) - 1,
      );

    const { data, error, count } = await query;

    if (error) throw new InternalServerErrorException(error.message);

    return { students: data as Student[], total: count ?? 0 };
  }

  async getStudentById(id: string): Promise<Student | null> {
    const { data, error } = await this.supabase.client
      .from('students')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    const { username, pin, first_name, last_name, school_id, language } =
      createStudentDto;

    if (!username || !pin)
      throw new InternalServerErrorException('Username and pin are required');

    const supabase = this.supabase.client;

    const { data: studentData, error: dbError } = await supabase
      .from('students')
      .insert({
        username,
        pin,
        first_name,
        last_name,
        school_id,
        language,
      } as StudentInsert)
      .select()
      .single();

    if (dbError) throw new InternalServerErrorException(dbError.message);
    return studentData;
  }

  async updateStudent(id: string, updates: UpdateStudentDto): Promise<Student> {
    const sanitizedDto = {
      ...updates,
      language: updates.language ?? undefined,
    };

    const { data, error } = await this.supabase.client
      .from('students')
      .update(sanitizedDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data as Student;
  }

  async deleteStudent(id: string): Promise<void> {
    const { error: dbError } = await this.supabase.client
      .from('students')
      .delete()
      .eq('id', id);

    if (dbError) throw new InternalServerErrorException(dbError.message);
  }

  async countStudents(): Promise<number> {
    const { count, error } = await this.supabase.client
      .from('students')
      .select('id', { count: 'exact', head: true });

    if (error) throw new InternalServerErrorException(error.message);
    return count ?? 0;
  }

  async countStudentsBySchool(schoolId: string): Promise<number> {
    const { count, error } = await this.supabase.client
      .from('students')
      .select('id', { count: 'exact', head: true })
      .eq('school_id', schoolId);

    if (error) throw new InternalServerErrorException(error.message);
    return count ?? 0;
  }

  async resetPin(id: string, pin: string): Promise<void> {
  try {
    const { data, error } = await this.supabase.client
      .from('students')
      .update({ pin })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
  } catch (err) {
    console.error(err);
    throw new InternalServerErrorException('Failed to reset PIN');
  }
}
}
