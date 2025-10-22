// src/users/repository/users-supabase.repository.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRole } from 'src/common/enums';
import { PaginationOptions } from 'src/common/interfaces';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateStaffUserDto } from './dto/create-staff-dto';
import { UpdateStaffUserDto } from './dto/update-staff-dto';
import { User, UserFilters } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getUsers(
    filters: UserFilters = {},
    pagination: PaginationOptions = {},
  ): Promise<User[]> {
    let query = this.supabase.client.from('users').select('*');

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        query = query.eq(key, value);
      }
    });

    if (pagination.limit !== undefined) query = query.limit(pagination.limit);
    if (pagination.offset !== undefined)
      query = query.range(
        pagination.offset,
        pagination.offset + (pagination.limit ?? 0) - 1,
      );

    const { data, error } = await query;

    if (error) throw new InternalServerErrorException(error.message);
    return data as User[];
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase.client
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async createStaffUser(createStaffUserDto: CreateStaffUserDto): Promise<User> {
    const {
      email,
      password,
      role,
      first_name,
      last_name,
      school_id,
      language,
    } = createStaffUserDto;

    if (!email || !password)
      throw new InternalServerErrorException('Email and password are required');

    const supabase = this.supabase.client;

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password,
        email_confirm: true,
        app_metadata: { role },
        user_metadata: { first_name, last_name },
      });

    if (authError) throw new InternalServerErrorException(authError.message);
    if (!authData.user)
      throw new InternalServerErrorException('Failed to create user in Auth');

    const { data: userData, error: dbError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email!,
        role,
        first_name,
        last_name,
        school_id: role === UserRole.SuperAdmin ? null : school_id,
        language,
      })
      .select()
      .single();

    if (dbError) throw new InternalServerErrorException(dbError.message);
    return userData;
  }

  async updateStaffUser(
    id: string,
    updates: UpdateStaffUserDto,
  ): Promise<User> {
    if (updates.role === UserRole.SuperAdmin) updates.school_id = null;

    const { data, error } = await this.supabase.client
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data as User;
  }

  async deleteStaffUser(id: string): Promise<void> {
    const { error: authError } =
      await this.supabase.client.auth.admin.deleteUser(id);
    if (authError) throw new InternalServerErrorException(authError.message);

    const { error: dbError } = await this.supabase.client
      .from('users')
      .delete()
      .eq('id', id);

    if (dbError) throw new InternalServerErrorException(dbError.message);
  }
}
