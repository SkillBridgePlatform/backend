import { SchoolInsert } from './entities/schools.entity';
// src/schools/repository/schools-supabase.repository.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { Course } from 'src/courses/entities/course.entity';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateSchoolDto } from './dto/create-school-dto';
import { UpdateSchoolDto } from './dto/update-school-dto';
import { School } from './entities/schools.entity';

@Injectable()
export class SchoolsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getCoursesForSchool(
    schoolId: string,
    pagination: PaginationOptions = {},
    sort?: SortOptions,
    search?: string,
  ): Promise<{ courses: Course[]; total: number }> {
    let query = this.supabase.client
      .from('school_courses')
      .select('courses(*), course_id', { count: 'exact' })
      .eq('school_id', schoolId);

    if (search) {
      const searchPattern = `%${search}%`;
      query = query.ilike('courses.title', searchPattern);
    }

    const allowedSortFields = ['courses.title', 'classes.created_at'];
    if (sort?.sortBy && allowedSortFields.includes(`courses.${sort.sortBy}`)) {
      const ascending = sort.sortDirection !== 'desc';
      query = query.order(`courses.${sort.sortBy}`, { ascending });
    }

    if (pagination.limit !== undefined) query = query.limit(pagination.limit);
    if (pagination.offset !== undefined && pagination.limit !== undefined)
      query = query.range(
        pagination.offset,
        pagination.offset + pagination.limit - 1,
      );

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    const courses = (data ?? []).map((row) => row.courses as Course);
    return { courses, total: count ?? 0 };
  }

  async getSchools(
    pagination: PaginationOptions = {},
    sort?: SortOptions,
    search?: string,
  ): Promise<{ schools: School[]; total: number }> {
    let query = this.supabase.client
      .from('schools')
      .select('*', { count: 'exact' });

    // Apply search
    if (search) {
      const searchPattern = `%${search}%`;
      query = query.or(`name.ilike.${searchPattern}`);
    }

    // Apply sorting (only allow specific fields)
    const allowedSortFields = ['name', 'created_at'];
    if (sort?.sortBy && allowedSortFields.includes(sort.sortBy)) {
      const direction = sort.sortDirection === 'desc' ? false : true;
      query = query.order(sort.sortBy, { ascending: direction });
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

    return { schools: data as School[], total: count ?? 0 };
  }

  async getSchoolById(id: string): Promise<School | null> {
    const { data, error } = await this.supabase.client
      .from('schools')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async createSchool(createSchoolDto: CreateSchoolDto): Promise<School> {
    const { name } = createSchoolDto;

    if (!name) throw new InternalServerErrorException('Name is required');

    const supabase = this.supabase.client;

    const { data: schoolData, error: dbError } = await supabase
      .from('schools')
      .insert({
        name: name,
      } as SchoolInsert)
      .select()
      .single();

    if (dbError) throw new InternalServerErrorException(dbError.message);
    return schoolData;
  }

  async updateSchool(id: string, updates: UpdateSchoolDto): Promise<School> {
    const { data, error } = await this.supabase.client
      .from('schools')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data as School;
  }

  async deleteSchool(id: string): Promise<void> {
    const { error: dbError } = await this.supabase.client
      .from('schools')
      .delete()
      .eq('id', id);

    if (dbError) throw new InternalServerErrorException(dbError.message);
  }

  async countSchools(): Promise<number> {
    const { count, error } = await this.supabase.client
      .from('schools')
      .select('id', { count: 'exact', head: true });

    if (error) throw new InternalServerErrorException(error.message);

    return count ?? 0;
  }
}
