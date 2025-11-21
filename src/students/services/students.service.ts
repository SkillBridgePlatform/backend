import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClassCoursesRepository } from 'src/classes/repositories/class-courses.repository';
import { ClassStudentsRepository } from 'src/classes/repositories/class-students.repository';
import { Course } from 'src/courses/entities/course.entity';
import { CoursesRepository } from 'src/courses/repositories/courses.repository';
import { Student } from '../entities/students.entity';
import { StudentsRepository } from '../repositories/students.repository';

@Injectable()
export class StudentsService {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly classCoursesRepository: ClassCoursesRepository,
    private readonly classStudentsRepository: ClassStudentsRepository,
  ) {}

  async validateStudent(username: string, pin: string): Promise<Student> {
    const student =
      await this.studentsRepository.getStudentByUsername(username);
    if (!student || student.pin !== pin) {
      throw new UnauthorizedException('Invalid username or pin');
    }
    return student;
  }

  async getProfile(studentId: string): Promise<Student> {
    const student = await this.studentsRepository.getStudentById(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const safeStudent = { ...student };
    delete (safeStudent as any).pin;
    return safeStudent as Student;
  }

  async getStudentCourses(studentId: string): Promise<Course[]> {
    const classIds =
      await this.classStudentsRepository.getStudentClassIds(studentId);
    if (!classIds.length) return [];

    const courseIds =
      await this.classCoursesRepository.getCourseIdsForClasses(classIds);
    if (!courseIds.length) return [];

    return this.coursesRepository.getCoursesByIds(courseIds);
  }
}
