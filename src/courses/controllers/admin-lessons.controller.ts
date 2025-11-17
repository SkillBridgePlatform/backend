// src/modules/modules.controller.ts
import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';
import {
  DeleteLessonDocs,
  GetLessonByIdDocs,
  UpdateLessonDocs,
} from 'src/docs/courses/lessons.docs';
import { UpdateLessonDto } from '../dto/update-lesson-dto';
import {
  ContentBlock,
  Lesson,
  LessonWithBlocks,
} from '../entities/lesson.entity';
import { LessonsService } from '../services/lessons.service';

@ApiTags('Admin - Lessons')
@ApiBearerAuth('access-token')
@Controller('/admin/lessons')
export class AdminLessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Roles(UserRole.SuperAdmin)
  @Get(':id')
  @GetLessonByIdDocs()
  async getLesson(@Param('id') id: string): Promise<LessonWithBlocks | null> {
    return this.lessonsService.getLessonById(id);
  }

  @Roles(UserRole.SuperAdmin)
  @Patch(':id')
  @UpdateLessonDocs()
  async updateLessonWithBlocks(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
  ): Promise<Lesson & { contentBlocks: ContentBlock[] }> {
    return this.lessonsService.updateLessonWithBlocks(id, dto);
  }

  @Roles(UserRole.SuperAdmin)
  @Delete(':id')
  @DeleteLessonDocs()
  async deleteLesson(@Param('id') id: string): Promise<void> {
    return this.lessonsService.deleteLesson(id);
  }
}
