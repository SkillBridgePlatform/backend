import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserLanguage, UserRole } from 'src/common/enums';
import { CreateStaffUserDto } from './dto/create-staff-dto';
import { UpdateStaffUserDto } from './dto/update-staff-dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve users with optional filters and pagination',
  })
  @ApiResponse({ status: 200, description: 'List of users with total count' })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'school_id', required: false })
  @ApiQuery({ name: 'language', required: false })
  @ApiQuery({ name: 'first_name', required: false })
  @ApiQuery({ name: 'last_name', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getUsers(
    @Query('role') role?: UserRole,
    @Query('school_id') school_id?: string,
    @Query('language') language?: UserLanguage,
    @Query('first_name') first_name?: string,
    @Query('last_name') last_name?: string,
    @Query('email') email?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
  ): Promise<{ users: User[]; total: number }> {
    const filters = { role, school_id, language, first_name, last_name, email };
    const pagination = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };

    return this.usersService.getUsers(filters, pagination, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.usersService.getUser(id);
  }

  @Post('staff')
  @ApiOperation({ summary: 'Create a new staff/admin user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request / validation error' })
  async createStaffUser(@Body() dto: CreateStaffUserDto): Promise<User> {
    return this.usersService.createStaffUser(dto);
  }

  @Patch('staff/:id')
  @ApiOperation({ summary: 'Update an existing staff/admin user' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateStaffUser(
    @Param('id') id: string,
    @Body() dto: UpdateStaffUserDto,
  ): Promise<User> {
    return this.usersService.updateStaffUser(id, dto);
  }

  @Delete('staff/:id')
  @ApiOperation({ summary: 'Delete a staff/admin user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteStaffUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteStaffUser(id);
  }
}
