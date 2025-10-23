import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { SchoolsController } from './schools.controller';
import { SchoolsRepository } from './schools.repository';
import { SchoolsService } from './schools.service';

@Module({
  imports: [SupabaseModule],
  controllers: [SchoolsController],
  providers: [SchoolsService, SchoolsRepository],
  exports: [SchoolsService],
})
export class SchoolsModule {}
