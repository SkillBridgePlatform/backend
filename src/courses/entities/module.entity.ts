import { Tables } from 'src/supabase/types';
import { Lesson } from './lesson.entity';

export type CourseModule = Tables<'modules'>;

export type ModuleWithLessons = CourseModule & { lessons: Lesson[] };
