import { Injectable } from '@nestjs/common';
import { ClassCoursesRepository } from 'src/classes/repositories/class-courses.repository';
import { ClassStudentsRepository } from 'src/classes/repositories/class-students.repository';
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

@Injectable()
export class StudentCoursesService {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly classCoursesRepository: ClassCoursesRepository,
    private readonly classStudentsRepository: ClassStudentsRepository,
    private readonly courseModulesRepository: CourseModulesRepository,
    private readonly studentLessonProgressRepository: StudentLessonProgressRepository,
    private readonly studentCourseProgressRepository: StudentCourseProgressRepository,
    private readonly studentContentBlockProgressRepository: StudentContentBlockProgressRepository,
  ) {}

  async getStudentCourses(studentId: string): Promise<StudentCourse[]> {
    const classIds =
      await this.classStudentsRepository.getStudentClassIdsByStudentId(
        studentId,
      );
    if (!classIds.length) return [];

    const courseIds =
      await this.classCoursesRepository.getCourseIdsByClassIds(classIds);
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

    const studentCourses: StudentCourse[] = courses.map((course) => {
      const moduleCount = moduleCounts[course.id] ?? 0;
      const progress = studentCourseProgressRecords.find(
        (p) => p.course_id === course.id,
      );
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
    const courseHierarchy =
      await this.coursesRepository.getCourseHierarchyBySlug(courseSlug);
    if (!courseHierarchy) return null;

    const { course, modulesWithLessons } = courseHierarchy;

    const sortedModules = (modulesWithLessons || []).sort(
      (a, b) => a.module.order - b.module.order,
    );

    const lessonIds = sortedModules.flatMap((m) =>
      (m.lessons || []).map((lesson) => lesson.id),
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
      : progressPercentage >= 100
        ? 'completed'
        : 'in_progress';

    const modulesWithLessonSummaries: ModuleWithLessonSummariesDto[] =
      sortedModules.map((m) => ({
        moduleSummary: {
          id: m.module.id,
          slug: m.module.slug,
          title: m.module.title,
          estimated_duration: m.module.estimated_duration ?? null,
        },
        lessonSummaries: (m.lessons || [])
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
