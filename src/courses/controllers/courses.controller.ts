import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CoursesService } from '../services/courses.service';

@ApiTags('Courses')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
}
