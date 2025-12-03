// src/courses/repository/courses-supabase.repository.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { generateSlug } from 'src/common/utils';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateCourseDto } from '../dto/create-course-dto';
import { UpdateCourseDto } from '../dto/update-course-dto';
import {
  Course,
  CourseHierarchy,
  CourseWithModulesAndLessons,
} from '../entities/course.entity';
import { ModuleHierarchy } from '../entities/module.entity';

@Injectable()
export class CoursesRepository {
  constructor(private readonly supabase: SupabaseService) {}

  // Admin

  async getCourses(
    pagination: PaginationOptions = {},
    search?: string,
    sort?: SortOptions,
  ): Promise<{ courses: Course[]; total: number }> {
    let query = this.supabase.client
      .from('courses')
      .select('*', { count: 'exact' });

    // Apply search
    if (search) {
      const searchPattern = `%${search}%`;
      query = query.or(`title.ilike.${searchPattern}`);
    }

    // Apply sorting
    const allowedSortFields = ['title', 'created_at'];
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

    return { courses: data as Course[], total: count ?? 0 };
  }

  async getCourseById(id: string): Promise<Course | null> {
    const { data, error } = await this.supabase.client
      .from('courses')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    const { title, description, language, tags, estimated_duration, status } =
      createCourseDto;

    if (!title) throw new BadRequestException('Title is required');

    const baseSlug = generateSlug(title);
    let slug = baseSlug;

    let counter = 1;
    while (true) {
      const { data, error } = await this.supabase.client
        .from('courses')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw new InternalServerErrorException(error.message);

      if (!data) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    const { data, error } = await this.supabase.client
      .from('courses')
      .insert({
        title,
        slug,
        description,
        language,
        tags,
        estimated_duration: estimated_duration,
        status,
      })
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data as Course;
  }

  async updateCourse(id: string, updates: UpdateCourseDto): Promise<Course> {
    const safeUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined),
    );

    if (Object.keys(safeUpdates).length === 0) {
      throw new BadRequestException('No updates provided');
    }

    const { data, error } = await this.supabase.client
      .from('courses')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data) throw new InternalServerErrorException('Course update failed');

    return data as Course;
  }

  async deleteCourse(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw new InternalServerErrorException(error.message);
  }

  async getCourseWithModulesAndLessonsById(
    courseId: string,
  ): Promise<CourseWithModulesAndLessons | null> {
    const { data, error } = await this.supabase.client
      .from('courses')
      .select(
        `
        *,
        modules (
          *,
          lessons (*)
        )
      `,
      )
      .eq('course_id', courseId)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!data) return null;

    const modules = (data.modules || [])
      .sort((a, b) => a.order - b.order)
      .map((module) => ({
        ...module,
        lessons: (module.lessons || []).sort((a, b) => a.order - b.order),
      }));

    return {
      ...data,
      modules,
    };
  }

  // Student

  async getCoursesByIds(courseIds: string[]): Promise<Course[]> {
    if (!courseIds.length) return [];

    const { data, error } = await this.supabase.client
      .from('courses')
      .select('*')
      .in('id', courseIds);

    if (error) throw new InternalServerErrorException(error.message);
    return data as Course[];
  }

  async getCourseHierarchyBySlug(
    courseSlug: string,
  ): Promise<CourseHierarchy | null> {
    const { data, error } = await this.supabase.client
      .from('courses')
      .select(
        `
      *,
      modules (
        *,
        lessons (*)
      )
    `,
      )
      .eq('slug', courseSlug)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!data) return null;
    const modulesWithLessons: ModuleHierarchy[] = (data.modules || [])
      .sort((a, b) => a.order - b.order)
      .map((module) => ({
        module: { ...module },
        lessons: (module.lessons || []).sort((a, b) => a.order - b.order),
      }));

    return {
      course: { ...data, modules: [] } as Course,
      modulesWithLessons,
    };
  }
}
