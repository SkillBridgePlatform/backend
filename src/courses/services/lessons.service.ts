// src/modules/modules.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from '../entities/course.entity';
import { Lesson } from '../entities/lesson.entity';
import { CourseModule } from '../entities/module.entity';
import { LessonsRepository } from '../repositories/lessons.repository';

@Injectable()
export class LessonsService {
  constructor(private readonly lessonsRepository: LessonsRepository) {}

  async getLessons(moduleId: string): Promise<Lesson[]> {
    return this.lessonsRepository.getLessons(moduleId);
  }

  async getLessonById(
    id: string,
  ): Promise<
    (Lesson & { courseModule: CourseModule & { course: Course } }) | null
  > {
    const lesson = await this.lessonsRepository.getLessonById(id);
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async reorderLessons(
    moduleId: string,
    lessonOrders: { id: string; order: number }[],
  ): Promise<void> {
    await this.lessonsRepository.reorderLessons(moduleId, lessonOrders);
  }
}
