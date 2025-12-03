import { Injectable } from '@nestjs/common';
import { UpdateContentBlockProgressDto } from '../dto/update-content-block-progress-dto';
import { StudentContentBlockProgressRepository } from '../repositories/student-content-block-progress.repository';
import { StudentCourseProgressRepository } from '../repositories/student-course-progress.repository';
import { StudentLessonProgressRepository } from '../repositories/student-lesson-progress.repository';

@Injectable()
export class StudentProgressService {
  constructor(
    private readonly studentLessonProgressRepository: StudentLessonProgressRepository,
    private readonly studentCourseProgressRepository: StudentCourseProgressRepository,
    private readonly studentContentBlockProgressRepository: StudentContentBlockProgressRepository,
  ) {}

  // Course Progress

  async startStudentCourse(studentId: string, courseId: string): Promise<void> {
    await this.studentCourseProgressRepository.startStudentCourse(
      studentId,
      courseId,
    );
  }

  // Lesson Progress

  async startStudentLesson(studentId: string, lessonId: string) {
    const contentBlockIds: string[] =
      await this.studentLessonProgressRepository.startStudentLesson(
        studentId,
        lessonId,
      );

    const contentBlockProgress =
      await this.studentContentBlockProgressRepository.getContentBlockProgressByContentBlockIds(
        studentId,
        contentBlockIds,
      );

    return contentBlockProgress;
  }

  // Content Block Progress

  async getContentBlockProgressByLesson(studentId: string, lessonId: string) {
    const contentBlockIds =
      await this.studentContentBlockProgressRepository.getContentBlockIdsByLesson(
        lessonId,
      );

    if (contentBlockIds.length === 0) return [];

    const progress =
      await this.studentContentBlockProgressRepository.getContentBlockProgressByContentBlockIds(
        studentId,
        contentBlockIds,
      );

    return progress;
  }

  async updateContentBlockProgress(
    studentId: string,
    lessonId: string,
    courseId: string,
    contentBlockId: string,
    updates: UpdateContentBlockProgressDto,
  ) {
    const completedAt = updates.completed_at ?? undefined;

    await this.studentLessonProgressRepository.updateContentBlockProgress(
      studentId,
      courseId,
      lessonId,
      contentBlockId,
      completedAt,
    );
  }
}
