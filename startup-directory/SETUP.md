# Startup Directory Setup Guide

## Prerequisites
- A Supabase project (create one at https://supabase.com)
- Node.js 18.17+ (you have 18.17.1 which works!)

## 🔧 Environment Setup

### 1. Configure Environment Variables

You need to add your Supabase credentials to `.env.local`. 

**Where to find these values:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the values:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

**Edit `.env.local`:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Set Up Database Schema

Copy the contents of `supabase-migration.sql` and run it in your Supabase SQL Editor:

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy and paste the entire contents of `supabase-migration.sql`
4. Click **Run**

This will create:
- `startups` and `updates` tables
- Row Level Security (RLS) policies
- Database triggers for automatic signup
- Proper indexes

### 3. Set Up Storage (Optional - for images)

In your Supabase dashboard, go to **Storage**:

1. Create bucket: `logos` (public)
2. Create bucket: `update-images` (public)

Or run this SQL:
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('update-images', 'update-images', true);
```

## 🚀 Running the App

```bash
npm run dev
```

Visit http://localhost:3000

## ✅ What Works Now

- ✅ **Homepage** - Shows latest startup updates
- ✅ **Authentication** - Sign up/Sign in at `/auth/signup` and `/auth/signin`
- ✅ **Dashboard** - Basic overview at `/dashboard`
- ✅ **Dark Mode** - Default theme
- ✅ **Responsive Design** - Works on mobile/desktop

## 🔄 Next Steps

After environment setup, these features will be added:
- Profile management (`/dashboard/profile`)
- Update creation/editing (`/dashboard/updates`)
- Public startup profiles (`/s/[slug]`)
- Image upload functionality
- Better error handling

## 🐛 Troubleshooting

**"Supabase client error"**: Check your `.env.local` has correct values
**"Auth errors"**: Verify your Supabase project has auth enabled
**"Database errors"**: Make sure you ran the migration SQL

## 📚 Project Structure

```
startup-directory/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── lib/
│   │   ├── supabase/       # Supabase client config
│   │   ├── types/          # TypeScript types
│   │   └── validations/    # Zod schemas
│   └── ...
├── supabase-migration.sql  # Database schema
└── .env.local              # Your environment variables
``` 