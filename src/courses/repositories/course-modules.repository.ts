// src/modules/modules-supabase.repository.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateCourseModuleDto } from '../dto/create-course-module-dto';
import { UpdateCourseModuleDto } from '../dto/update-course-module-dto';
import { Course } from '../entities/course.entity';
import { CourseModule } from '../entities/module.entity';

@Injectable()
export class CourseModulesRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getCourseModules(courseId: string): Promise<CourseModule[]> {
    const { data, error } = await this.supabase.client
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order', { ascending: true });

    if (error) throw new InternalServerErrorException(error.message);

    return data as CourseModule[];
  }

  async getCourseModuleById(
    id: string,
  ): Promise<(CourseModule & { course: Course }) | null> {
    const { data, error } = await this.supabase.client
      .from('modules')
      .select(
        `
      *,
      course:course_id(*)
    `,
      )
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

  async reorderCourseModules(
    courseId: string,
    moduleOrders: { id: string; order: number }[],
  ): Promise<void> {
    const updates = moduleOrders.map((m) =>
      this.supabase.client
        .from('modules')
        .update({ order: m.order })
        .eq('id', m.id)
        .eq('course_id', courseId),
    );

    const results = await Promise.all(updates);

    for (const res of results) {
      if (res.error) {
        throw new Error(`Failed to update module order: ${res.error.message}`);
      }
    }
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
