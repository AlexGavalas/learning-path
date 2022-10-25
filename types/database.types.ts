export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      note_contents: {
        Row: {
          line: string
          id: number
          title: string
        }
        Insert: {
          line: string
          id?: number
          title: string
        }
        Update: {
          line?: string
          id?: number
          title?: string
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          post: string
          name: string
        }
        Insert: {
          id?: string
          created_at?: string
          post: string
          name: string
        }
        Update: {
          id?: string
          created_at?: string
          post?: string
          name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_notes: {
        Args: { q: string }
        Returns: Database['public']['Tables']['note_contents']['Row']
      }
      search_notes_test: {
        Args: { q: string }
        Returns: Database['public']['Tables']['note_contents']['Row']
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
