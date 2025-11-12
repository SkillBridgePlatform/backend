import { LessonsRepository } from './../repositories/lessons.repository';
// src/modules/modules.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';
import { GetLessonByIdDocs } from 'src/docs/courses/lessons.docs';
import { Course } from '../entities/course.entity';
import { Lesson } from '../entities/lesson.entity';
import { CourseModule } from '../entities/module.entity';

@ApiTags('Admin - Lessons')
@ApiBearerAuth('access-token')
@Controller('/admin/lessons')
export class AdminLessonsController {
  constructor(private readonly lessonsRepository: LessonsRepository) {}

  @Roles(UserRole.SuperAdmin)
  @Get(':id')
  @GetLessonByIdDocs()
  async getLesson(
    @Param('id') id: string,
  ): Promise<
    (Lesson & { courseModule: CourseModule & { course: Course } }) | null
  > {
    return this.lessonsRepository.getLessonById(id);
  }
}
