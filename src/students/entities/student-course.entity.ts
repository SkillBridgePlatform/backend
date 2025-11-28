import { Course } from 'src/courses/entities/course.entity';
import { Tables } from 'src/supabase/types';
import { LessonSummaryDto } from './student-lesson.entity';

export type StudentCourseProgress = Tables<'student_course_progress'>;

export interface StudentCourse {
  course: Course;
  moduleCount: number;
  progressPercentage: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface ModuleSummaryDto {
  id: string;
  slug: string;
  title: string;
  estimated_duration?: number | null;
}

export interface ModuleWithLessonSummariesDto {
  moduleSummary: ModuleSummaryDto;
  lessonSummaries: LessonSummaryDto[];
}

export interface StudentCourseDetails {
  studentCourse: StudentCourse;
  modulesWithLessonSummaries: ModuleWithLessonSummariesDto[];
}
