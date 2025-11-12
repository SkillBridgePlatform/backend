// src/modules/modules.controller.ts
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';
import {
  CreateModuleDocs,
  GetModulesDocs,
} from 'src/docs/courses/course-modules.docs';
import { CreateCourseModuleDto } from '../dto/create-course-module-dto';
import { ReorderCourseModulesDto } from '../dto/reorder-course-modules-dto';
import { CourseModule } from '../entities/module.entity';
import { CourseModulesService } from '../services/course-modules.service';

@ApiTags('Admin - Modules')
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
  @Post()
  @CreateModuleDocs()
  async createCourseModule(
    @Param('courseId') courseId: string,
    @Body() dto: CreateCourseModuleDto,
  ): Promise<CourseModule> {
    return this.courseModulesService.createCourseModule(courseId, dto);
  }
}
