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
} from '@nestjs/swagger';
import type { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateClassDto } from 'src/classes/dto/create-class-dto';
import { UpdateClassDto } from 'src/classes/dto/update-class-dto';
import { Class } from 'src/classes/entities/classes.entity';
import { SortDirection, UserRole } from 'src/common/enums';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { User } from 'src/users/entities/user.entity';
import { ClassesService } from './classes.service';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve classes with optional pagination and search',
  })
  @ApiResponse({ status: 200, description: 'List of classes with total count' })
  @ApiQuery({ name: 'school_id', required: false })
  @ApiQuery({ name: 'teacher_id', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortDirection', required: false })
  async getClasses(
    @Req() req: Request,
    @Query('school_id') school_id?: string,
    @Query('teacher_id') teacher_id?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ classes: Class[]; total: number }> {
    const filters = { school_id, teacher_id };
    const pagination: PaginationOptions = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    const sort: SortOptions = { sortBy, sortDirection };

    const authUser = req.user;
    return this.classesService.getClasses(
      authUser,
      filters,
      pagination,
      sort,
      search,
    );
  }

  @Get('teacher')
  @ApiOperation({
    summary:
      'Retrieve classes assigned to a specific teacher with optional pagination and search',
  })
  @ApiResponse({ status: 200, description: 'List of classes with total count' })
  @ApiQuery({ name: 'teacher_id', required: true, description: 'Teacher UUID' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortDirection', required: false })
  async getClassesForTeacher(
    @Req() req: Request,
    @Query('teacher_id') teacher_id: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ classes: Class[]; total: number }> {
    const pagination: PaginationOptions = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    const sort: SortOptions = { sortBy, sortDirection };

    return this.classesService.getClassesForTeacher(
      teacher_id,
      pagination,
      sort,
      search,
    );
  }

  @Get(':classId/teachers')
  @ApiOperation({
    summary:
      'Retrieve all teachers assigned to a specific class with optional pagination, search, and sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'List of teachers with total count',
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Pagination limit' })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Pagination offset',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name or email',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by (name or created_at)',
  })
  @ApiQuery({
    name: 'sortDirection',
    required: false,
    description: 'Sort direction: asc or desc',
  })
  async getTeachersForClass(
    @Param('classId') classId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ teachers: any[]; total: number }> {
    const pagination: PaginationOptions = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    const sort: SortOptions = { sortBy, sortDirection };

    return this.classesService.getTeachersForClass(
      classId,
      pagination,
      sort,
      search,
    );
  }

  @Get(':classId/students')
  @ApiOperation({
    summary:
      'Retrieve all students assigned to a specific class with optional pagination, search, and sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'List of students with total count',
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Pagination limit' })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Pagination offset',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name or email',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by (name or created_at)',
  })
  @ApiQuery({
    name: 'sortDirection',
    required: false,
    description: 'Sort direction: asc or desc',
  })
  async getStudentsForClass(
    @Param('classId') classId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ students: any[]; total: number }> {
    const pagination: PaginationOptions = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    const sort: SortOptions = { sortBy, sortDirection };

    return this.classesService.getStudentsForClass(
      classId,
      pagination,
      sort,
      search,
    );
  }

  @Get(':classId/available-teachers')
  @ApiOperation({
    summary:
      'Retrieve all available teachers (users with role = teacher) who are not yet assigned to a specific class, with optional pagination, search, and sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available teachers with total count',
  })
  async getAvailableTeachersForClass(
    @Param('classId') classId: string,
  ): Promise<Partial<User>[]> {
    return this.classesService.getAvailableTeachersForClass(classId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a class by ID' })
  @ApiResponse({ status: 200, description: 'Class found' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async getClass(@Param('id') id: string): Promise<Class | null> {
    return this.classesService.getClass(id);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Post()
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'Class successfully created' })
  async createClass(@Body() dto: CreateClassDto): Promise<Class> {
    return this.classesService.createClass(dto);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing class' })
  @ApiResponse({ status: 200, description: 'Class successfully updated' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async updateClass(
    @Param('id') id: string,
    @Body() dto: UpdateClassDto,
  ): Promise<Class> {
    return this.classesService.updateClass(id, dto);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a class' })
  @ApiResponse({ status: 200, description: 'Class successfully deleted' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async deleteClass(@Param('id') id: string): Promise<void> {
    return this.classesService.deleteClass(id);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Post(':id/students')
  @ApiOperation({ summary: 'Assign students to a class' })
  @ApiResponse({ status: 200, description: 'Students successfully assigned' })
  async assignStudentsToClass(
    @Param('id') classId: string,
    @Body('studentIds') studentIds: string[],
  ): Promise<void> {
    return this.classesService.assignStudentsToClass(classId, studentIds);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Post(':id/teachers')
  @ApiOperation({ summary: 'Assign teachers to a class' })
  @ApiResponse({ status: 200, description: 'Teachers successfully assigned' })
  async assignTeachersToClass(
    @Param('id') classId: string,
    @Body('teacherIds') teacherIds: string[],
  ): Promise<void> {
    return this.classesService.assignTeachersToClass(classId, teacherIds);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Delete(':id/teachers')
  @ApiOperation({ summary: 'Unassign teachers from a class' })
  @ApiResponse({ status: 200, description: 'Teachers successfully unassigned' })
  async unassignTeachersFromClass(
    @Param('id') classId: string,
    @Body('teacherIds') teacherIds: string[],
  ): Promise<void> {
    return this.classesService.unassignTeachersFromClass(classId, teacherIds);
  }
}
