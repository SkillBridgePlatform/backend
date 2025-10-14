export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      courses: {
        Row: {
          created_at: string;
          description: string | null;
          description_ar: string | null;
          description_fr: string | null;
          id: string;
          slug: string;
          title: string;
          title_ar: string | null;
          title_fr: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          description_ar?: string | null;
          description_fr?: string | null;
          id?: string;
          slug: string;
          title: string;
          title_ar?: string | null;
          title_fr?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          description_ar?: string | null;
          description_fr?: string | null;
          id?: string;
          slug?: string;
          title?: string;
          title_ar?: string | null;
          title_fr?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      module_questions: {
        Row: {
          correct_answer: string;
          created_at: string;
          id: string;
          module_id: string;
          option_a: string;
          option_a_ar: string | null;
          option_a_fr: string | null;
          option_b: string;
          option_b_ar: string | null;
          option_b_fr: string | null;
          option_c: string;
          option_c_ar: string | null;
          option_c_fr: string | null;
          option_d: string;
          option_d_ar: string | null;
          option_d_fr: string | null;
          order_index: number;
          question: string;
          question_ar: string | null;
          question_fr: string | null;
        };
        Insert: {
          correct_answer: string;
          created_at?: string;
          id?: string;
          module_id: string;
          option_a: string;
          option_a_ar?: string | null;
          option_a_fr?: string | null;
          option_b: string;
          option_b_ar?: string | null;
          option_b_fr?: string | null;
          option_c: string;
          option_c_ar?: string | null;
          option_c_fr?: string | null;
          option_d: string;
          option_d_ar?: string | null;
          option_d_fr?: string | null;
          order_index: number;
          question: string;
          question_ar?: string | null;
          question_fr?: string | null;
        };
        Update: {
          correct_answer?: string;
          created_at?: string;
          id?: string;
          module_id?: string;
          option_a?: string;
          option_a_ar?: string | null;
          option_a_fr?: string | null;
          option_b?: string;
          option_b_ar?: string | null;
          option_b_fr?: string | null;
          option_c?: string;
          option_c_ar?: string | null;
          option_c_fr?: string | null;
          option_d?: string;
          option_d_ar?: string | null;
          option_d_fr?: string | null;
          order_index?: number;
          question?: string;
          question_ar?: string | null;
          question_fr?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'module_questions_module_id_fkey';
            columns: ['module_id'];
            isOneToOne: false;
            referencedRelation: 'modules';
            referencedColumns: ['id'];
          },
        ];
      };
      modules: {
        Row: {
          content: string | null;
          content_ar: string | null;
          content_fr: string | null;
          course_id: string;
          created_at: string;
          description: string | null;
          description_ar: string | null;
          description_fr: string | null;
          id: string;
          order_index: number;
          title: string;
          title_ar: string | null;
          title_fr: string | null;
          transcript: string | null;
          transcript_ar: string | null;
          transcript_fr: string | null;
          transcript_generated: boolean | null;
          updated_at: string;
          video_url: string | null;
          video_url_ar: string | null;
          video_url_fr: string | null;
        };
        Insert: {
          content?: string | null;
          content_ar?: string | null;
          content_fr?: string | null;
          course_id: string;
          created_at?: string;
          description?: string | null;
          description_ar?: string | null;
          description_fr?: string | null;
          id?: string;
          order_index?: number;
          title: string;
          title_ar?: string | null;
          title_fr?: string | null;
          transcript?: string | null;
          transcript_ar?: string | null;
          transcript_fr?: string | null;
          transcript_generated?: boolean | null;
          updated_at?: string;
          video_url?: string | null;
          video_url_ar?: string | null;
          video_url_fr?: string | null;
        };
        Update: {
          content?: string | null;
          content_ar?: string | null;
          content_fr?: string | null;
          course_id?: string;
          created_at?: string;
          description?: string | null;
          description_ar?: string | null;
          description_fr?: string | null;
          id?: string;
          order_index?: number;
          title?: string;
          title_ar?: string | null;
          title_fr?: string | null;
          transcript?: string | null;
          transcript_ar?: string | null;
          transcript_fr?: string | null;
          transcript_generated?: boolean | null;
          updated_at?: string;
          video_url?: string | null;
          video_url_ar?: string | null;
          video_url_fr?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'modules_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
        ];
      };
      resources: {
        Row: {
          course_id: string;
          created_at: string;
          description: string | null;
          description_ar: string | null;
          description_fr: string | null;
          id: string;
          order_index: number;
          title: string;
          title_ar: string | null;
          title_fr: string | null;
          type: string;
          url: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          description?: string | null;
          description_ar?: string | null;
          description_fr?: string | null;
          id?: string;
          order_index?: number;
          title: string;
          title_ar?: string | null;
          title_fr?: string | null;
          type?: string;
          url: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          description?: string | null;
          description_ar?: string | null;
          description_fr?: string | null;
          id?: string;
          order_index?: number;
          title?: string;
          title_ar?: string | null;
          title_fr?: string | null;
          type?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'resources_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
        ];
      };
      user_progress: {
        Row: {
          completed: boolean;
          completed_at: string | null;
          course_id: string;
          created_at: string;
          id: string;
          module_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed?: boolean;
          completed_at?: string | null;
          course_id: string;
          created_at?: string;
          id?: string;
          module_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          course_id?: string;
          created_at?: string;
          id?: string;
          module_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_progress_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_progress_module_id_fkey';
            columns: ['module_id'];
            isOneToOne: false;
            referencedRelation: 'modules';
            referencedColumns: ['id'];
          },
        ];
      };
      user_quiz_attempts: {
        Row: {
          answers: Json;
          attempted_at: string;
          id: string;
          module_id: string;
          passed: boolean;
          score: number;
          user_id: string;
        };
        Insert: {
          answers: Json;
          attempted_at?: string;
          id?: string;
          module_id: string;
          passed: boolean;
          score: number;
          user_id: string;
        };
        Update: {
          answers?: Json;
          attempted_at?: string;
          id?: string;
          module_id?: string;
          passed?: boolean;
          score?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_quiz_attempts_module_id_fkey';
            columns: ['module_id'];
            isOneToOne: false;
            referencedRelation: 'modules';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          challenging_subjects: string[] | null;
          created_at: string;
          date_of_birth: string | null;
          email: string;
          first_name: string;
          gender: string | null;
          grade_level: string | null;
          hobbies: string[] | null;
          id: string;
          interest_level: string | null;
          language_preferences: string[] | null;
          last_name: string;
          preferred_learning_methods: string[] | null;
          school_name: string | null;
          seen_dashboard_tour: boolean | null;
          subjects_of_interest: string[] | null;
          updated_at: string;
        };
        Insert: {
          challenging_subjects?: string[] | null;
          created_at?: string;
          date_of_birth?: string | null;
          email: string;
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
        };
        Update: {
          challenging_subjects?: string[] | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string;
          first_name?: string;
          gender?: string | null;
          grade_level?: string | null;
          hobbies?: string[] | null;
          id?: string;
          interest_level?: string | null;
          language_preferences?: string[] | null;
          last_name?: string;
          preferred_learning_methods?: string[] | null;
          school_name?: string | null;
          seen_dashboard_tour?: boolean | null;
          subjects_of_interest?: string[] | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_course_progress: {
        Args: { course_uuid: string; user_uuid: string };
        Returns: {
          completed_modules: number;
          is_completed: boolean;
          progress_percentage: number;
          total_modules: number;
        }[];
      };
      get_module_questions: {
        Args: { p_module_id: string };
        Returns: {
          created_at: string;
          id: string;
          module_id: string;
          option_a: string;
          option_a_ar: string;
          option_a_fr: string;
          option_b: string;
          option_b_ar: string;
          option_b_fr: string;
          option_c: string;
          option_c_ar: string;
          option_c_fr: string;
          option_d: string;
          option_d_ar: string;
          option_d_fr: string;
          order_index: number;
          question: string;
          question_ar: string;
          question_fr: string;
        }[];
      };
      validate_quiz_answers: {
        Args: { p_answers: Json; p_module_id: string };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
