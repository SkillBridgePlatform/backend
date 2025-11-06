import { Module } from '@nestjs/common';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { AdminStudentsController } from './admin-students.controller';
import { StudentsRepository } from './students.repository';
import { StudentsService } from './students.service';

@Module({
  imports: [SupabaseModule],
  controllers: [AdminStudentsController],
  providers: [StudentsService, StudentsRepository, FileUploadService],
  exports: [StudentsService],
})
export class StudentsModule {}
