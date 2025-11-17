import { Module } from '@nestjs/common';
import { AdminCourseModulesController } from './controllers/admin-course-modules.controller';
import { AdminCoursesController } from './controllers/admin-courses.controller';
import { AdminLessonsController } from './controllers/admin-lessons.controller';
import { AdminModuleLessonsController } from './controllers/admin-module-lessons.controller';
import { AdminModulesController } from './controllers/admin-modules.controller';
import { CourseModulesRepository } from './repositories/course-modules.repository';
import { CourseSchoolsRepository } from './repositories/course-schools.repository';
import { CoursesRepository } from './repositories/courses.repository';
import { LessonsRepository } from './repositories/lessons.repository';
import { CourseModulesService } from './services/course-modules.service';
import { CoursesService } from './services/courses.service';
import { LessonsService } from './services/lessons.service';

@Module({
  controllers: [
    AdminCoursesController,
    AdminCourseModulesController,
    AdminModulesController,
    AdminModuleLessonsController,
    AdminLessonsController,
  ],
  providers: [
    LessonsService,
    CoursesService,
    CoursesRepository,
    CourseSchoolsRepository,
    LessonsRepository,
    CourseModulesService,
    CourseModulesRepository,
  ],
  exports: [CoursesService, CourseModulesService, LessonsService],
})
export class CoursesModule {}
