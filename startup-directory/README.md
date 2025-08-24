# Australian Startup Directory

A modern startup directory built with Next.js 14, Supabase, and TypeScript. Allows startups to create profiles, share updates, and connect with the community.

## 🚀 Features

- **Authentication**: Sign up/sign in with email verification
- **Startup Profiles**: Create and manage startup profiles with logos, descriptions, and social links
- **Updates Feed**: Share progress updates with markdown support and images
- **Public Profiles**: Dedicated pages for each startup with their updates
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Dark Mode**: Modern dark theme optimized for readability

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for images)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **Validation**: Zod

## 📦 Getting Started

### Prerequisites
- Node.js 18.17+ 
- A Supabase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd startup-directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up database**
   Run the SQL migration in your Supabase SQL editor:
   ```bash
   # Copy contents of supabase-migration.sql to Supabase SQL Editor
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
startup-directory/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Protected dashboard pages
│   │   ├── s/[slug]/         # Public startup profiles
│   │   └── page.tsx          # Homepage
│   ├── components/            # React components
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard components
│   │   └── ui/               # Reusable UI components
│   ├── lib/                  # Utilities and configurations
│   │   ├── hooks/            # Custom React hooks
│   │   ├── supabase/         # Supabase client configuration
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions
│   │   └── validations/      # Zod schemas
│   └── middleware.ts         # Next.js middleware
├── public/                   # Static assets
├── supabase-migration.sql    # Database schema
└── package.json
```

## 🔧 Key Features Implemented

- ✅ **Clean Architecture**: Modular component structure with shared utilities
- ✅ **Type Safety**: Full TypeScript coverage with Zod validation
- ✅ **Authentication Flow**: Complete signup/signin with email verification
- ✅ **Error Handling**: Global error boundary and specific error messages
- ✅ **Performance**: Optimized auth hooks and selective component rendering
- ✅ **Security**: Removed unsafe admin client, proper RLS policies
- ✅ **Code Quality**: Shared styling utilities, consolidated navigation logic

## 🛡️ Security Features

- Row Level Security (RLS) policies
- Secure authentication with Supabase
- Protected dashboard routes
- Input validation with Zod schemas
- Safe file upload handling

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## 🚢 Deployment

The app is ready for deployment on Vercel, Netlify, or any platform supporting Next.js.

For detailed setup instructions, see [SETUP.md](./SETUP.md).
