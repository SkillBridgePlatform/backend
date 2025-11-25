import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClassCoursesRepository } from 'src/classes/repositories/class-courses.repository';
import { ClassStudentsRepository } from 'src/classes/repositories/class-students.repository';
import { CourseModulesRepository } from 'src/courses/repositories/course-modules.repository';
import { CoursesRepository } from 'src/courses/repositories/courses.repository';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { AdminStudentsController } from './controllers/admin-students.controller';
import { StudentsController } from './controllers/students.controller';
import { StudentCoursesRepository } from './repositories/student-courses.repository';
import { StudentsRepository } from './repositories/students.repository';
import { AdminStudentsService } from './services/admin-students.service';
import { StudentsService } from './services/students.service';

@Module({
  imports: [SupabaseModule],
  controllers: [AdminStudentsController, StudentsController],
  providers: [
    StudentsService,
    AdminStudentsService,
    FileUploadService,
    JwtService,
    CoursesRepository,
    StudentsRepository,
    ClassStudentsRepository,
    ClassCoursesRepository,
    CourseModulesRepository,
    StudentCoursesRepository,
  ],
  exports: [AdminStudentsService, StudentsService],
})
export class StudentsModule {}
