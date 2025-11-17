import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { CreateCourseDto } from '../dto/create-course-dto';
import { UpdateCourseDto } from '../dto/update-course-dto';
import { Course } from '../entities/course.entity';
import { CoursesRepository } from '../repositories/courses.repository';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async getCourses(
    pagination: PaginationOptions = {},
    search?: string,
    sort?: SortOptions,
  ): Promise<{ courses: Course[]; total: number }> {
    return this.coursesRepository.getCourses(pagination, search, sort);
  }

  async getCourse(id: string): Promise<Course> {
    const course = await this.coursesRepository.getCourseById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesRepository.createCourse(createCourseDto);
  }

  async updateCourse(id: string, updates: UpdateCourseDto): Promise<Course> {
    const courseToUpdate = await this.coursesRepository.getCourseById(id);
    if (!courseToUpdate) {
      throw new NotFoundException('Course not found');
    }
    return this.coursesRepository.updateCourse(id, updates);
  }

  async deleteCourse(id: string): Promise<void> {
    const courseToDelete = await this.coursesRepository.getCourseById(id);
    if (!courseToDelete) {
      throw new NotFoundException('Course not found');
    }
    return this.coursesRepository.deleteCourse(id);
  }
}
