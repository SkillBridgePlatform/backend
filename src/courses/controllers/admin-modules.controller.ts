// src/modules/modules.controller.ts
import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';
import {
  DeleteModuleDocs,
  GetModuleByIdDocs,
  UpdateModuleDocs,
} from 'src/docs/courses/course-modules.docs';
import { UpdateCourseModuleDto } from '../dto/update-course-module-dto';
import { Course } from '../entities/course.entity';
import { CourseModule } from '../entities/module.entity';
import { CourseModulesService } from '../services/course-modules.service';

@ApiTags('Admin - Modules')
@ApiBearerAuth('access-token')
@Controller('/admin/modules')
export class AdminModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) {}

  @Roles(UserRole.SuperAdmin)
  @Get(':id')
  @GetModuleByIdDocs()
  async getCourseModule(
    @Param('id') id: string,
  ): Promise<(CourseModule & { course: Course }) | null> {
    return this.courseModulesService.getCourseModule(id);
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
