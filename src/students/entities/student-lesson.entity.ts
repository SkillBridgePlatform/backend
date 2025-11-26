import { CourseModule } from 'src/courses/entities/module.entity';
import { Tables } from 'src/supabase/types';

export type StudentLessonProgress = Tables<'student_lesson_progress'>;

export interface LessonSummary {
  id: string;
  title: string;
  estimated_duration?: number | null;
  isCompleted: boolean;
}

export interface ModuleWithLessonSummaries {
  module: CourseModule;
  lessonSummaries: LessonSummary[];
}
