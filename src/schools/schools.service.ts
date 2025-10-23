import { Injectable } from '@nestjs/common';
import { PaginationOptions } from 'src/common/interfaces';
import { CreateSchoolDto } from './dto/create-school-dto';
import { UpdateSchoolDto } from './dto/update-school-dto';
import { School } from './entities/schools.entity';
import { SchoolsRepository } from './schools.repository';

@Injectable()
export class SchoolsService {
  constructor(private readonly schoolsRepository: SchoolsRepository) {}

  async getSchools(
    pagination: PaginationOptions = {},
    search?: string,
  ): Promise<{ schools: School[]; total: number }> {
    return this.schoolsRepository.getSchools(pagination, search);
  }

  async getSchool(id: string): Promise<School | null> {
    return this.schoolsRepository.getSchoolById(id);
  }

  async createSchool(createSchoolDto: CreateSchoolDto): Promise<School> {
    return await this.schoolsRepository.createSchool(createSchoolDto);
  }

  async updateSchool(id: string, updates: UpdateSchoolDto): Promise<School> {
    return await this.schoolsRepository.updateSchool(id, updates);
  }

  async deleteSchool(id: string): Promise<void> {
    await this.schoolsRepository.deleteSchool(id);
  }
}
