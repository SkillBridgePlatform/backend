import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { AdminStudentsController } from './admin-students.controller';
import { StudentsController } from './students.controller';
import { StudentsRepository } from './students.repository';
import { StudentsService } from './students.service';

@Module({
  imports: [SupabaseModule],
  controllers: [AdminStudentsController, StudentsController],
  providers: [
    StudentsService,
    StudentsRepository,
    FileUploadService,
    JwtService,
  ],
  exports: [StudentsService],
})
export class StudentsModule {}
