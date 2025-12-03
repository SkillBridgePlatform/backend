import { Injectable } from '@nestjs/common';
import { CourseModulesRepository } from 'src/courses/repositories/course-modules.repository';
import { CoursesRepository } from 'src/courses/repositories/courses.repository';
import { LessonsRepository } from 'src/courses/repositories/lessons.repository';
import {
  ModuleWithLessonSummariesDto,
  StudentCourse,
  StudentCourseDetails,
} from '../entities/student-course.entity';
import { StudentLessonDetails } from '../entities/student-lesson.entity';
import { StudentContentBlockProgressRepository } from '../repositories/student-content-block-progress.repository';
import { StudentCourseProgressRepository } from '../repositories/student-course-progress.repository';
import { StudentLessonProgressRepository } from '../repositories/student-lesson-progress.repository';
import { StudentCoursesRepository } from './../repositories/student-courses.repository';

@Injectable()
export class StudentCoursesService {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly courseModulesRepository: CourseModulesRepository,
    private readonly studentCoursesRepository: StudentCoursesRepository,
    private readonly studentLessonProgressRepository: StudentLessonProgressRepository,
    private readonly studentCourseProgressRepository: StudentCourseProgressRepository,
    private readonly studentContentBlockProgressRepository: StudentContentBlockProgressRepository,
  ) {}

  async getStudentCourses(studentId: string): Promise<StudentCourse[]> {
    const courseIds =
      await this.studentCoursesRepository.getStudentCourseIds(studentId);
    if (!courseIds.length) return [];

    const [courses, studentCourseProgressRecords, moduleCounts] =
      await Promise.all([
        this.coursesRepository.getCoursesByIds(courseIds),
        this.studentCourseProgressRepository.getStudentCourseProgress(
          studentId,
          courseIds,
        ),
        this.courseModulesRepository.getModuleCountsByCourseIds(courseIds),
      ]);

    const progressMap = new Map(
      studentCourseProgressRecords.map((p) => [p.course_id, p]),
    );
    const moduleCountMap = new Map(Object.entries(moduleCounts));

    const studentCourses: StudentCourse[] = courses.map((course) => {
      const moduleCount = moduleCountMap.get(course.id) ?? 0;
      const progress = progressMap.get(course.id);
      const progressPercentage = progress?.progress_percentage ?? 0;

      const status: StudentCourse['status'] = !progress
        ? 'not_started'
        : progress.completed_at
          ? 'completed'
          : progress.started_at
            ? 'in_progress'
            : 'not_started';

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
    const courseHierarchy =
      await this.coursesRepository.getCourseHierarchyBySlug(courseSlug);
    if (!courseHierarchy) return null;

    const { course, modulesWithLessons } = courseHierarchy;

    const lessonIds = modulesWithLessons.flatMap((m) =>
      (m.lessons || []).map((l) => l.id),
    );

    const [courseProgressList, lessonProgressRecords] = await Promise.all([
      this.studentCourseProgressRepository.getStudentCourseProgress(studentId, [
        course.id,
      ]),
      this.studentLessonProgressRepository.getStudentLessonProgress(
        studentId,
        lessonIds,
      ),
    ]);

    const courseProgress = courseProgressList?.[0];
    const progressPercentage = courseProgress?.progress_percentage ?? 0;

    const status: StudentCourse['status'] = !courseProgress
      ? 'not_started'
      : courseProgress.completed_at != null
        ? 'completed'
        : courseProgress.started_at != null
          ? 'in_progress'
          : 'not_started';

    const lessonProgressMap = new Map(
      lessonProgressRecords.map((lp) => [lp.lesson_id, lp]),
    );

    const modulesWithLessonSummaries: ModuleWithLessonSummariesDto[] =
      modulesWithLessons.map((m) => ({
        moduleSummary: {
          id: m.module.id,
          slug: m.module.slug,
          title: m.module.title,
          estimated_duration: m.module.estimated_duration ?? null,
        },
        lessonSummaries: (m.lessons || []).map((lesson) => {
          const progress = lessonProgressMap.get(lesson.id);
          return {
            id: lesson.id,
            slug: lesson.slug,
            title: lesson.title,
            estimated_duration: lesson.estimated_duration ?? null,
            isCompleted: progress?.completed_at != null,
            isStarted: progress?.started_at != null,
          };
        }),
      }));

    const studentCourse: StudentCourse = {
      course,
      moduleCount: modulesWithLessons.length,
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
    const lessonHierarchy =
      await this.lessonsRepository.getLessonHierarchyBySlug(lessonSlug);
    if (!lessonHierarchy) return null;

    const contentBlockIds = (lessonHierarchy.contentBlocks || []).map(
      (cb) => cb.contentBlock.id,
    );

    const [
      lessonProgressArray,
      contentBlockProgress,
      { prevLesson, nextLesson },
    ] = await Promise.all([
      this.studentLessonProgressRepository.getStudentLessonProgress(studentId, [
        lessonHierarchy.lesson.id,
      ]),
      this.studentContentBlockProgressRepository.getStudentContentBlockProgress(
        studentId,
        contentBlockIds,
      ),
      this.lessonsRepository.getPrevNextLessons(
        lessonHierarchy.courseId,
        lessonSlug,
      ),
    ]);

    const lessonProgress = lessonProgressArray?.[0] ?? null;

    return {
      lessonHierarchy,
      lessonProgress,
      contentBlockProgress: contentBlockProgress || [],
      prevLesson,
      nextLesson,
    };
  }
}
