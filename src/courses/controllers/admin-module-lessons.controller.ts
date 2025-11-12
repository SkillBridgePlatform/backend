// src/modules/modules.controller.ts
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';
import { GetLessonsDocs } from 'src/docs/courses/lessons.docs';
import { ReorderLessonsDto } from '../dto/reorder-lessons-dto';
import { Lesson } from '../entities/lesson.entity';
import { LessonsService } from '../services/lessons.service';

@ApiTags('Admin - Lessons')
@ApiBearerAuth('access-token')
@Controller('/admin/modules/:moduleId/lessons')
export class AdminModuleLessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Roles(UserRole.SuperAdmin)
  @Patch('reorder')
  async reorderLessons(
    @Param('moduleId') moduleId: string,
    @Body() dto: ReorderLessonsDto,
  ): Promise<void> {
    return this.lessonsService.reorderLessons(moduleId, dto.lessons);
  }

  @Roles(UserRole.SuperAdmin)
  @Get()
  @GetLessonsDocs()
  async getLessons(@Param('moduleId') moduleId: string): Promise<Lesson[]> {
    return this.lessonsService.getLessons(moduleId);
  }
}
