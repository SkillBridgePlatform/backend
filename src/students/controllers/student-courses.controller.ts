import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import {
  GetStudentCoursesDocs,
  GetStudentLessonsDocs,
} from 'src/docs/students/students.docs';
import {
  StudentCourse,
  StudentCourseDetails,
} from '../entities/student-course.entity';
import { StudentLessonDetails } from '../entities/student-lesson.entity';
import { StudentCoursesService } from '../services/student-courses.service';
import { StudentProgressService } from '../services/student-progress.service';

@ApiTags('Student Courses')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('student')
export class StudentCoursesController {
  constructor(
    private readonly studentCoursesService: StudentCoursesService,
    private readonly studentProgressService: StudentProgressService,
  ) {}

  @Get('/courses')
  @GetStudentCoursesDocs()
  async getStudentCourses(@Req() req: Request): Promise<StudentCourse[]> {
    const studentId = req.user!.id;
    return this.studentCoursesService.getStudentCourses(studentId);
  }

  @Get('/courses/:courseSlug')
  @GetStudentCoursesDocs()
  async getStudentCourseDetails(
    @Req() req: Request,
    @Param('courseSlug') courseSlug: string,
  ): Promise<StudentCourseDetails | null> {
    const studentId = req.user!.id;
    return this.studentCoursesService.getStudentCourseDetails(
      studentId,
      courseSlug,
    );
  }

  @Get('/lessons/:lessonSlug')
  @GetStudentLessonsDocs()
  async getStudentLessonDetails(
    @Req() req: Request,
    @Param('lessonSlug') lessonSlug: string,
  ): Promise<StudentLessonDetails | null> {
    const studentId = req.user!.id;
    return this.studentCoursesService.getStudentLessonDetails(
      studentId,
      lessonSlug,
    );
  }
}
