import { LessonHierarchy } from 'src/courses/entities/lesson.entity';
import { Tables } from 'src/supabase/types';

export type StudentLessonProgress = Tables<'student_lesson_progress'>;
export type StudentContentBlockProgress =
  Tables<'student_content_block_progress'>;

export interface LessonSummaryDto {
  id: string;
  slug: string;
  title: string;
  estimated_duration?: number | null;
  isCompleted: boolean;
  isStarted: boolean;
}

export interface StudentLessonDetails {
  lessonHierarchy: LessonHierarchy;
  lessonProgress: StudentLessonProgress;
  contentBlockProgress: StudentContentBlockProgress[];
  nextLesson?: { slug: string; title: string };
  prevLesson?: { slug: string; title: string };
}
