import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import {
  GetStudentCoursesDocs,
  GetStudentLessonsDocs,
  StartStudentCourseDocs,
  StartStudentLessonDocs,
  UpdateContentBlockProgressDocs,
} from 'src/docs/students/students.docs';
import { UpdateContentBlockProgressDto } from '../dto/update-content-block-progress-dto';
import {
  StudentCourse,
  StudentCourseDetails,
} from '../entities/student-course.entity';
import { StudentLessonDetails } from '../entities/student-lesson.entity';
import { StudentCoursesService } from '../services/student-courses.service';

@ApiTags('Student Courses')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentCoursesController {
  constructor(private readonly studentCoursesService: StudentCoursesService) {}

  @Get(':studentId/courses')
  @GetStudentCoursesDocs()
  async getStudentCourses(
    @Param('studentId') studentId: string,
  ): Promise<StudentCourse[]> {
    return this.studentCoursesService.getStudentCourses(studentId);
  }

  @Get(':studentId/courses/:courseSlug')
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

  @Get(':studentId/lessons/:lessonSlug')
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

  @Post(':studentId/courses/:courseId/start')
  @StartStudentCourseDocs()
  async startStudentCourse(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ): Promise<void> {
    return this.studentCoursesService.startStudentCourse(studentId, courseId);
  }

  @Post(':studentId/lessons/:lessonSlug/start')
  @StartStudentLessonDocs()
  async startStudentLesson(
    @Param('studentId') studentId: string,
    @Param('lessonSlug') lessonSlug: string,
  ): Promise<void> {
    return this.studentCoursesService.startStudentLesson(studentId, lessonSlug);
  }

  @Post(
    ':studentId/courses/:courseId/lessons/:lessonId/blocks/:blockId/progress',
  )
  @UpdateContentBlockProgressDocs()
  async updateContentBlockProgress(
    @Param('studentId') studentId: string,
    @Param('lessonId') lessonId: string,
    @Param('courseId') courseId: string,
    @Param('blockId') blockId: string,
    @Body() updates: UpdateContentBlockProgressDto,
  ): Promise<void> {
    return this.studentCoursesService.updateContentBlockProgress(
      studentId,
      lessonId,
      courseId,
      blockId,
      updates,
    );
  }
}
