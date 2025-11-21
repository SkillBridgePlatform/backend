import { Module } from '@nestjs/common';
import { CoursesModule } from 'src/courses/courses.module';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { WistiaFileUploadService } from './wisitia-file-upload.service';

@Module({
  imports: [SupabaseModule, CoursesModule],
  controllers: [FileUploadController],
  providers: [FileUploadService, WistiaFileUploadService],
  exports: [FileUploadService, WistiaFileUploadService],
})
export class FileUploadModule {}
