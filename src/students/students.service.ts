import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationOptions } from 'src/common/interfaces';
import { CreateStudentDto } from './dto/create-student-dto';
import { UpdateStudentDto } from './dto/update-student-dto';
import { Student } from './entities/students.entity';
import { StudentsRepository } from './students.repository';
@Injectable()
export class StudentsService {
  constructor(private readonly studentsRepository: StudentsRepository) {}

  async getStudents(
    pagination: PaginationOptions = {},
    search?: string,
  ): Promise<{ students: Student[]; total: number }> {
    return this.studentsRepository.getStudents(pagination, search);
  }

  async getStudent(id: string): Promise<Student> {
    const student = await this.studentsRepository.getStudentById(id);
    if (!student) {
      throw new NotFoundException(`Student not found`);
    }

    return student;
  }

  async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentsRepository.createStudent(createStudentDto);
  }

  async updateStudent(id: string, updates: UpdateStudentDto): Promise<Student> {
    return this.studentsRepository.updateStudent(id, updates);
  }

  async deleteStudent(id: string): Promise<void> {
    return this.studentsRepository.deleteStudent(id);
  }
}
