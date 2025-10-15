import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.getUsers();
  }

  async getUser(id: string): Promise<User> {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.createUser(createUserDto);
  }
}
