import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClassCoursesRepository } from 'src/classes/repositories/class-courses.repository';
import { ClassStudentsRepository } from 'src/classes/repositories/class-students.repository';
import { CourseModulesRepository } from 'src/courses/repositories/course-modules.repository';
import { CoursesRepository } from 'src/courses/repositories/courses.repository';
import {
  StudentCourse,
  StudentCourseDetails,
} from '../entities/student-course.entity';
import { ModuleWithLessonSummaries } from '../entities/student-lesson.entity';
import { Student } from '../entities/students.entity';
import { StudentCoursesRepository } from '../repositories/student-courses.repository';
import { StudentLessonsRepository } from '../repositories/student-lessons.repository';
import { StudentsRepository } from '../repositories/students.repository';

@Injectable()
export class StudentsService {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly classCoursesRepository: ClassCoursesRepository,
    private readonly classStudentsRepository: ClassStudentsRepository,
    private readonly courseModulesRepository: CourseModulesRepository,
    private readonly studentCoursesRepository: StudentCoursesRepository,
    private readonly studentLessonsRepository: StudentLessonsRepository,
  ) {}

  async validateStudent(username: string, pin: string): Promise<Student> {
    const student =
      await this.studentsRepository.getStudentByUsername(username);
    if (!student || student.pin !== pin) {
      throw new UnauthorizedException('Invalid username or pin');
    }
    return student;
  }

  async getProfile(studentId: string): Promise<Student> {
    const student = await this.studentsRepository.getStudentById(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const safeStudent = { ...student };
    delete (safeStudent as any).pin;
    return safeStudent as Student;
  }

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
              title: lesson.title,
              estimated_duration: lesson.estimated_duration ?? null,
              isCompleted: progress?.completed_at != null,
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

  async startStudentCourse(studentId: string, courseId: string): Promise<void> {
    await this.studentCoursesRepository.createCourseProgress(
      studentId,
      courseId,
    );
  }
}
