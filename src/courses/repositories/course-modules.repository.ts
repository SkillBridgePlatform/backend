// src/modules/modules-supabase.repository.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateCourseModuleDto } from '../dto/create-course-module-dto';
import { UpdateCourseModuleDto } from '../dto/update-course-module-dto';
import { CourseModule } from '../entities/module.entity';

@Injectable()
export class CourseModulesRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getCourseModules(
    courseId: string,
    pagination: PaginationOptions = {},
    search?: string,
    sort?: SortOptions,
  ): Promise<{ courseModules: CourseModule[]; total: number }> {
    let query = this.supabase.client
      .from('modules')
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

    return { courseModules: data as CourseModule[], total: count ?? 0 };
  }

  async getCourseModuleById(id: string): Promise<CourseModule | null> {
    const { data, error } = await this.supabase.client
      .from('modules')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async createCourseModule(
    courseId: string,
    createCourseModuleDto: CreateCourseModuleDto,
  ): Promise<CourseModule> {
    const { title, description, order, estimated_duration } =
      createCourseModuleDto;

    if (!title || !courseId)
      throw new BadRequestException('Title and courseId are required');

    const slug = await this.generateUniqueSlug(courseId, title);

    const payload: any = {
      course_id: courseId,
      title,
      slug,
      description,
      estimated_duration,
    };

    if (order !== undefined) {
      payload.order = order;
    }

    const { data, error } = await this.supabase.client
      .from('modules')
      .insert(payload)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data as CourseModule;
  }

  async updateCourseModule(
    id: string,
    updates: UpdateCourseModuleDto,
  ): Promise<CourseModule> {
    const safeUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined),
    );

    if (Object.keys(safeUpdates).length === 0) {
      throw new BadRequestException('No updates provided');
    }

    const { data, error } = await this.supabase.client
      .from('modules')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data)
      throw new InternalServerErrorException('CourseModule update failed');

    return data as CourseModule;
  }

  async deleteCourseModule(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('modules')
      .delete()
      .eq('id', id);

    if (error) throw new InternalServerErrorException(error.message);
  }

  private async generateUniqueSlug(
    courseId: string,
    title: string,
  ): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const { data, error } = await this.supabase.client
        .from('modules')
        .select('id')
        .eq('course_id', courseId)
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw new InternalServerErrorException(error.message);
      if (!data) break;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}
