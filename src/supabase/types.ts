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
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
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
  public: {
    Tables: {
      class_courses: {
        Row: {
          class_id: string;
          course_id: string;
        };
        Insert: {
          class_id: string;
          course_id: string;
        };
        Update: {
          class_id?: string;
          course_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'class_courses_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'class_courses_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
        ];
      };
      class_students: {
        Row: {
          class_id: string;
          student_id: string;
        };
        Insert: {
          class_id: string;
          student_id: string;
        };
        Update: {
          class_id?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'class_students_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'class_students_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
        ];
      };
      class_teachers: {
        Row: {
          class_id: string;
          teacher_id: string;
        };
        Insert: {
          class_id: string;
          teacher_id: string;
        };
        Update: {
          class_id?: string;
          teacher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'class_teachers_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'class_teachers_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      classes: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          school_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          school_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          school_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'classes_school_id_fkey';
            columns: ['school_id'];
            isOneToOne: false;
            referencedRelation: 'schools';
            referencedColumns: ['id'];
          },
        ];
      };
      content_blocks: {
        Row: {
          created_at: string | null;
          id: string;
          lesson_id: string;
          order: number;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          lesson_id: string;
          order: number;
          type: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          lesson_id?: string;
          order?: number;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'content_blocks_lesson_id_fkey';
            columns: ['lesson_id'];
            isOneToOne: false;
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          },
        ];
      };
      courses: {
        Row: {
          created_at: string | null;
          description: string | null;
          estimated_duration: number | null;
          id: string;
          language: Database['public']['Enums']['user_language'];
          slug: string;
          status: string;
          tags: string[] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          estimated_duration?: number | null;
          id?: string;
          language?: Database['public']['Enums']['user_language'];
          slug: string;
          status?: string;
          tags?: string[] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          estimated_duration?: number | null;
          id?: string;
          language?: Database['public']['Enums']['user_language'];
          slug?: string;
          status?: string;
          tags?: string[] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          created_at: string | null;
          estimated_duration: number | null;
          id: string;
          module_id: string;
          order: number;
          slug: string;
          summary: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          estimated_duration?: number | null;
          id?: string;
          module_id: string;
          order: number;
          slug: string;
          summary?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          estimated_duration?: number | null;
          id?: string;
          module_id?: string;
          order?: number;
          slug?: string;
          summary?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'lessons_module_id_fkey';
            columns: ['module_id'];
            isOneToOne: false;
            referencedRelation: 'modules';
            referencedColumns: ['id'];
          },
        ];
      };
      modules: {
        Row: {
          course_id: string;
          created_at: string | null;
          description: string | null;
          estimated_duration: number | null;
          id: string;
          order: number;
          slug: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          course_id: string;
          created_at?: string | null;
          description?: string | null;
          estimated_duration?: number | null;
          id?: string;
          order: number;
          slug: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          course_id?: string;
          created_at?: string | null;
          description?: string | null;
          estimated_duration?: number | null;
          id?: string;
          order?: number;
          slug?: string;
          title?: string;
          updated_at?: string | null;
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
      school_courses: {
        Row: {
          course_id: string;
          created_at: string;
          id: string;
          school_id: string;
          updated_at: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          id?: string;
          school_id: string;
          updated_at?: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          id?: string;
          school_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'school_courses_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'school_courses_school_id_fkey';
            columns: ['school_id'];
            isOneToOne: false;
            referencedRelation: 'schools';
            referencedColumns: ['id'];
          },
        ];
      };
      schools: {
        Row: {
          address: string | null;
          created_at: string | null;
          id: string;
          language: Database['public']['Enums']['user_language'];
          name: string;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string | null;
          id?: string;
          language?: Database['public']['Enums']['user_language'];
          name: string;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string | null;
          id?: string;
          language?: Database['public']['Enums']['user_language'];
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      student_content_block_progress: {
        Row: {
          completed_at: string | null;
          content_block_id: string;
          created_at: string;
          id: string;
          last_video_position: number | null;
          started_at: string | null;
          student_id: string;
          updated_at: string;
        };
        Insert: {
          completed_at?: string | null;
          content_block_id: string;
          created_at?: string;
          id?: string;
          last_video_position?: number | null;
          started_at?: string | null;
          student_id: string;
          updated_at?: string;
        };
        Update: {
          completed_at?: string | null;
          content_block_id?: string;
          created_at?: string;
          id?: string;
          last_video_position?: number | null;
          started_at?: string | null;
          student_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'student_content_block_progress_block_fkey';
            columns: ['content_block_id'];
            isOneToOne: false;
            referencedRelation: 'content_blocks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_content_block_progress_student_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
        ];
      };
      student_course_progress: {
        Row: {
          completed_at: string | null;
          course_id: string;
          created_at: string;
          id: string;
          progress_percentage: number;
          started_at: string | null;
          student_id: string;
          updated_at: string;
        };
        Insert: {
          completed_at?: string | null;
          course_id: string;
          created_at?: string;
          id?: string;
          progress_percentage?: number;
          started_at?: string | null;
          student_id: string;
          updated_at?: string;
        };
        Update: {
          completed_at?: string | null;
          course_id?: string;
          created_at?: string;
          id?: string;
          progress_percentage?: number;
          started_at?: string | null;
          student_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'course_progress_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'course_progress_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
        ];
      };
      student_lesson_progress: {
        Row: {
          completed_at: string | null;
          created_at: string;
          id: string;
          lesson_id: string;
          started_at: string | null;
          student_id: string;
          updated_at: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          lesson_id: string;
          started_at?: string | null;
          student_id: string;
          updated_at?: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          lesson_id?: string;
          started_at?: string | null;
          student_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'student_lesson_progress_lesson_fkey';
            columns: ['lesson_id'];
            isOneToOne: false;
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_lesson_progress_student_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
        ];
      };
      students: {
        Row: {
          created_at: string | null;
          curriculum: string;
          first_name: string;
          gender: Database['public']['Enums']['gender'];
          grade_level: string;
          id: string;
          image_url: string | null;
          language: Database['public']['Enums']['user_language'];
          last_name: string;
          pin: string;
          school_id: string | null;
          updated_at: string | null;
          username: string;
        };
        Insert: {
          created_at?: string | null;
          curriculum?: string;
          first_name: string;
          gender?: Database['public']['Enums']['gender'];
          grade_level: string;
          id?: string;
          image_url?: string | null;
          language?: Database['public']['Enums']['user_language'];
          last_name: string;
          pin: string;
          school_id?: string | null;
          updated_at?: string | null;
          username: string;
        };
        Update: {
          created_at?: string | null;
          curriculum?: string;
          first_name?: string;
          gender?: Database['public']['Enums']['gender'];
          grade_level?: string;
          id?: string;
          image_url?: string | null;
          language?: Database['public']['Enums']['user_language'];
          last_name?: string;
          pin?: string;
          school_id?: string | null;
          updated_at?: string | null;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'students_school_id_fkey';
            columns: ['school_id'];
            isOneToOne: false;
            referencedRelation: 'schools';
            referencedColumns: ['id'];
          },
        ];
      };
      text_content_blocks: {
        Row: {
          content: string;
          content_block_id: string;
          title: string;
        };
        Insert: {
          content: string;
          content_block_id: string;
          title?: string;
        };
        Update: {
          content?: string;
          content_block_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'text_content_blocks_content_block_id_fkey';
            columns: ['content_block_id'];
            isOneToOne: true;
            referencedRelation: 'content_blocks';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          created_at: string | null;
          email: string | null;
          first_name: string;
          id: string;
          language: Database['public']['Enums']['user_language'] | null;
          last_name: string;
          role: Database['public']['Enums']['user_role'];
          school_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          first_name?: string;
          id: string;
          language?: Database['public']['Enums']['user_language'] | null;
          last_name?: string;
          role: Database['public']['Enums']['user_role'];
          school_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          first_name?: string;
          id?: string;
          language?: Database['public']['Enums']['user_language'] | null;
          last_name?: string;
          role?: Database['public']['Enums']['user_role'];
          school_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'users_school_id_fkey';
            columns: ['school_id'];
            isOneToOne: false;
            referencedRelation: 'schools';
            referencedColumns: ['id'];
          },
        ];
      };
      video_content_blocks: {
        Row: {
          content_block_id: string;
          title: string;
          video_url: string;
        };
        Insert: {
          content_block_id: string;
          title?: string;
          video_url: string;
        };
        Update: {
          content_block_id?: string;
          title?: string;
          video_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'video_content_blocks_content_block_id_fkey';
            columns: ['content_block_id'];
            isOneToOne: true;
            referencedRelation: 'content_blocks';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_lesson_with_blocks: {
        Args: {
          p_content_blocks: Json;
          p_description: string;
          p_estimated_duration: number;
          p_module_id: string;
          p_title: string;
        };
        Returns: undefined;
      };
      get_student_course_ids: {
        Args: { student_uuid: string };
        Returns: {
          course_id: string;
        }[];
      };
      start_student_course: {
        Args: { p_course_id: string; p_student_id: string };
        Returns: undefined;
      };
      start_student_lesson: {
        Args: { p_lesson_id: string; p_student_id: string };
        Returns: string[];
      };
      update_full_progress: {
        Args: {
          _completed_at?: string;
          _content_block_id: string;
          _course_id: string;
          _lesson_id: string;
          _student_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      gender: 'Male' | 'Female';
      user_language: 'EN' | 'FR' | 'AR';
      user_role: 'SuperAdmin' | 'SchoolAdmin' | 'Teacher' | 'Student';
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      gender: ['Male', 'Female'],
      user_language: ['EN', 'FR', 'AR'],
      user_role: ['SuperAdmin', 'SchoolAdmin', 'Teacher', 'Student'],
    },
  },
} as const;
