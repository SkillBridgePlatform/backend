import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users - fetch all users
  @Get()
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.usersService.getUsers();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // GET /users/:id - fetch a single user by ID
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User | null> {
    try {
      return await this.usersService.getUser(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // POST /users/signup - create a new user
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.signUp(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
