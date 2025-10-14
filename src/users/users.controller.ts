import { Controller, Get, Param } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<User | null> {
    return this.usersService.getUser(id);
  }
}
