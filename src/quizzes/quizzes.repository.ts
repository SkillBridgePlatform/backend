import { Quiz } from './entities/quizzes.entity';
// src/quizzes/repository/quizzes-supabase.repository.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class QuizzesRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getQuizzes(
    pagination: PaginationOptions = {},
    sort?: SortOptions,
    search?: string,
  ): Promise<{ quizzes: Quiz[]; total: number }> {
    let query = this.supabase.client
      .from('quizzes')
      .select('*', { count: 'exact' });

    // Apply search
    if (search) {
      const searchPattern = `%${search}%`;
      query = query.or(`title.ilike.${searchPattern}`);
    }

    // Apply sorting (only allow specific fields)
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

    return { quizzes: data as Quiz[], total: count ?? 0 };
  }

  async getQuizById(id: string): Promise<Quiz | null> {
    const { data, error } = await this.supabase.client
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async deleteQuiz(id: string): Promise<void> {
    const { error: dbError } = await this.supabase.client
      .from('quizzes')
      .delete()
      .eq('id', id);

    if (dbError) throw new InternalServerErrorException(dbError.message);
  }

  async createQuiz(payload): Promise<string> {
    const { data, error } = await this.supabase.client.rpc('create_full_quiz', {
      payload,
    });

    if (error) throw new InternalServerErrorException(error.message);

    return data;
  }
}
