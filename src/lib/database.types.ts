export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          native_language: string
          target_language: string
          user_role: 'student' | 'teacher' | 'admin'
          learning_streak: number
          total_study_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          native_language?: string
          target_language?: string
          user_role?: 'student' | 'teacher' | 'admin'
          learning_streak?: number
          total_study_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          native_language?: string
          target_language?: string
          user_role?: 'student' | 'teacher' | 'admin'
          learning_streak?: number
          total_study_time?: number
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          title: string
          title_chinese: string
          description: string | null
          description_chinese: string | null
          lesson_type: 'alphabet' | 'pronunciation' | 'vocabulary' | 'grammar' | 'writing' | 'culture' | 'conversation'
          difficulty_level: 'beginner' | 'elementary' | 'intermediate' | 'advanced'
          order_index: number
          content: Json
          audio_urls: string[] | null
          image_urls: string[] | null
          estimated_duration: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          title_chinese: string
          description?: string | null
          description_chinese?: string | null
          lesson_type: 'alphabet' | 'pronunciation' | 'vocabulary' | 'grammar' | 'writing' | 'culture' | 'conversation'
          difficulty_level?: 'beginner' | 'elementary' | 'intermediate' | 'advanced'
          order_index: number
          content: Json
          audio_urls?: string[] | null
          image_urls?: string[] | null
          estimated_duration?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          title_chinese?: string
          description?: string | null
          description_chinese?: string | null
          lesson_type?: 'alphabet' | 'pronunciation' | 'vocabulary' | 'grammar' | 'writing' | 'culture' | 'conversation'
          difficulty_level?: 'beginner' | 'elementary' | 'intermediate' | 'advanced'
          order_index?: number
          content?: Json
          audio_urls?: string[] | null
          image_urls?: string[] | null
          estimated_duration?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vocabulary: {
        Row: {
          id: string
          thai_word: string
          chinese_translation: string
          pronunciation: string
          pronunciation_ipa: string | null
          audio_url: string | null
          image_url: string | null
          category: string
          difficulty_level: 'beginner' | 'elementary' | 'intermediate' | 'advanced'
          usage_example_thai: string | null
          usage_example_chinese: string | null
          usage_example_audio_url: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          thai_word: string
          chinese_translation: string
          pronunciation: string
          pronunciation_ipa?: string | null
          audio_url?: string | null
          image_url?: string | null
          category: string
          difficulty_level?: 'beginner' | 'elementary' | 'intermediate' | 'advanced'
          usage_example_thai?: string | null
          usage_example_chinese?: string | null
          usage_example_audio_url?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          thai_word?: string
          chinese_translation?: string
          pronunciation?: string
          pronunciation_ipa?: string | null
          audio_url?: string | null
          image_url?: string | null
          category?: string
          difficulty_level?: 'beginner' | 'elementary' | 'intermediate' | 'advanced'
          usage_example_thai?: string | null
          usage_example_chinese?: string | null
          usage_example_audio_url?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      user_lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          is_completed: boolean
          score: number | null
          time_spent: number
          attempts: number
          last_accessed_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          is_completed?: boolean
          score?: number | null
          time_spent?: number
          attempts?: number
          last_accessed_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          is_completed?: boolean
          score?: number | null
          time_spent?: number
          attempts?: number
          last_accessed_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_vocabulary_progress: {
        Row: {
          id: string
          user_id: string
          vocabulary_id: string
          mastery_level: number
          correct_answers: number
          total_attempts: number
          last_reviewed_at: string
          next_review_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vocabulary_id: string
          mastery_level?: number
          correct_answers?: number
          total_attempts?: number
          last_reviewed_at?: string
          next_review_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vocabulary_id?: string
          mastery_level?: number
          correct_answers?: number
          total_attempts?: number
          last_reviewed_at?: string
          next_review_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          session_date: string
          total_time: number
          lessons_completed: number
          vocabulary_practiced: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_date?: string
          total_time?: number
          lessons_completed?: number
          vocabulary_practiced?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_date?: string
          total_time?: number
          lessons_completed?: number
          vocabulary_practiced?: number
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          name_chinese: string
          description: string | null
          description_chinese: string | null
          icon: string | null
          criteria: Json
          reward_points: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_chinese: string
          description?: string | null
          description_chinese?: string | null
          icon?: string | null
          criteria: Json
          reward_points?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_chinese?: string
          description?: string | null
          description_chinese?: string | null
          icon?: string | null
          criteria?: Json
          reward_points?: number
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
        }
      }
      audio_files: {
        Row: {
          id: string
          filename: string
          original_name: string | null
          file_path: string
          file_size: number | null
          duration: number | null
          content_type: string
          related_vocabulary_id: string | null
          related_lesson_id: string | null
          speaker_gender: string | null
          speaker_region: string | null
          created_at: string
        }
        Insert: {
          id?: string
          filename: string
          original_name?: string | null
          file_path: string
          file_size?: number | null
          duration?: number | null
          content_type?: string
          related_vocabulary_id?: string | null
          related_lesson_id?: string | null
          speaker_gender?: string | null
          speaker_region?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          filename?: string
          original_name?: string | null
          file_path?: string
          file_size?: number | null
          duration?: number | null
          content_type?: string
          related_vocabulary_id?: string | null
          related_lesson_id?: string | null
          speaker_gender?: string | null
          speaker_region?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      lesson_type: 'alphabet' | 'pronunciation' | 'vocabulary' | 'grammar' | 'writing' | 'culture' | 'conversation'
      difficulty_level: 'beginner' | 'elementary' | 'intermediate' | 'advanced'
      user_role: 'student' | 'teacher' | 'admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
