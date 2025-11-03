import { Module } from '@nestjs/common';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { StudentsController } from './students.controller';
import { StudentsRepository } from './students.repository';
import { StudentsService } from './students.service';

@Module({
  imports: [SupabaseModule],
  controllers: [StudentsController],
  providers: [StudentsService, StudentsRepository, FileUploadService],
  exports: [StudentsService],
})
export class StudentsModule {}
