import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Student } from '../entities/students.entity';
import { StudentsRepository } from '../repositories/students.repository';

@Injectable()
export class StudentsService {
  constructor(private readonly studentsRepository: StudentsRepository) {}

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
}
