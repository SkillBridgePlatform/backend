// src/modules/modules.controller.ts
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { SortDirection, UserRole } from 'src/common/enums';
import { SortOptions } from 'src/common/interfaces';
import {
  CreateModuleDocs,
  DeleteModuleDocs,
  GetModuleByIdDocs,
  GetModulesDocs,
  UpdateModuleDocs,
} from 'src/docs/courses/course-modules.docs';
import { CreateCourseModuleDto } from '../dto/create-course-module-dto';
import { UpdateCourseModuleDto } from '../dto/update-course-module-dto';
import { CourseModule } from '../entities/module.entity';
import { CourseModulesService } from '../services/course-modules.service';

@ApiTags('Admin - Course Modules')
@ApiBearerAuth('access-token')
@Controller('/admin/courses/:courseId/modules')
export class AdminCourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) {}

  @Roles(UserRole.SuperAdmin)
  @Get()
  @GetModulesDocs()
  async getCourseModules(
    @Param('courseId') courseId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ courseModules: CourseModule[]; total: number }> {
    const pagination = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    const sort: SortOptions = { sortBy, sortDirection };
    return this.courseModulesService.getCourseModules(
      courseId,
      pagination,
      search,
      sort,
    );
  }

  @Roles(UserRole.SuperAdmin)
  @Get(':id')
  @GetModuleByIdDocs()
  async getCourseModule(@Param('id') id: string): Promise<CourseModule> {
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
