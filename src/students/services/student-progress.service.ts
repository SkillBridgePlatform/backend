import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonsRepository } from 'src/courses/repositories/lessons.repository';
import { UpdateContentBlockProgressDto } from '../dto/update-content-block-progress-dto';
import { StudentContentBlockProgressRepository } from '../repositories/student-content-block-progress.repository';
import { StudentCourseProgressRepository } from '../repositories/student-course-progress.repository';
import { StudentLessonProgressRepository } from '../repositories/student-lesson-progress.repository';

@Injectable()
export class StudentProgressService {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly studentLessonProgressRepository: StudentLessonProgressRepository,
    private readonly studentCourseProgressRepository: StudentCourseProgressRepository,
    private readonly studentContentBlockProgressRepository: StudentContentBlockProgressRepository,
  ) {}

  // Course Progress

  async startStudentCourse(studentId: string, courseId: string): Promise<void> {
    await this.studentCourseProgressRepository.createStudentCourseProgress(
      studentId,
      courseId,
    );

    const lessons = await this.lessonsRepository.getLessonsByCourse(courseId);
    if (!lessons || lessons.length === 0) return;

    const lessonIds = lessons.map((lesson) => lesson.id);

    await this.studentLessonProgressRepository.createLessonProgressBulk(
      studentId,
      lessonIds,
    );
  }

  // Lesson Progress

  async startStudentLesson(
    studentId: string,
    lessonSlug: string,
  ): Promise<void> {
    const lessonHierarchy =
      await this.lessonsRepository.getLessonHierarchyBySlug(lessonSlug);
    if (!lessonHierarchy) throw new NotFoundException('Lesson not found');
    const contentBlocks = lessonHierarchy.contentBlocks || [];
    const contentBlockIds = contentBlocks.map((cb) => cb.contentBlock.id);
    await Promise.all([
      this.studentLessonProgressRepository.updateLessonProgress(
        studentId,
        lessonHierarchy.lesson.id,
        {
          started_at: new Date().toISOString(),
        },
      ),
      contentBlockIds.length > 0
        ? this.studentContentBlockProgressRepository.createContentBlockProgressBulk(
            studentId,
            contentBlockIds,
          )
        : Promise.resolve(),
    ]);
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
    await this.studentContentBlockProgressRepository.updateContentBlockProgress(
      studentId,
      contentBlockId,
      updates,
    );

    if (!updates.completed_at) return;

    const contentBlockProgress = await this.getContentBlockProgressByLesson(
      studentId,
      lessonId,
    );

    const allCompleted = contentBlockProgress.every(
      (b) => b.completed_at !== null,
    );

    if (allCompleted) {
      const now = new Date().toISOString();

      await this.studentLessonProgressRepository.updateLessonProgress(
        studentId,
        lessonId,
        {
          completed_at: now,
        },
      );

      const lessonProgressRows =
        await this.studentLessonProgressRepository.getLessonProgressByCourse(
          studentId,
          courseId,
        );

      const totalLessons = lessonProgressRows.length;

      const completedLessons = lessonProgressRows.filter(
        (l) => l.completed_at,
      ).length;

      const progress_percentage =
        totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      await this.studentCourseProgressRepository.updateCourseProgress(
        studentId,
        courseId,
        {
          progress_percentage,
          completed_at: progress_percentage == 100.0 ? now : null,
          status: progress_percentage == 100.0 ? 'completed' : 'in_progress',
        },
      );
    }
  }
}
