import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [SupabaseModule, UsersModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
