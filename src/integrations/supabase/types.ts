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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          height_cm: number | null
          id: string
          preferred_coach_style: string | null
          race_goal: string | null
          running_experience: string | null
          updated_at: string | null
          user_id: string
          weekly_mileage_goal: number | null
          weight_kg: number | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          height_cm?: number | null
          id?: string
          preferred_coach_style?: string | null
          race_goal?: string | null
          running_experience?: string | null
          updated_at?: string | null
          user_id: string
          weekly_mileage_goal?: number | null
          weight_kg?: number | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          height_cm?: number | null
          id?: string
          preferred_coach_style?: string | null
          race_goal?: string | null
          running_experience?: string | null
          updated_at?: string | null
          user_id?: string
          weekly_mileage_goal?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      recovery_metrics: {
        Row: {
          created_at: string | null
          date: string
          hrv_score: number | null
          id: string
          recovery_score: number | null
          sleep_duration_hours: number | null
          sleep_quality: number | null
          stress_level: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          hrv_score?: number | null
          id?: string
          recovery_score?: number | null
          sleep_duration_hours?: number | null
          sleep_quality?: number | null
          stress_level?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          hrv_score?: number | null
          id?: string
          recovery_score?: number | null
          sleep_duration_hours?: number | null
          sleep_quality?: number | null
          stress_level?: number | null
          user_id?: string
        }
        Relationships: []
      }
      training_plans: {
        Row: {
          created_at: string | null
          difficulty_level: string | null
          end_date: string | null
          goal: string
          id: string
          is_active: boolean | null
          name: string
          start_date: string
          updated_at: string | null
          user_id: string
          weekly_mileage: number | null
        }
        Insert: {
          created_at?: string | null
          difficulty_level?: string | null
          end_date?: string | null
          goal: string
          id?: string
          is_active?: boolean | null
          name: string
          start_date: string
          updated_at?: string | null
          user_id: string
          weekly_mileage?: number | null
        }
        Update: {
          created_at?: string | null
          difficulty_level?: string | null
          end_date?: string | null
          goal?: string
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string
          updated_at?: string | null
          user_id?: string
          weekly_mileage?: number | null
        }
        Relationships: []
      }
      wearable_data: {
        Row: {
          data_type: string
          device_type: string
          id: string
          metadata: Json | null
          recorded_at: string
          synced_at: string | null
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          data_type: string
          device_type: string
          id?: string
          metadata?: Json | null
          recorded_at: string
          synced_at?: string | null
          unit: string
          user_id: string
          value: number
        }
        Update: {
          data_type?: string
          device_type?: string
          id?: string
          metadata?: Json | null
          recorded_at?: string
          synced_at?: string | null
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      workouts: {
        Row: {
          actual_distance_km: number | null
          actual_duration_minutes: number | null
          actual_pace_per_km: string | null
          completed_at: string | null
          created_at: string | null
          effort_level: number | null
          id: string
          notes: string | null
          planned_date: string
          planned_distance_km: number | null
          planned_duration_minutes: number | null
          planned_pace_per_km: string | null
          training_plan_id: string | null
          updated_at: string | null
          user_id: string
          workout_type: string
        }
        Insert: {
          actual_distance_km?: number | null
          actual_duration_minutes?: number | null
          actual_pace_per_km?: string | null
          completed_at?: string | null
          created_at?: string | null
          effort_level?: number | null
          id?: string
          notes?: string | null
          planned_date: string
          planned_distance_km?: number | null
          planned_duration_minutes?: number | null
          planned_pace_per_km?: string | null
          training_plan_id?: string | null
          updated_at?: string | null
          user_id: string
          workout_type: string
        }
        Update: {
          actual_distance_km?: number | null
          actual_duration_minutes?: number | null
          actual_pace_per_km?: string | null
          completed_at?: string | null
          created_at?: string | null
          effort_level?: number | null
          id?: string
          notes?: string | null
          planned_date?: string
          planned_distance_km?: number | null
          planned_duration_minutes?: number | null
          planned_pace_per_km?: string | null
          training_plan_id?: string | null
          updated_at?: string | null
          user_id?: string
          workout_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_training_plan_id_fkey"
            columns: ["training_plan_id"]
            isOneToOne: false
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
