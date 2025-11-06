import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/common/enums';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { Student } from 'src/students/entities/students.entity';
import { User } from 'src/users/entities/user.entity';
import { ClassStudentsRepository } from './class-students.repository';
import { ClassTeachersRepository } from './class-teachers.repository';
import { ClassesRepository } from './classes.repository';
import { CreateClassDto } from './dto/create-class-dto';
import { UpdateClassDto } from './dto/update-class-dto';
import { Class, ClassFilters } from './entities/classes.entity';

@Injectable()
export class ClassesService {
  constructor(
    private readonly classesRepository: ClassesRepository,
    private readonly classTeachersRepository: ClassTeachersRepository,
    private readonly classStudentsRepository: ClassStudentsRepository,
  ) {}

  // Class CRUD

  async getClasses(
    authUser,
    filters: ClassFilters = {},
    pagination: PaginationOptions = {},
    sort: SortOptions = {},
    search?: string,
  ): Promise<{ classes: Class[]; total: number }> {
    if (
      authUser.app_metadata.role === UserRole.SchoolAdmin ||
      authUser.app_metadata.role === UserRole.Teacher
    ) {
      filters.school_id = authUser.school_id;

      if (authUser.app_metadata.role === UserRole.Teacher) {
        filters.teacher_id = authUser.id;
      }
    }

    return this.classesRepository.getClasses(filters, pagination, sort, search);
  }

  async getClass(id: string): Promise<Class | null> {
    return this.classesRepository.getClassById(id);
  }

  async createClass(createClassDto: CreateClassDto): Promise<Class> {
    return await this.classesRepository.createClass(createClassDto);
  }

  async updateClass(id: string, updates: UpdateClassDto): Promise<Class> {
    return await this.classesRepository.updateClass(id, updates);
  }

  async deleteClass(id: string): Promise<void> {
    await this.classesRepository.deleteClass(id);
  }

  // Class Students

  async assignStudentsToClass(
    classId: string,
    studentIds: string[],
  ): Promise<void> {
    return await this.classStudentsRepository.assignStudentsToClass(
      classId,
      studentIds,
    );
  }

  async getStudentsForClass(
    classId: string,
    pagination: PaginationOptions = {},
    sort: SortOptions = {},
    search?: string,
  ): Promise<{ students: Student[]; total: number }> {
    return this.classStudentsRepository.getStudentsForClass(
      classId,
      pagination,
      sort,
      search,
    );
  }

  async getAvailableStudentsForClass(classId: string): Promise<Student[]> {
    return this.classStudentsRepository.getAvailableStudentsForClass(classId);
  }

  async unassignStudentsFromClass(
    classId: string,
    studentIds: string[],
  ): Promise<void> {
    return this.classStudentsRepository.unassignStudentsFromClass(
      classId,
      studentIds,
    );
  }

  // Class Teachers

  async assignTeachersToClass(
    classId: string,
    teacherIds: string[],
  ): Promise<void> {
    return await this.classTeachersRepository.assignTeachersToClass(
      classId,
      teacherIds,
    );
  }

  async getTeachersForClass(
    classId: string,
    pagination: PaginationOptions = {},
    sort: SortOptions = {},
    search?: string,
  ): Promise<{ teachers: User[]; total: number }> {
    return this.classTeachersRepository.getTeachersForClass(
      classId,
      pagination,
      sort,
      search,
    );
  }

  async getAvailableTeachersForClass(
    classId: string,
  ): Promise<Partial<User>[]> {
    return this.classTeachersRepository.getAvailableTeachersForClass(classId);
  }

  async unassignTeachersFromClass(
    classId: string,
    teacherIds: string[],
  ): Promise<void> {
    return this.classTeachersRepository.unassignTeachersFromClass(
      classId,
      teacherIds,
    );
  }

  async getClassesForTeacher(
    teacherId: string,
    pagination: PaginationOptions = {},
    sort: SortOptions = {},
    search?: string,
  ): Promise<{ classes: Class[]; total: number }> {
    return this.classTeachersRepository.getClassesForTeacher(
      teacherId,
      pagination,
      sort,
      search,
    );
  }
}
