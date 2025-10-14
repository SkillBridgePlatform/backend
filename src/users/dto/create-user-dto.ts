export class CreateUserDto {
  challenging_subjects?: string[] | null;
  created_at?: string;
  date_of_birth?: string | null;
  email: string;
  password: string;
  first_name: string;
  gender?: string | null;
  grade_level?: string | null;
  hobbies?: string[] | null;
  id?: string;
  interest_level?: string | null;
  language_preferences?: string[] | null;
  last_name: string;
  preferred_learning_methods?: string[] | null;
  school_name?: string | null;
  seen_dashboard_tour?: boolean | null;
  subjects_of_interest?: string[] | null;
  updated_at?: string;
}
