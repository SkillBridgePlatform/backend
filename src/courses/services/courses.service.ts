import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { School } from 'src/schools/entities/schools.entity';
import { CreateCourseDto } from '../dto/create-course-dto';
import { UpdateCourseDto } from '../dto/update-course-dto';
import { Course, CourseWithModulesAndLessons } from '../entities/course.entity';
import { CoursesRepository } from '../repositories/courses.repository';
import { CourseSchoolsRepository } from '../repositories/school-courses.repository';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly courseSchoolsRepository: CourseSchoolsRepository,
  ) {}

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

  async getCourseWithModulesAndLessons(
    courseId: string,
  ): Promise<CourseWithModulesAndLessons | null> {
    const course =
      await this.coursesRepository.getCourseWithModulesAndLessons(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  // Course Schools

  async assignSchoolsToCourse(
    courseId: string,
    schoolIds: string[],
  ): Promise<void> {
    return await this.courseSchoolsRepository.assignSchoolsToCourse(
      courseId,
      schoolIds,
    );
  }

  async getAvailableSchoolsForCourseAssignment(
    courseId: string,
  ): Promise<Partial<School>[]> {
    return this.courseSchoolsRepository.getAvailableSchoolsForCourseAssignment(
      courseId,
    );
  }

  async unassignSchoolsFromCourse(
    courseId: string,
    schoolIds: string[],
  ): Promise<void> {
    return this.courseSchoolsRepository.unassignSchoolsFromCourse(
      courseId,
      schoolIds,
    );
  }

  async getSchoolsAssignedToCourse(
    courseId: string,
    pagination: PaginationOptions = {},
    sort: SortOptions = {},
    search?: string,
  ): Promise<{ schools: School[]; total: number }> {
    return this.courseSchoolsRepository.getSchoolsAssignedToCourse(
      courseId,
      pagination,
      sort,
      search,
    );
  }
}
