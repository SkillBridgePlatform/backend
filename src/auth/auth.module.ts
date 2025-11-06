import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseService } from '../supabase/supabase.service';
import { AdminJwtStrategy } from './admin-jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AdminJwtStrategy, SupabaseService],
  exports: [PassportModule, AdminJwtStrategy],
})
export class AuthModule {}
