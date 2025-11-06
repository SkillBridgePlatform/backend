// src/auth/admin-jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(private readonly supabaseService: SupabaseService) {
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) throw new Error('SUPABASE_JWT_SECRET is not defined');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(payload: any) {
    const token = payload?.token;
    if (!token) throw new UnauthorizedException('Token not provided');

    const {
      data: { user },
      error,
    } = await this.supabaseService.client.auth.getUser(token);

    if (error || !user)
      throw new UnauthorizedException('Invalid or expired token');

    return user;
  }
}
