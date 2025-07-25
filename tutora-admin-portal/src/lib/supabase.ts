import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Public client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (similar to Firebase Admin)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Server component client
export function createServerSupabaseClient() {
  return createServerComponentClient({ cookies })
}

// Client component client  
export function createClientSupabaseClient() {
  return createClientComponentClient()
}

// Database types
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          company_code: string
          name: string
          plan: 'basic' | 'premium' | 'enterprise'
          max_users: number
          current_users: number
          is_active: boolean
          admin_user_email: string
          admin_user_name: string
          billing_email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_code: string
          name: string
          plan: 'basic' | 'premium' | 'enterprise'
          max_users: number
          current_users?: number
          is_active?: boolean
          admin_user_email: string
          admin_user_name: string
          billing_email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_code?: string
          name?: string
          plan?: 'basic' | 'premium' | 'enterprise'
          max_users?: number
          current_users?: number
          is_active?: boolean
          admin_user_email?: string
          admin_user_name?: string
          billing_email?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          company_id: string
          email: string
          name: string
          role: 'admin' | 'manager' | 'user'
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          email: string
          name: string
          role?: 'admin' | 'manager' | 'user'
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          email?: string
          name?: string
          role?: 'admin' | 'manager' | 'user'
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          company_id: string
          title: string
          description: string
          content: any
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          title: string
          description: string
          content?: any
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          title?: string
          description?: string
          content?: any
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          company_id: string
          user_id: string
          title: string
          description: string
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          title: string
          description: string
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string
          title?: string
          description?: string
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          company_id: string
          user_id: string
          metric_type: string
          metric_value: number
          metadata: any
          recorded_at: string
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          metric_type: string
          metric_value: number
          metadata?: any
          recorded_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string
          metric_type?: string
          metric_value?: number
          metadata?: any
          recorded_at?: string
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

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// Helper function to generate company codes
export function generateCompanyCode(): string {
  const prefix = process.env.COMPANY_CODE_PREFIX || 'TUT'
  const year = new Date().getFullYear()
  const randomId = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${year}-${randomId}`
} 