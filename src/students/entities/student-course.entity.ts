import { Course } from 'src/courses/entities/course.entity';
import { ModuleWithLessons } from 'src/courses/entities/module.entity';
import { Tables } from 'src/supabase/types';

export type CourseProgress = Tables<'course_progress'>;

export interface StudentCourse {
  course: Course;
  moduleCount: number;
  progressPercentage: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface StudentCourseDetails {
  studentCourse: StudentCourse;
  modulesWithLessons: ModuleWithLessons[];
}
