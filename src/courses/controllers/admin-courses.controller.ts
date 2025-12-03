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
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import {
  AssignSchoolsToCourseDocs,
  CreateCourseDocs,
  DeleteCourseDocs,
  GetAvailableSchoolsForCourseAssignmentDocs,
  GetCourseByIdDocs,
  GetCoursesDocs,
  getCourseWithModulesAndLessonsByIdDocs,
  GetSchoolsAssignedToCourseDocs,
  UnassignSchoolsFromCourseDocs,
  UpdateCourseDocs,
} from 'src/docs/courses/courses.docs';
import { School } from 'src/schools/entities/schools.entity';
import { CreateCourseDto } from '../dto/create-course-dto';
import { UpdateCourseDto } from '../dto/update-course-dto';
import { Course, CourseWithModulesAndLessons } from '../entities/course.entity';
import { CoursesService } from '../services/courses.service';

@ApiTags('Admin - Courses')
@ApiBearerAuth('access-token')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Controller('/admin/courses')
export class AdminCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Get(':id/full')
  @getCourseWithModulesAndLessonsByIdDocs()
  async getCourseWithModulesAndLessonsById(
    @Param('id') id: string,
  ): Promise<CourseWithModulesAndLessons | null> {
    return this.coursesService.getCourseWithModulesAndLessonsById(id);
  }

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

  //#region Course Schools

  @Roles(UserRole.SuperAdmin)
  @Get(':courseId/schools')
  @GetSchoolsAssignedToCourseDocs()
  async getSchoolsAssignedToCourse(
    @Param('courseId') courseId: string,
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

    return this.coursesService.getSchoolsAssignedToCourse(
      courseId,
      pagination,
      sort,
      search,
    );
  }

  @Roles(UserRole.SuperAdmin)
  @Get(':courseId/available-schools')
  @GetAvailableSchoolsForCourseAssignmentDocs()
  async getAvailableSchoolsForCourseAssignment(
    @Param('courseId') courseId: string,
  ): Promise<Partial<School>[]> {
    return this.coursesService.getAvailableSchoolsForCourseAssignment(courseId);
  }

  @Roles(UserRole.SuperAdmin)
  @Post(':courseId/schools')
  @AssignSchoolsToCourseDocs()
  async assignSchoolsToCourse(
    @Param('courseId') courseId: string,
    @Body('schoolIds') schoolIds: string[],
  ): Promise<void> {
    return this.coursesService.assignSchoolsToCourse(courseId, schoolIds);
  }

  @Roles(UserRole.SuperAdmin)
  @Delete(':courseId/schools')
  @UnassignSchoolsFromCourseDocs()
  async unassignSchoolsFromCourse(
    @Param('courseId') courseId: string,
    @Body('schoolIds') schoolIds: string[],
  ): Promise<void> {
    return this.coursesService.unassignSchoolsFromCourse(courseId, schoolIds);
  }

  //#endregion
}
