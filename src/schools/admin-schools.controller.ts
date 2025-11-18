import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SortDirection, UserRole } from 'src/common/enums';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { Course } from 'src/courses/entities/course.entity';
import { CreateSchoolDto } from './dto/create-school-dto';
import { UpdateSchoolDto } from './dto/update-school-dto';
import { School } from './entities/schools.entity';
import { SchoolsService } from './schools.service';

@ApiTags('Admin - Schools')
@ApiBearerAuth('access-token')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Controller('/admin/schools')
export class AdminSchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Get(':id/courses')
  @ApiOperation({
    summary:
      'Retrieve courses assigned to a school with optional pagination and search',
  })
  @ApiResponse({
    status: 200,
    description: 'List of classes with total count',
  })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortDirection', required: false })
  async getCoursesForSchool(
    @Param('id') school_id: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ courses: Course[]; total: number }> {
    const pagination: PaginationOptions = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };

    const sort: SortOptions = { sortBy, sortDirection };

    return this.schoolsService.getCoursesForSchool(
      school_id,
      pagination,
      sort,
      search,
    );
  }

  @Roles(UserRole.SuperAdmin)
  @Get()
  @ApiOperation({
    summary: 'Retrieve schools with optional pagination and search',
  })
  @ApiResponse({ status: 200, description: 'List of schools with total count' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortDirection', required: false })
  async getSchools(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ schools: School[]; total: number }> {
    const pagination: PaginationOptions = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    const sort: SortOptions = { sortBy, sortDirection };
    return this.schoolsService.getSchools(pagination, sort, search);
  }

  @Roles(UserRole.SuperAdmin)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a school by ID' })
  @ApiResponse({ status: 200, description: 'School found' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async getSchool(@Param('id') id: string): Promise<School | null> {
    return this.schoolsService.getSchool(id);
  }

  @Roles(UserRole.SuperAdmin)
  @Post()
  @ApiOperation({ summary: 'Create a new school' })
  @ApiResponse({ status: 201, description: 'School successfully created' })
  async createSchool(@Body() dto: CreateSchoolDto): Promise<School> {
    return this.schoolsService.createSchool(dto);
  }

  @Roles(UserRole.SuperAdmin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing school' })
  @ApiResponse({ status: 200, description: 'School successfully updated' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async updateSchool(
    @Param('id') id: string,
    @Body() dto: UpdateSchoolDto,
  ): Promise<School> {
    return this.schoolsService.updateSchool(id, dto);
  }

  @Roles(UserRole.SuperAdmin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a school' })
  @ApiResponse({ status: 200, description: 'School successfully deleted' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async deleteSchool(@Param('id') id: string): Promise<void> {
    return this.schoolsService.deleteSchool(id);
  }
}
