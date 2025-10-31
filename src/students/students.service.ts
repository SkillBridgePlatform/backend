import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { CreateStudentDto } from './dto/create-student-dto';
import { UpdateStudentDto } from './dto/update-student-dto';
import { Student, StudentFilters } from './entities/students.entity';
import { StudentsRepository } from './students.repository';
@Injectable()
export class StudentsService {
  constructor(private readonly studentsRepository: StudentsRepository) {}

  async getStudents(
    filters: StudentFilters = {},
    pagination: PaginationOptions = {},
    sort: SortOptions = {},
    search?: string,
  ): Promise<{ students: Student[]; total: number }> {
    return this.studentsRepository.getStudents(
      filters,
      pagination,
      sort,
      search,
    );
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

  async resetPin(id: string, pin: string): Promise<void> {
    return this.studentsRepository.resetPin(id, pin);
  }
}
