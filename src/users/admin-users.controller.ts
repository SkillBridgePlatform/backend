import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AdminJwtGuard } from 'src/auth/guards/admin-jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SortDirection, UserLanguage, UserRole } from 'src/common/enums';
import { SortOptions } from 'src/common/interfaces';
import { CreateStaffUserDto } from './dto/create-staff-dto';
import { UpdateProfileDto } from './dto/update-profile-dto';
import { UpdateStaffUserDto } from './dto/update-staff-dto';
import { User, UserInfo } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Admin - Users')
@ApiBearerAuth('access-token')
@UseGuards(AdminJwtGuard, RolesGuard)
@Controller('users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  @ApiOperation({ summary: 'Update the authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Profile successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request / validation error' })
  async updateProfile(
    @Req() req: Request,
    @Body() dto: UpdateProfileDto,
  ): Promise<User> {
    const userId = req.user!.id;
    return this.usersService.updateProfile(userId, dto);
  }

  @Roles()
  @Get('userinfo')
  @ApiOperation({ summary: 'Retrieve user info' })
  @ApiResponse({ status: 200, description: 'User info found' })
  @ApiResponse({ status: 404, description: 'User info not found' })
  async getUserInfo(@Req() req: Request): Promise<UserInfo> {
    const userId = req.user!.id;
    return await this.usersService.getUserInfo(userId);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Get()
  @ApiOperation({
    summary: 'Retrieve users with optional filters, pagination, and sorting',
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
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortDirection', required: false, enum: ['asc', 'desc'] })
  async getUsers(
    @Req() req: Request,
    @Query('role') role?: UserRole,
    @Query('school_id') school_id?: string,
    @Query('language') language?: UserLanguage,
    @Query('first_name') first_name?: string,
    @Query('last_name') last_name?: string,
    @Query('email') email?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ users: User[]; total: number }> {
    const filters = { role, school_id, language, first_name, last_name, email };
    const pagination = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    const sort: SortOptions = { sortBy, sortDirection };
    const authUser = req.user;

    return this.usersService.getUsers(
      authUser,
      filters,
      pagination,
      search,
      sort,
    );
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Req() req: Request, @Param('id') id: string): Promise<User> {
    const authUser = req.user;
    return await this.usersService.getUser(authUser, id);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Post('staff')
  @ApiOperation({ summary: 'Create a new staff/admin user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request / validation error' })
  async createStaffUser(
    @Req() req: Request,
    @Body() dto: CreateStaffUserDto,
  ): Promise<User> {
    const authUser = req.user;
    return this.usersService.createStaffUser(authUser, dto);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Patch('staff/:id')
  @ApiOperation({ summary: 'Update an existing staff/admin user' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateStaffUser(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateStaffUserDto,
  ): Promise<User> {
    const authUser = req.user;
    return this.usersService.updateStaffUser(authUser, id, dto);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Delete('staff/:id')
  @ApiOperation({ summary: 'Delete a staff/admin user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteStaffUser(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<void> {
    const authUser = req.user;
    return this.usersService.deleteStaffUser(authUser, id);
  }
}
