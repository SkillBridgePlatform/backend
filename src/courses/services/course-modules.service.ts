// src/modules/modules.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseModuleDto } from '../dto/create-course-module-dto';
import { UpdateCourseModuleDto } from '../dto/update-course-module-dto';
import { Course } from '../entities/course.entity';
import { CourseModule } from '../entities/module.entity';
import { CourseModulesRepository } from '../repositories/course-modules.repository';

@Injectable()
export class CourseModulesService {
  constructor(
    private readonly courseModulesRepository: CourseModulesRepository,
  ) {}

  async getCourseModules(courseId: string): Promise<CourseModule[]> {
    return this.courseModulesRepository.getCourseModules(courseId);
  }

  async getCourseModule(
    id: string,
  ): Promise<(CourseModule & { course: Course }) | null> {
    const module = await this.courseModulesRepository.getCourseModuleById(id);
    if (!module) throw new NotFoundException('Module not found');
    return module;
  }

  async createCourseModule(
    courseId: string,
    createCourseModuleDto: CreateCourseModuleDto,
  ): Promise<CourseModule> {
    return this.courseModulesRepository.createCourseModule(
      courseId,
      createCourseModuleDto,
    );
  }

  async updateCourseModule(
    id: string,
    updates: UpdateCourseModuleDto,
  ): Promise<CourseModule> {
    const moduleToUpdate =
      await this.courseModulesRepository.getCourseModuleById(id);
    if (!moduleToUpdate) throw new NotFoundException('Module not found');
    return this.courseModulesRepository.updateCourseModule(id, updates);
  }

  async deleteCourseModule(id: string): Promise<void> {
    return this.courseModulesRepository.deleteCourseModule(id);
  }

  async reorderCourseModules(
    courseId: string,
    moduleOrders: { id: string; order: number }[],
  ): Promise<void> {
    await this.courseModulesRepository.reorderCourseModules(
      courseId,
      moduleOrders,
    );
  }
}
