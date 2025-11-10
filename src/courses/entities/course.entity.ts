import { Tables } from 'src/supabase/types';

export type Course = Tables<'courses'>;

export enum CourseStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}
