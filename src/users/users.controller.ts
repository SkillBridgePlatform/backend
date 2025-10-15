import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.usersService.getUser(id);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request / validation error' })
  async signUp(@Body() dto: CreateUserDto): Promise<User> {
    return await this.usersService.signUp(dto);
  }
}
