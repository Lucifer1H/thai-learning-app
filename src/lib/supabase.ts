// Supabase configuration will be added later
// For now, export dummy functions to prevent build errors

const createMockQuery = () => ({
  select: (columns?: string) => createMockQuery(),
  insert: (data?: any) => createMockQuery(),
  update: (data?: any) => createMockQuery(),
  eq: (column?: string, value?: any) => createMockQuery(),
  order: (column?: string, options?: any) => createMockQuery(),
  single: () => Promise.resolve({ data: null, error: null }),
  then: (callback: any) => Promise.resolve({ data: null, error: null }).then(callback)
});

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    signOut: () => Promise.resolve(),
    signInWithPassword: (credentials?: any) => Promise.resolve({ error: null }),
    signUp: (credentials?: any) => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: (table?: string) => createMockQuery()
}

export const createSupabaseClient = () => supabase

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
