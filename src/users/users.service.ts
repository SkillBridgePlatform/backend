import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from 'src/common/enums';
import { PaginationOptions } from 'src/common/interfaces';
import { CreateStaffUserDto } from './dto/create-staff-dto';
import { UpdateStaffUserDto } from './dto/update-staff-dto';
import { User, UserFilters } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(
    authUser,
    filters: UserFilters = {},
    pagination: PaginationOptions = {},
    search?: string,
  ): Promise<{ users: User[]; total: number }> {
    if (authUser.app_metadata.role == UserRole.SchoolAdmin) {
      filters.school_id = authUser.school_id;
      if (filters.role == UserRole.SuperAdmin) {
        throw new ForbiddenException('Cannot fetch SuperAdmins');
      }
    }

    return this.usersRepository.getUsers(filters, pagination, search);
  }

  async getUser(authUser, id: string): Promise<User> {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (
      user.role == UserRole.SuperAdmin &&
      authUser.app_metadata.role == UserRole.SchoolAdmin
    ) {
      throw new ForbiddenException('Cannot fetch SuperAdmin');
    }

    return user;
  }

  async createStaffUser(
    authUser,
    createStaffUserDto: CreateStaffUserDto,
  ): Promise<User> {
    if (
      authUser.app_metadata.role == UserRole.SchoolAdmin &&
      [UserRole.SchoolAdmin, UserRole.SuperAdmin].includes(
        createStaffUserDto.role,
      )
    ) {
      throw new ForbiddenException('Cannot create SuperAdmin or SchoolAdmin');
    }
    return this.usersRepository.createStaffUser(createStaffUserDto);
  }

  async updateStaffUser(
    authUser: any,
    id: string,
    updates: UpdateStaffUserDto,
  ): Promise<User> {
    const userToUpdate = await this.usersRepository.getUserById(id);
    if (!userToUpdate) {
      throw new NotFoundException(`User not found`);
    }

    const authUserRole = authUser.app_metadata.role;
    const userToUpdateRole = userToUpdate.role as UserRole;

    if (
      authUserRole == UserRole.SchoolAdmin &&
      [UserRole.SchoolAdmin, UserRole.SuperAdmin].includes(userToUpdateRole)
    ) {
      throw new ForbiddenException('Cannot update SuperAdmin or SchoolAdmin');
    }
    return this.usersRepository.updateStaffUser(id, updates);
  }

  async deleteStaffUser(authUser, id: string): Promise<void> {
    const userToDelete = await this.usersRepository.getUserById(id);
    if (!userToDelete) {
      throw new NotFoundException(`User not found`);
    }

    const authUserRole = authUser.app_metadata.role;
    const userToDeleteRole = userToDelete.role as UserRole;

    if (
      authUserRole == UserRole.SchoolAdmin &&
      [UserRole.SchoolAdmin, UserRole.SuperAdmin].includes(userToDeleteRole)
    ) {
      throw new ForbiddenException('Cannot delete SuperAdmin or SchoolAdmin');
    }

    return this.usersRepository.deleteStaffUser(id);
  }

  async updateProfile(
    id: string,
    updates: Partial<Pick<User, 'first_name' | 'last_name' | 'language'>>,
  ): Promise<User> {
    return this.usersRepository.updateProfile(id, updates);
  }
}
