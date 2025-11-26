import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import {
  GetStudentCoursesDocs,
  GetStudentLessonsDocs,
  GetStudentProfileDocs,
  StartStudentCourseDocs,
} from 'src/docs/students/students.docs';
import {
  StudentCourse,
  StudentCourseDetails,
} from '../entities/student-course.entity';
import { StudentLessonDetails } from '../entities/student-lesson.entity';
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

  @Get(':studentId/courses')
  @GetStudentCoursesDocs()
  async getStudentCourses(
    @Param('studentId') studentId: string,
  ): Promise<StudentCourse[]> {
    return this.studentsService.getStudentCourses(studentId);
  }

  @Get(':studentId/courses/:courseSlug')
  @GetStudentCoursesDocs()
  async getStudentCourseDetails(
    @Param('studentId') studentId: string,
    @Param('courseSlug') courseSlug: string,
  ): Promise<StudentCourseDetails | null> {
    return this.studentsService.getStudentCourseDetails(studentId, courseSlug);
  }

  @Get(':studentId/lessons/:lessonSlug')
  @GetStudentLessonsDocs()
  async getStudentLessonDetails(
    @Param('studentId') studentId: string,
    @Param('lessonSlug') lessonSlug: string,
  ): Promise<StudentLessonDetails | null> {
    return this.studentsService.getStudentLessonDetails(studentId, lessonSlug);
  }

  @Post(':studentId/courses/:courseId/start')
  @StartStudentCourseDocs()
  async startStudentCourse(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ): Promise<void> {
    return this.studentsService.startStudentCourse(studentId, courseId);
  }
}
