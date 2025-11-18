import { Tables, TablesInsert } from 'src/supabase/types';
import { ModuleWithLessons } from './module.entity';

export type Course = Tables<'courses'>;
export type SchoolCourse = Tables<'school_courses'>;
export type SchoolCourseInsert = TablesInsert<'school_courses'>;

export type CourseWithModulesAndLessons = Course & {
  modules: ModuleWithLessons[];
};

export enum CourseStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}
