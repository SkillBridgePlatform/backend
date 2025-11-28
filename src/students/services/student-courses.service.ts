import { Injectable, NotFoundException } from '@nestjs/common';
import { ClassCoursesRepository } from 'src/classes/repositories/class-courses.repository';
import { ClassStudentsRepository } from 'src/classes/repositories/class-students.repository';
import { CourseModulesRepository } from 'src/courses/repositories/course-modules.repository';
import { CoursesRepository } from 'src/courses/repositories/courses.repository';
import { LessonsRepository } from 'src/courses/repositories/lessons.repository';
import { UpdateContentBlockProgressDto } from '../dto/update-content-block-progress-dto';
import {
  StudentCourse,
  StudentCourseDetails,
} from '../entities/student-course.entity';
import {
  ModuleWithLessonSummaries,
  StudentLessonDetails,
} from '../entities/student-lesson.entity';
import { StudentCoursesRepository } from '../repositories/student-courses.repository';
import { StudentLessonsRepository } from '../repositories/student-lessons.repository';

@Injectable()
export class StudentCoursesService {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly classCoursesRepository: ClassCoursesRepository,
    private readonly classStudentsRepository: ClassStudentsRepository,
    private readonly courseModulesRepository: CourseModulesRepository,
    private readonly studentCoursesRepository: StudentCoursesRepository,
    private readonly studentLessonsRepository: StudentLessonsRepository,
  ) {}

  async getStudentCourses(studentId: string): Promise<StudentCourse[]> {
    const classIds =
      await this.classStudentsRepository.getStudentClassIds(studentId);
    if (!classIds.length) return [];

    const courseIds =
      await this.classCoursesRepository.getCourseIdsForClasses(classIds);
    if (!courseIds.length) return [];

    const [courses, progressRecords, moduleCounts] = await Promise.all([
      this.coursesRepository.getCoursesByIds(courseIds),
      this.studentCoursesRepository.getCourseProgressForStudent(
        studentId,
        courseIds,
      ),
      this.courseModulesRepository.getModuleCountsByCourseIds(courseIds),
    ]);

    const studentCourses: StudentCourse[] = courses.map((course) => {
      const moduleCount = moduleCounts[course.id] ?? 0;
      const progress = progressRecords.find((p) => p.course_id === course.id);
      const progressPercentage = progress?.progress_percentage ?? 0;

      const status: StudentCourse['status'] = !progress
        ? 'not_started'
        : progressPercentage >= 100
          ? 'completed'
          : 'in_progress';

      return {
        course,
        moduleCount,
        progressPercentage,
        status,
      };
    });

    return studentCourses;
  }

  async getStudentCourseDetails(
    studentId: string,
    courseSlug: string,
  ): Promise<StudentCourseDetails | null> {
    const courseData =
      await this.coursesRepository.getCourseWithModulesAndLessonsBySlug(
        courseSlug,
      );
    if (!courseData) return null;

    // Sort modules and lessons
    const modules = (courseData.modules || []).sort(
      (a, b) => a.order - b.order,
    );

    const lessonIds = modules.flatMap((module) =>
      (module.lessons || []).map((lesson) => lesson.id),
    );

    // Fetch course and lesson progress in parallel
    const [courseProgressList, lessonProgressRecords] = await Promise.all([
      this.studentCoursesRepository.getCourseProgressForStudent(studentId, [
        courseData.id,
      ]),
      this.studentLessonsRepository.getStudentLessonProgress(
        studentId,
        lessonIds,
      ),
    ]);

    const courseProgress = courseProgressList?.[0];
    const progressPercentage = courseProgress?.progress_percentage ?? 0;

    const status: StudentCourse['status'] = !courseProgress
      ? 'not_started'
      : progressPercentage >= 100
        ? 'completed'
        : 'in_progress';

    // Map modules to ModuleWithLessonSummaries
    const modulesWithLessonSummaries: ModuleWithLessonSummaries[] = modules.map(
      (module) => ({
        module,
        lessonSummaries: (module.lessons || [])
          .sort((a, b) => a.order - b.order)
          .map((lesson) => {
            const progress = lessonProgressRecords.find(
              (lp) => lp.lesson_id === lesson.id,
            );

            return {
              id: lesson.id,
              slug: lesson.slug,
              title: lesson.title,
              estimated_duration: lesson.estimated_duration ?? null,
              isCompleted: progress?.completed_at != null,
              isStarted: progress?.started_at != null,
            };
          }),
      }),
    );

    const studentCourse: StudentCourse = {
      course: courseData,
      moduleCount: modules.length,
      progressPercentage,
      status,
    };

    return {
      studentCourse,
      modulesWithLessonSummaries,
    };
  }

  async getStudentLessonDetails(
    studentId: string,
    lessonSlug: string,
  ): Promise<StudentLessonDetails | null> {
    const lesson = await this.lessonsRepository.getLessonBySlug(lessonSlug);
    if (!lesson) return null;

    const contentBlockIds = (lesson.contentBlocks || []).map((cb) => cb.id);

    const [
      lessonProgressArray,
      contentBlockProgress,
      { prevLesson, nextLesson },
    ] = await Promise.all([
      this.studentLessonsRepository.getStudentLessonProgress(studentId, [
        lesson.id,
      ]),
      this.studentLessonsRepository.getStudentContentBlockProgress(
        studentId,
        contentBlockIds,
      ),
      this.lessonsRepository.getPrevNextLessons(
        lesson.courseModule.course.id,
        lesson.slug,
      ),
    ]);

    const lessonProgress = lessonProgressArray?.[0] ?? null;

    return {
      lessonWithBlocks: lesson,
      lessonProgress,
      contentBlockProgress: contentBlockProgress || [],
      prevLesson,
      nextLesson,
    };
  }

  // Student Progress

  async startStudentCourse(studentId: string, courseId: string): Promise<void> {
    await this.studentCoursesRepository.createCourseProgress(
      studentId,
      courseId,
    );

    const lessons = await this.lessonsRepository.getLessonsByCourse(courseId);
    if (!lessons || lessons.length === 0) return;

    const lessonIds = lessons.map((lesson) => lesson.id);

    await this.studentLessonsRepository.createLessonProgressBulk(
      studentId,
      lessonIds,
    );
  }

  async startStudentLesson(
    studentId: string,
    lessonSlug: string,
  ): Promise<void> {
    const lesson = await this.lessonsRepository.getLessonBySlug(lessonSlug);
    if (!lesson) throw new NotFoundException('Lesson not found');

    const contentBlocks = lesson.contentBlocks || [];
    const contentBlockIds = contentBlocks.map((cb) => cb.id);

    await Promise.all([
      this.studentLessonsRepository.updateLessonProgress(studentId, lesson.id, {
        started_at: new Date().toISOString(),
      }),
      contentBlockIds.length > 0
        ? this.studentLessonsRepository.createContentBlockProgressBulk(
            studentId,
            contentBlockIds,
          )
        : Promise.resolve(),
    ]);
  }

  async getContentBlockProgressByLesson(studentId: string, lessonId: string) {
    const contentBlockIds =
      await this.studentLessonsRepository.getContentBlockIdsByLesson(lessonId);

    if (contentBlockIds.length === 0) return [];

    const progress =
      await this.studentLessonsRepository.getContentBlockProgressByContentBlockIds(
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
    await this.studentLessonsRepository.updateContentBlockProgress(
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

      await this.studentLessonsRepository.updateLessonProgress(
        studentId,
        lessonId,
        {
          completed_at: now,
        },
      );

      const lessonProgressRows =
        await this.studentLessonsRepository.getLessonProgressByCourse(
          studentId,
          courseId,
        );

      const totalLessons = lessonProgressRows.length;

      const completedLessons = lessonProgressRows.filter(
        (l) => l.completed_at,
      ).length;

      const progress_percentage =
        totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      await this.studentCoursesRepository.updateCourseProgress(
        studentId,
        courseId,
        {
          progress_percentage,
        },
      );
    }
  }
}
