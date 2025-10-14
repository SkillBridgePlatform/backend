// src/users/repository/users-supabase.repository.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUserDto } from './dto/create-user-dto';
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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...profileData } = createUserDto;

    const { data: authData, error: authError } =
      await this.supabase.client.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password,
        email_confirm: true,
        user_metadata: profileData,
      });

    if (authError) throw new Error(authError.message);

    if (!authData.user) {
      throw new Error('User creation failed');
    }

    return {
      id: authData.user.id,
      email: authData.user.email ?? '',
      ...profileData,
    } as User;
  }
}
