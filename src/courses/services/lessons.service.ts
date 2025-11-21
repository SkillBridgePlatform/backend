// src/modules/modules.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from '../dto/create-lesson-dto';
import { UpdateLessonDto } from '../dto/update-lesson-dto';
import {
  ContentBlock,
  Lesson,
  LessonWithBlocks,
} from '../entities/lesson.entity';
import { LessonsRepository } from '../repositories/lessons.repository';

@Injectable()
export class LessonsService {
  constructor(private readonly lessonsRepository: LessonsRepository) {}

  async getLessons(moduleId: string): Promise<Lesson[]> {
    return this.lessonsRepository.getLessons(moduleId);
  }

  async getLessonById(id: string): Promise<LessonWithBlocks | null> {
    const lesson = await this.lessonsRepository.getLessonById(id);
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async updateLessonWithBlocks(
    id: string,
    dto: UpdateLessonDto,
  ): Promise<Lesson & { contentBlocks: ContentBlock[] }> {
    const lesson = await this.lessonsRepository.getLessonById(id);
    if (!lesson) throw new NotFoundException('Lesson not found');

    const updatedLesson = await this.lessonsRepository.updateLessonWithBlocks(
      id,
      dto,
    );
    return updatedLesson;
  }

  async reorderLessons(
    moduleId: string,
    lessonOrders: { id: string; order: number }[],
  ): Promise<void> {
    await this.lessonsRepository.reorderLessons(moduleId, lessonOrders);
  }

  async createLesson(moduleId: string, dto: CreateLessonDto): Promise<Lesson> {
    const created = await this.lessonsRepository.createLessonWithBlocks(
      moduleId,
      dto,
    );

    return created;
  }

  async deleteLesson(id: string): Promise<void> {
    const lessonToDelete = await this.lessonsRepository.getLessonById(id);
    if (!lessonToDelete) {
      throw new NotFoundException('Lesson not found');
    }
    return this.lessonsRepository.deleteLesson(id);
  }
}
