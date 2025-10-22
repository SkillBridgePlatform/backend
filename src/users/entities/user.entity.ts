import { Tables } from 'src/supabase/types';

export type User = Tables<'users'>;

export interface UserFilters {
  role?: string;
  school_id?: string;
  language?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}
