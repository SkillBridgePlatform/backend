import { Tables, TablesInsert } from 'src/supabase/types';

export type Course = Tables<'courses'>;
export type SchoolCourse = Tables<'school_courses'>;
export type SchoolCourseInsert = TablesInsert<'school_courses'>;

export enum CourseStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}
