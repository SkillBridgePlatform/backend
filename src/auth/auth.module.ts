import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseService } from '../supabase/supabase.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, SupabaseService],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
