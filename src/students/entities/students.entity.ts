import { Tables, TablesInsert } from 'src/supabase/types';

export type Student = Tables<'students'>;
export type StudentInsert = TablesInsert<'students'>;

export interface StudentFilters {
  school_id?: string;
}
