// src/modules/modules.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';
import {
  CreateModuleDocs,
  DeleteModuleDocs,
  GetModuleByIdDocs,
  GetModulesDocs,
  UpdateModuleDocs,
} from 'src/docs/courses/course-modules.docs';
import { CreateCourseModuleDto } from '../dto/create-course-module-dto';
import { ReorderCourseModulesDto } from '../dto/reorder-course-modules-dto';
import { UpdateCourseModuleDto } from '../dto/update-course-module-dto';
import { Course } from '../entities/course.entity';
import { CourseModule } from '../entities/module.entity';
import { CourseModulesService } from '../services/course-modules.service';

@ApiTags('Admin - Course Modules')
@ApiBearerAuth('access-token')
@Controller('/admin/courses/:courseId/modules')
export class AdminCourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) {}

  @Roles(UserRole.SuperAdmin)
  @Patch('reorder')
  async reorderCourseModules(
    @Param('courseId') courseId: string,
    @Body() dto: ReorderCourseModulesDto,
  ): Promise<void> {
    return this.courseModulesService.reorderCourseModules(
      courseId,
      dto.modules,
    );
  }

  @Roles(UserRole.SuperAdmin)
  @Get()
  @GetModulesDocs()
  async getCourseModules(
    @Param('courseId') courseId: string,
  ): Promise<CourseModule[]> {
    return this.courseModulesService.getCourseModules(courseId);
  }

  @Roles(UserRole.SuperAdmin)
  @Get(':id')
  @GetModuleByIdDocs()
  async getCourseModule(
    @Param('id') id: string,
  ): Promise<(CourseModule & { course: Course }) | null> {
    return this.courseModulesService.getCourseModule(id);
  }

  @Roles(UserRole.SuperAdmin)
  @Post()
  @CreateModuleDocs()
  async createCourseModule(
    @Param('courseId') courseId: string,
    @Body() dto: CreateCourseModuleDto,
  ): Promise<CourseModule> {
    return this.courseModulesService.createCourseModule(courseId, dto);
  }

  @Roles(UserRole.SuperAdmin)
  @Patch(':id')
  @UpdateModuleDocs()
  async updateCourseModule(
    @Param('id') id: string,
    @Body() dto: UpdateCourseModuleDto,
  ): Promise<CourseModule> {
    return this.courseModulesService.updateCourseModule(id, dto);
  }

  @Roles(UserRole.SuperAdmin)
  @Delete(':id')
  @DeleteModuleDocs()
  async deleteCourseModule(@Param('id') id: string): Promise<void> {
    return this.courseModulesService.deleteCourseModule(id);
  }
}
