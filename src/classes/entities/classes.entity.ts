import { Tables, TablesInsert } from 'src/supabase/types';

export type Class = Tables<'classes'>;
export type ClassInsert = TablesInsert<'classes'>;

export interface ClassFilters {
  teacher_id?: string;
  school_id?: string;
}
