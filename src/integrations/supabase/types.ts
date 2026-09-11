export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      caregivers: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          family_id: string | null
          id: string
          name: string
          pin_hash: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          family_id?: string | null
          id?: string
          name: string
          pin_hash?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          family_id?: string | null
          id?: string
          name?: string
          pin_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "caregivers_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      cultural_content: {
        Row: {
          category: string
          description: string
          display_date: string | null
          id: string
          image_url: string | null
          state: string
          title: string
        }
        Insert: {
          category: string
          description: string
          display_date?: string | null
          id?: string
          image_url?: string | null
          state: string
          title: string
        }
        Update: {
          category?: string
          description?: string
          display_date?: string | null
          id?: string
          image_url?: string | null
          state?: string
          title?: string
        }
        Relationships: []
      }
      families: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      flashcard_likes: {
        Row: {
          cultural_content_id: string | null
          family_id: string | null
          id: string
          liked_at: string | null
        }
        Insert: {
          cultural_content_id?: string | null
          family_id?: string | null
          id?: string
          liked_at?: string | null
        }
        Update: {
          cultural_content_id?: string | null
          family_id?: string | null
          id?: string
          liked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_likes_cultural_content_id_fkey"
            columns: ["cultural_content_id"]
            isOneToOne: false
            referencedRelation: "cultural_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcard_likes_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          accuracy: number | null
          created_at: string | null
          difficulty_level: number | null
          event_time: string
          family_id: string | null
          game_type: string
          id: string
          response_time_avg: number | null
        }
        Insert: {
          accuracy?: number | null
          created_at?: string | null
          difficulty_level?: number | null
          event_time?: string
          family_id?: string | null
          game_type: string
          id?: string
          response_time_avg?: number | null
        }
        Update: {
          accuracy?: number | null
          created_at?: string | null
          difficulty_level?: number | null
          event_time?: string
          family_id?: string | null
          game_type?: string
          id?: string
          response_time_avg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          author_name: string | null
          authored_by: string
          content: string
          created_at: string | null
          event_time: string
          family_id: string | null
          id: string
          mood_emoji: string | null
          quiz_eligible: boolean | null
          used_in_quiz: boolean | null
        }
        Insert: {
          author_name?: string | null
          authored_by: string
          content: string
          created_at?: string | null
          event_time?: string
          family_id?: string | null
          id?: string
          mood_emoji?: string | null
          quiz_eligible?: boolean | null
          used_in_quiz?: boolean | null
        }
        Update: {
          author_name?: string | null
          authored_by?: string
          content?: string
          created_at?: string | null
          event_time?: string
          family_id?: string | null
          id?: string
          mood_emoji?: string | null
          quiz_eligible?: boolean | null
          used_in_quiz?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          created_at: string | null
          family_id: string | null
          id: string
          name: string
          preferred_language: string | null
        }
        Insert: {
          created_at?: string | null
          family_id?: string | null
          id?: string
          name: string
          preferred_language?: string | null
        }
        Update: {
          created_at?: string | null
          family_id?: string | null
          id?: string
          name?: string
          preferred_language?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_prompts: {
        Row: {
          answered: boolean | null
          correct_answer: string
          created_at: string | null
          family_id: string | null
          id: string
          question: string
          scheduled_date: string
          source_journal_id: string | null
          was_correct: boolean | null
          wrong_options: string[] | null
        }
        Insert: {
          answered?: boolean | null
          correct_answer: string
          created_at?: string | null
          family_id?: string | null
          id?: string
          question: string
          scheduled_date: string
          source_journal_id?: string | null
          was_correct?: boolean | null
          wrong_options?: string[] | null
        }
        Update: {
          answered?: boolean | null
          correct_answer?: string
          created_at?: string | null
          family_id?: string | null
          id?: string
          question?: string
          scheduled_date?: string
          source_journal_id?: string | null
          was_correct?: boolean | null
          wrong_options?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_prompts_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_prompts_source_journal_id_fkey"
            columns: ["source_journal_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      reminder_logs: {
        Row: {
          completed_at: string | null
          event_time: string
          family_id: string | null
          id: string
          reminder_id: string | null
          was_completed: boolean | null
        }
        Insert: {
          completed_at?: string | null
          event_time?: string
          family_id?: string | null
          id?: string
          reminder_id?: string | null
          was_completed?: boolean | null
        }
        Update: {
          completed_at?: string | null
          event_time?: string
          family_id?: string | null
          id?: string
          reminder_id?: string | null
          was_completed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reminder_logs_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_logs_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "reminders"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          created_at: string | null
          family_id: string | null
          id: string
          label: string
          recurrence: string | null
          scheduled_time: string
          type: string
        }
        Insert: {
          created_at?: string | null
          family_id?: string | null
          id?: string
          label: string
          recurrence?: string | null
          scheduled_time: string
          type: string
        }
        Update: {
          created_at?: string | null
          family_id?: string | null
          id?: string
          label?: string
          recurrence?: string | null
          scheduled_time?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_family_account: {
        Args: {
          p_caregiver_name: string
          p_patient_name: string
          p_pin_hash: string
          p_relation: string
        }
        Returns: string
      }
      verify_caregiver_pin: {
        Args: { p_family_id: string; p_pin: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
