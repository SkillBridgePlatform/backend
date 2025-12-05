import { Tables, TablesInsert } from 'src/supabase/types';

export type Quiz = Tables<'quizzes'>;
export type QuizInsert = TablesInsert<'quizzes'>;
