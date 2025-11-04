import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateClassDto } from './dto/create-class-dto';
import { UpdateClassDto } from './dto/update-class-dto';
import { Class, ClassFilters, ClassInsert } from './entities/classes.entity';

@Injectable()
export class ClassesRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getClasses(
    filters: ClassFilters = {},
    pagination: PaginationOptions = {},
    sort?: SortOptions,
    search?: string,
  ): Promise<{ classes: Class[]; total: number }> {
    let query = this.supabase.client
      .from('classes')
      .select('*', { count: 'exact' });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        query = query.eq(key, value);
      }
    });

    if (search) {
      const searchPattern = `%${search}%`;
      query = query.or(`name.ilike.${searchPattern}`);
    }

    const allowedSortFields = ['name', 'created_at'];
    if (sort?.sortBy && allowedSortFields.includes(sort.sortBy)) {
      const direction = sort.sortDirection === 'desc' ? false : true;
      query = query.order(sort.sortBy, { ascending: direction });
    }

    if (pagination.limit !== undefined) query = query.limit(pagination.limit);
    if (pagination.offset !== undefined)
      query = query.range(
        pagination.offset,
        pagination.offset + (pagination.limit ?? 0) - 1,
      );

    const { data, error, count } = await query;

    if (error) throw new InternalServerErrorException(error.message);

    return { classes: data as Class[], total: count ?? 0 };
  }

  async getClassById(id: string): Promise<Class | null> {
    const { data, error } = await this.supabase.client
      .from('classes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async createClass(createClassDto: CreateClassDto): Promise<Class> {
    const { name } = createClassDto;

    if (!name) throw new InternalServerErrorException('Name is required');

    const supabase = this.supabase.client;

    const { data: classData, error: dbError } = await supabase
      .from('classes')
      .insert({
        name: name,
      } as ClassInsert)
      .select()
      .single();

    if (dbError) throw new InternalServerErrorException(dbError.message);
    return classData;
  }

  async updateClass(id: string, updates: UpdateClassDto): Promise<Class> {
    const { data, error } = await this.supabase.client
      .from('classes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data as Class;
  }

  async deleteClass(id: string): Promise<void> {
    const { error: dbError } = await this.supabase.client
      .from('classes')
      .delete()
      .eq('id', id);

    if (dbError) throw new InternalServerErrorException(dbError.message);
  }

  async countClasses(): Promise<number> {
    const { count, error } = await this.supabase.client
      .from('classes')
      .select('id', { count: 'exact', head: true });

    if (error) throw new InternalServerErrorException(error.message);

    return count ?? 0;
  }
}
