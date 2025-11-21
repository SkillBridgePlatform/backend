import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { getCourseWithModulesAndLessonsBySlugDocs } from 'src/docs/courses/courses.docs';
import { CourseWithModulesAndLessons } from '../entities/course.entity';
import { CoursesService } from '../services/courses.service';

@ApiTags('Courses')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get(':courseSlug')
  @getCourseWithModulesAndLessonsBySlugDocs()
  async getCourseWithModulesAndLessonsBySlug(
    @Param('courseSlug') courseSlug: string,
  ): Promise<CourseWithModulesAndLessons | null> {
    return this.coursesService.getCourseWithModulesAndLessonsBySlug(courseSlug);
  }
}
