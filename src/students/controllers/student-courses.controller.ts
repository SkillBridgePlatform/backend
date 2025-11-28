import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
@Controller('students/:studentId')
export class StudentCoursesController {
  constructor(
    private readonly studentCoursesService: StudentCoursesService,
    private readonly studentProgressService: StudentProgressService,
  ) {}

  @Get('/courses')
  @GetStudentCoursesDocs()
  async getStudentCourses(
    @Param('studentId') studentId: string,
  ): Promise<StudentCourse[]> {
    return this.studentCoursesService.getStudentCourses(studentId);
  }

  @Get('/courses/:courseSlug')
  @GetStudentCoursesDocs()
  async getStudentCourseDetails(
    @Param('studentId') studentId: string,
    @Param('courseSlug') courseSlug: string,
  ): Promise<StudentCourseDetails | null> {
    return this.studentCoursesService.getStudentCourseDetails(
      studentId,
      courseSlug,
    );
  }

  @Get('/lessons/:lessonSlug')
  @GetStudentLessonsDocs()
  async getStudentLessonDetails(
    @Param('studentId') studentId: string,
    @Param('lessonSlug') lessonSlug: string,
  ): Promise<StudentLessonDetails | null> {
    return this.studentCoursesService.getStudentLessonDetails(
      studentId,
      lessonSlug,
    );
  }
}
