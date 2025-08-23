export type Database = {
  public: {
    Tables: {
      startups: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          tagline: string | null
          description_md: string | null
          website_url: string | null
          location: string | null
          sectors: string[] | null
          stage: 'idea' | 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth' | 'public'
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          slug: string
          logo_url?: string | null
          tagline?: string | null
          description_md?: string | null
          website_url?: string | null
          location?: string | null
          sectors?: string[] | null
          stage?: 'idea' | 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth' | 'public'
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          tagline?: string | null
          description_md?: string | null
          website_url?: string | null
          location?: string | null
          sectors?: string[] | null
          stage?: 'idea' | 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth' | 'public'
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      updates: {
        Row: {
          id: string
          startup_id: string
          title: string | null
          content_md: string
          images: UpdateImage[]
          is_published: boolean
          published_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          startup_id: string
          title?: string | null
          content_md: string
          images?: UpdateImage[]
          is_published?: boolean
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          startup_id?: string
          title?: string | null
          content_md?: string
          images?: UpdateImage[]
          is_published?: boolean
          published_at?: string
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
      stage_enum: 'idea' | 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth' | 'public'
    }
  }
}

export interface UpdateImage {
  url: string
  w: number
  h: number
  alt: string
}

export type Startup = Database['public']['Tables']['startups']['Row']
export type StartupInsert = Database['public']['Tables']['startups']['Insert']
export type StartupUpdate = Database['public']['Tables']['startups']['Update']

export type Update = Database['public']['Tables']['updates']['Row']
export type UpdateInsert = Database['public']['Tables']['updates']['Insert']
export type UpdateEdit = Database['public']['Tables']['updates']['Update']

export type StartupWithLatestUpdate = Startup & {
  latest_update?: Update | null
}

export type UpdateWithStartup = Update & {
  startup: Startup
} 