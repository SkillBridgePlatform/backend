import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User | null> {
    return await this.usersService.getUser(id);
  }

  @Post('signup')
  async signUp(@Body() dto: CreateUserDto): Promise<User> {
    return await this.usersService.signUp(dto);
  }
}
