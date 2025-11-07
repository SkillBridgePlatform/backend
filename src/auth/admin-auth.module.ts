import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseService } from '../supabase/supabase.service';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'admin-jwt' })],
  providers: [AdminJwtStrategy, SupabaseService],
  exports: [PassportModule, AdminJwtStrategy],
})
export class AdminAuthModule {}
