import { Module } from '@nestjs/common';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { AdminClassesController } from './admin-classes.controller';
import { ClassesService } from './classes.service';
import { ClassCoursesRepository } from './repositories/class-courses.repository';
import { ClassStudentsRepository } from './repositories/class-students.repository';
import { ClassTeachersRepository } from './repositories/class-teachers.repository';
import { ClassesRepository } from './repositories/classes.repository';

@Module({
  imports: [SupabaseModule],
  controllers: [AdminClassesController],
  providers: [
    ClassesService,
    ClassesRepository,
    ClassTeachersRepository,
    ClassStudentsRepository,
    ClassCoursesRepository,
  ],
  exports: [ClassesService],
})
export class ClassesModule {}
