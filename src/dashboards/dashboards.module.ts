import { Module } from '@nestjs/common';
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
  ],
  exports: [DashboardsService],
})
export class DashboardsModule {}
