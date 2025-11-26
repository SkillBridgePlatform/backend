import { Course } from 'src/courses/entities/course.entity';
import { Tables } from 'src/supabase/types';
import { ModuleWithLessonSummaries } from './student-lesson.entity';

export type CourseProgress = Tables<'course_progress'>;

export interface StudentCourse {
  course: Course;
  moduleCount: number;
  progressPercentage: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface StudentCourseDetails {
  studentCourse: StudentCourse;
  modulesWithLessonSummaries: ModuleWithLessonSummaries[];
}
