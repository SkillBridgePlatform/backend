import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetStudentProfileDocs } from 'src/docs/students/students.docs';
import { StudentsService } from '../services/students.service';

@ApiTags('Students')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('me')
  @GetStudentProfileDocs()
  async getProfile(@Req() req: Request) {
    const studentId = req.user!.id;
    return this.studentsService.getProfile(studentId);
  }
}
