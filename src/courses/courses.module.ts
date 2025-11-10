import { Module } from '@nestjs/common';
import { AdminCourseModulesController } from './controllers/admin-course-modules.controller';
import { AdminCoursesController } from './controllers/admin-courses.controller';
import { CourseModulesRepository } from './repositories/course-modules.repository';
import { CoursesRepository } from './repositories/courses.repository';
import { CourseModulesService } from './services/course-modules.service';
import { CoursesService } from './services/courses.service';

@Module({
  controllers: [AdminCoursesController, AdminCourseModulesController],
  providers: [
    CoursesService,
    CoursesRepository,
    CourseModulesService,
    CourseModulesRepository,
  ],
  exports: [CoursesService, CourseModulesService],
})
export class CoursesModule {}
