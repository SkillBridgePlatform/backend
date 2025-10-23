import { Tables, TablesInsert } from 'src/supabase/types';

export type School = Tables<'schools'>;
export type SchoolInsert = TablesInsert<'schools'>;
