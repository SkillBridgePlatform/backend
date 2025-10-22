import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationOptions } from 'src/common/interfaces';
import { CreateStaffUserDto } from './dto/create-staff-dto';
import { UpdateStaffUserDto } from './dto/update-staff-dto';
import { User, UserFilters } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(
    filters: UserFilters = {},
    pagination: PaginationOptions = {},
  ): Promise<User[]> {
    return this.usersRepository.getUsers(filters, pagination);
  }

  async getUser(id: string): Promise<User> {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async createStaffUser(createStaffUserDto: CreateStaffUserDto): Promise<User> {
    return this.usersRepository.createStaffUser(createStaffUserDto);
  }

  async updateStaffUser(
    id: string,
    updates: UpdateStaffUserDto,
  ): Promise<User> {
    return this.usersRepository.updateStaffUser(id, updates);
  }

  async deleteStaffUser(id: string): Promise<void> {
    return this.usersRepository.deleteStaffUser(id);
  }
}
