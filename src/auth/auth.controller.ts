import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { StudentLoginDocs } from 'src/docs/students/students.docs';
import { StudentsService } from 'src/students/services/students.service';
import { StudentLoginDto } from '../students/dto/student-login-dto';
import { StudentLoginResponseDto } from '../students/dto/student-login-response-dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @StudentLoginDocs()
  async login(@Body() body: StudentLoginDto): Promise<StudentLoginResponseDto> {
    const student = await this.studentsService.validateStudent(
      body.username,
      body.pin,
    );

    const token = this.jwtService.sign({ studentId: student.id });

    return { access_token: token };
  }
}
