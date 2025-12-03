import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import {
  StartStudentCourseDocs,
  StartStudentLessonDocs,
  UpdateContentBlockProgressDocs,
} from 'src/docs/students/students.docs';
import { UpdateContentBlockProgressDto } from '../dto/update-content-block-progress-dto';
import { StudentContentBlockProgress } from '../entities/student-lesson.entity';
import { StudentProgressService } from '../services/student-progress.service';

@ApiTags('Student Progress')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('student/progress')
export class StudentProgressController {
  constructor(
    private readonly studentProgressService: StudentProgressService,
  ) {}

  @Post('/courses/:courseId/start')
  @StartStudentCourseDocs()
  async startStudentCourse(
    @Req() req: Request,
    @Param('courseId') courseId: string,
  ): Promise<void> {
    const studentId = req.user!.id;
    return this.studentProgressService.startStudentCourse(studentId, courseId);
  }

  @Post('/lessons/:lessonId/start')
  @StartStudentLessonDocs()
  async startStudentLesson(
    @Req() req: Request,
    @Param('lessonId') lessonId: string,
  ): Promise<StudentContentBlockProgress[]> {
    const studentId = req.user!.id;
    return this.studentProgressService.startStudentLesson(studentId, lessonId);
  }

  @Post('/courses/:courseId/lessons/:lessonId/blocks/:blockId')
  @UpdateContentBlockProgressDocs()
  async updateContentBlockProgress(
    @Req() req: Request,
    @Param('lessonId') lessonId: string,
    @Param('courseId') courseId: string,
    @Param('blockId') blockId: string,
    @Body() updates: UpdateContentBlockProgressDto,
  ): Promise<void> {
    const studentId = req.user!.id;
    return this.studentProgressService.updateContentBlockProgress(
      studentId,
      lessonId,
      courseId,
      blockId,
      updates,
    );
  }
}
