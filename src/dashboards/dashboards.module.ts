import { Module } from '@nestjs/common';
import { ClassesRepository } from 'src/classes/repositories/classes.repository';
import { CourseModulesRepository } from 'src/courses/repositories/course-modules.repository';
import { CoursesRepository } from 'src/courses/repositories/courses.repository';
import { LessonsRepository } from 'src/courses/repositories/lessons.repository';
import { SchoolsRepository } from 'src/schools/schools.repository';
import { StudentContentBlockProgressRepository } from 'src/students/repositories/student-content-block-progress.repository';
import { StudentCourseProgressRepository } from 'src/students/repositories/student-course-progress.repository';
import { StudentCoursesRepository } from 'src/students/repositories/student-courses.repository';
import { StudentLessonProgressRepository } from 'src/students/repositories/student-lesson-progress.repository';
import { StudentsRepository } from 'src/students/repositories/students.repository';
import { StudentCoursesService } from 'src/students/services/student-courses.service';
import { UsersRepository } from 'src/users/users.repository';
import { AdminDashboardsController } from './admin-dashboards.controller';
import { DashboardsController } from './dashboards.controller';
import { DashboardsService } from './dashboards.service';

@Module({
  controllers: [AdminDashboardsController, DashboardsController],
  providers: [
    StudentCoursesService,
    LessonsRepository,
    CoursesRepository,
    CourseModulesRepository,
    StudentCoursesRepository,
    StudentLessonProgressRepository,
    StudentCourseProgressRepository,
    StudentContentBlockProgressRepository,

    DashboardsService,
    StudentsRepository,
    UsersRepository,
    SchoolsRepository,
    ClassesRepository,
  ],
  exports: [DashboardsService],
})
export class DashboardsModule {}
