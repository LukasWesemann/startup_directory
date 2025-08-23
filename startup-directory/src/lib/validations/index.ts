import { z } from 'zod'

export const stageOptions = [
  'idea',
  'pre-seed', 
  'seed',
  'series-a',
  'series-b',
  'growth',
  'public'
] as const

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name must be less than 60 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(60, 'Slug must be less than 60 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  logo_url: z.string().optional().or(z.literal('')),
  tagline: z.string().max(120, 'Tagline must be less than 120 characters').optional().or(z.literal('')),
  description_md: z.string().max(2000, 'Description must be less than 2000 characters').optional().or(z.literal('')),
  website_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().max(100, 'Location must be less than 100 characters').optional().or(z.literal('')),
  sectors: z.array(z.string()).max(10, 'Maximum 10 sectors allowed').optional(),
  stage: z.enum(stageOptions).default('idea'),
  is_public: z.boolean().optional(),
  email: z.string().email('Must be a valid email address').optional().or(z.literal('')),
  twitter_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

export const updateSchema = z.object({
  title: z.string().max(80, 'Title must be less than 80 characters').optional().or(z.literal('')),
  content_md: z.string()
    .min(50, 'Content must be at least 50 characters')
    .max(800, 'Content must be less than 800 characters'),
  is_published: z.boolean().default(true),
})

export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signUpSchema = authSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name must be less than 60 characters'),
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type UpdateFormData = z.infer<typeof updateSchema>
export type AuthFormData = z.infer<typeof authSchema>
export type SignUpFormData = z.infer<typeof signUpSchema> 