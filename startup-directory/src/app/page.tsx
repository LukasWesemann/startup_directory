import { UpdatesFeed } from "@/components/updates-feed"
import { MainNav } from "@/components/main-nav"
import { SponsorSection } from "@/components/sponsor-section"
import { createClient } from "@/lib/supabase/server"
import { UpdateWithStartup } from "@/lib/types/database"

async function getLatestUpdates(): Promise<UpdateWithStartup[]> {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return []
  }

  try {
    const supabase = await createClient()
    
    const { data: updates, error } = await supabase
      .from('updates')
      .select(`
        *,
        startup:startups(*)
      `)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching updates:', error)
      return []
    }

    return updates as UpdateWithStartup[]
  } catch (error) {
    console.error('Supabase error:', error)
    return []
  }
}

export default async function HomePage() {
  const updates = await getLatestUpdates()
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <header className="border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Startup Pulse Logo" className="h-12 w-auto" />
                <h1 className="text-3xl font-bold text-foreground">
                  MLAI Valley
                </h1>
              </div>
              <MainNav />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <SponsorSection />
          {!isSupabaseConfigured ? (
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  🚀 Setup Required
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your Next.js app is running! Now configure Supabase to enable the full functionality.
                </p>
                <div className="space-y-4 text-left">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">1. Add Environment Variables</h3>
                    <p className="text-sm text-muted-foreground">
                      Edit <code className="bg-background px-2 py-1 rounded text-xs">.env.local</code> with your Supabase credentials
                    </p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">2. Run Database Migration</h3>
                    <p className="text-sm text-muted-foreground">
                      Copy <code className="bg-background px-2 py-1 rounded text-xs">supabase-migration.sql</code> to your Supabase SQL Editor
                    </p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">3. Read the Setup Guide</h3>
                    <p className="text-sm text-muted-foreground">
                      Check <code className="bg-background px-2 py-1 rounded text-xs">SETUP.md</code> for detailed instructions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <UpdatesFeed updates={updates} />
          )}
        </main>
    </div>
  )
}
