// src/users/repository/users-supabase.repository.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRole } from 'src/common/enums';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { School } from 'src/schools/entities/schools.entity';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateStaffUserDto } from './dto/create-staff-dto';
import { UpdateStaffUserDto } from './dto/update-staff-dto';
import { User, UserFilters, UserInfo } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getUsers(
    filters: UserFilters = {},
    pagination: PaginationOptions = {},
    search?: string,
    sort?: SortOptions,
  ): Promise<{ users: User[]; total: number }> {
    let query = this.supabase.client
      .from('users')
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
        `first_name.ilike.${searchPattern},last_name.ilike.${searchPattern},email.ilike.${searchPattern}`,
      );
    }

    // ✅ Apply sorting
    const allowedSortFields = ['first_name', 'created_at'];
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

    return { users: data as User[], total: count ?? 0 };
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

  async getUserInfo(id: string): Promise<UserInfo | null> {
    const { data, error } = await this.supabase.client
      .from('users')
      .select(
        `
        *,
        school:schools(*)
      `,
      )
      .eq('id', id)
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data) return null;

    const { school, ...profile } = data;

    return {
      profile: profile as User,
      school: school as School | null,
    };
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

  async updateProfile(
    id: string,
    updates: Partial<Pick<User, 'first_name' | 'last_name' | 'language'>>,
  ): Promise<User> {
    const safeUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined),
    );

    if (Object.keys(safeUpdates).length === 0) {
      throw new BadRequestException('No updates provided');
    }

    const { data, error } = await this.supabase.client
      .from('users')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data) throw new InternalServerErrorException('Profile update failed');

    return data as User;
  }

  async countUsersByRole(role: UserRole, schoolId?: string): Promise<number> {
    let query = this.supabase.client
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', role);

    if (schoolId) query = query.eq('school_id', schoolId);

    const { count, error } = await query;

    if (error) throw new InternalServerErrorException(error.message);

    return count ?? 0;
  }

  async countSchools(): Promise<number> {
    const { count, error } = await this.supabase.client
      .from('schools')
      .select('id', { count: 'exact', head: true });

    if (error) throw new InternalServerErrorException(error.message);

    return count ?? 0;
  }
}
