// src/users/repository/users-supabase.repository.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getUsers(): Promise<User[]> {
    const { data, error } = await this.supabase.client
      .from('users')
      .select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}
