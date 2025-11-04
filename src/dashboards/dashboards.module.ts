import { Module } from '@nestjs/common';
import { ClassesRepository } from 'src/classes/classes.repository';
import { SchoolsRepository } from 'src/schools/schools.repository';
import { StudentsRepository } from 'src/students/students.repository';
import { UsersRepository } from 'src/users/users.repository';
import { DashboardsController } from './dashboards.controller';
import { DashboardsService } from './dashboards.service';

@Module({
  controllers: [DashboardsController],
  providers: [
    DashboardsService,
    StudentsRepository,
    UsersRepository,
    SchoolsRepository,
    ClassesRepository,
  ],
  exports: [DashboardsService],
})
export class DashboardsModule {}
