import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For client components
export const createSupabaseClient = () => createClientComponentClient()

// For server components
export const createSupabaseServerClient = () => createServerComponentClient({ cookies })

// Database types (will be updated after schema creation)
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
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          title: string
          title_chinese: string
          description: string
          description_chinese: string
          level: number
          order: number
          lesson_type: string
          content: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          title_chinese: string
          description: string
          description_chinese: string
          level: number
          order: number
          lesson_type: string
          content: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          title_chinese?: string
          description?: string
          description_chinese?: string
          level?: number
          order?: number
          lesson_type?: string
          content?: any
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
          audio_url: string | null
          category: string
          difficulty_level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          thai_word: string
          chinese_translation: string
          pronunciation: string
          audio_url?: string | null
          category: string
          difficulty_level: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          thai_word?: string
          chinese_translation?: string
          pronunciation?: string
          audio_url?: string | null
          category?: string
          difficulty_level?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          score: number | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          score?: number | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          score?: number | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
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
      [_ in never]: never
    }
  }
}
