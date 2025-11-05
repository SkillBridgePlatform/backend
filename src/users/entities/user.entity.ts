import { UserLanguage, UserRole } from 'src/common/enums';
import { School } from 'src/schools/entities/schools.entity';
import { Tables } from 'src/supabase/types';

export type User = Tables<'users'>;

export interface UserFilters {
  role?: UserRole;
  school_id?: string;
  language?: UserLanguage;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export type UserInfo = {
  profile: User;
  school: School | null;
};
