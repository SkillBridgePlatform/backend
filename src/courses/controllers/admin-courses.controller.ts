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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SortDirection, UserRole } from 'src/common/enums';
import { SortOptions } from 'src/common/interfaces';
import {
  CreateCourseDocs,
  DeleteCourseDocs,
  GetCourseByIdDocs,
  GetCoursesDocs,
  UpdateCourseDocs,
} from 'src/docs/courses/courses.docs';
import { CreateCourseDto } from '../dto/create-course-dto';
import { UpdateCourseDto } from '../dto/update-course-dto';
import { Course } from '../entities/course.entity';
import { CoursesService } from '../services/courses.service';

@ApiTags('Admin - Courses')
@ApiBearerAuth('access-token')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Controller('/admin/courses')
export class AdminCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Roles(UserRole.SuperAdmin)
  @Get()
  @GetCoursesDocs()
  async getCourses(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ courses: Course[]; total: number }> {
    const pagination = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    const sort: SortOptions = { sortBy, sortDirection };

    return this.coursesService.getCourses(pagination, search, sort);
  }

  @Roles(UserRole.SuperAdmin)
  @Get(':id')
  @GetCourseByIdDocs()
  async getCourse(@Param('id') id: string): Promise<Course> {
    return this.coursesService.getCourse(id);
  }

  @Roles(UserRole.SuperAdmin)
  @Post()
  @CreateCourseDocs()
  async createCourse(@Body() dto: CreateCourseDto): Promise<Course> {
    return this.coursesService.createCourse(dto);
  }

  @Roles(UserRole.SuperAdmin)
  @Patch(':id')
  @UpdateCourseDocs()
  async updateCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ): Promise<Course> {
    return this.coursesService.updateCourse(id, dto);
  }

  @Roles(UserRole.SuperAdmin)
  @Delete(':id')
  @DeleteCourseDocs()
  async deleteCourse(@Param('id') id: string): Promise<void> {
    return this.coursesService.deleteCourse(id);
  }
}
