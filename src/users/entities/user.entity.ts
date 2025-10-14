export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender?: string | null;
  date_of_birth?: string | null;
  grade_level?: string | null;
  hobbies?: string[] | null;
  interest_level?: string | null;
  language_preferences?: string[] | null;
  preferred_learning_methods?: string[] | null;
  school_name?: string | null;
  challenging_subjects?: string[] | null;
  subjects_of_interest?: string[] | null;
  seen_dashboard_tour?: boolean | null;
  created_at: string;
  updated_at: string;
};
