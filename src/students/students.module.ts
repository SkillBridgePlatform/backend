import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CourseModulesRepository } from 'src/courses/repositories/course-modules.repository';
import { CoursesRepository } from 'src/courses/repositories/courses.repository';
import { LessonsRepository } from 'src/courses/repositories/lessons.repository';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { AdminStudentsController } from './controllers/admin-students.controller';
import { StudentCoursesController } from './controllers/student-courses.controller';
import { StudentProgressController } from './controllers/student-progress.controller';
import { StudentsController } from './controllers/students.controller';
import { StudentContentBlockProgressRepository } from './repositories/student-content-block-progress.repository';
import { StudentCourseProgressRepository } from './repositories/student-course-progress.repository';
import { StudentCoursesRepository } from './repositories/student-courses.repository';
import { StudentLessonProgressRepository } from './repositories/student-lesson-progress.repository';
import { StudentsRepository } from './repositories/students.repository';
import { AdminStudentsService } from './services/admin-students.service';
import { StudentCoursesService } from './services/student-courses.service';
import { StudentProgressService } from './services/student-progress.service';
import { StudentsService } from './services/students.service';

@Module({
  imports: [SupabaseModule],
  controllers: [
    AdminStudentsController,
    StudentsController,
    StudentCoursesController,
    StudentProgressController,
  ],
  providers: [
    StudentsService,
    StudentCoursesService,
    StudentProgressService,
    AdminStudentsService,

    FileUploadService,
    JwtService,

    CoursesRepository,
    LessonsRepository,
    StudentsRepository,
    StudentCoursesRepository,
    CourseModulesRepository,
    StudentLessonProgressRepository,
    StudentCourseProgressRepository,
    StudentContentBlockProgressRepository,
  ],
  exports: [AdminStudentsService, StudentsService],
})
export class StudentsModule {}
