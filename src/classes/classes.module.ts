import { Module } from '@nestjs/common';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { ClassesController } from './classes.controller';
import { ClassesRepository } from './classes.repository';
import { ClassesService } from './classes.service';

@Module({
  imports: [SupabaseModule],
  controllers: [ClassesController],
  providers: [ClassesService, ClassesRepository],
  exports: [ClassesService],
})
export class ClassesModule {}
