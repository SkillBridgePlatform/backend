import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUsers(): Promise<User[]> {
    return this.usersRepository.getUsers();
  }

  getUser(id: string): Promise<User | null> {
    return this.usersRepository.getUserById(id);
  }
}
