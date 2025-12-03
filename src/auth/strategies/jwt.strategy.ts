// src/students/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminStudentsService } from 'src/students/services/admin-students.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly adminStudentsService: AdminStudentsService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const studentId = payload.studentId;
    if (!studentId) throw new UnauthorizedException('Invalid token');

    const student = await this.adminStudentsService.getStudentById(studentId);
    if (!student) throw new UnauthorizedException('Invalid or expired token');

    return student;
  }
}
