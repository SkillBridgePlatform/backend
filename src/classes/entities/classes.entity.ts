import { Tables, TablesInsert } from 'src/supabase/types';

export type Class = Tables<'classes'>;
export type ClassInsert = TablesInsert<'classes'>;

export type ClassTeacher = Tables<'class_teachers'>;
export type ClassTeacherInsert = TablesInsert<'class_teachers'>;

export type ClassStudent = Tables<'class_students'>;
export type ClassStudentInsert = TablesInsert<'class_students'>;

export interface ClassFilters {
  teacher_id?: string;
  school_id?: string;
}
