import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // Fetch all users
  async getUsers(): Promise<User[]> {
    return await this.usersRepository.getUsers();
  }

  // Fetch a single user by ID
  async getUser(id: string): Promise<User | null> {
    return await this.usersRepository.getUserById(id);
  }

  // Create a new user (sign up)
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.createUser(createUserDto);
  }
}
