import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, MapPin, ExternalLink } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

async function getStartupBySlug(slug: string) {
  const supabase = await createClient()
  
  // Get startup profile
  const { data: startup, error: startupError } = await supabase
    .from('startups')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .single()

  if (startupError || !startup) {
    return null
  }

  // Get published updates
  const { data: updates } = await supabase
    .from('updates')
    .select('*')
    .eq('startup_id', startup.id)
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return {
    startup,
    updates: updates || []
  }
}

export default async function StartupProfilePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const data = await getStartupBySlug(params.slug)
  
  if (!data) {
    notFound()
  }

  const { startup, updates } = data

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Startup Directory
            </Link>
            <div className="flex gap-3">
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  Join as Startup
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Startup Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {startup.name}
                  </h1>
                  {startup.tagline && (
                    <p className="text-lg text-muted-foreground mt-2">
                      {startup.tagline}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary">
                    {startup.stage.replace('-', ' ')}
                  </Badge>
                  {startup.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {startup.location}
                    </div>
                  )}
                  {startup.website_url && (
                    <a 
                      href={startup.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {startup.sectors && startup.sectors.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Sectors</p>
                    <div className="flex flex-wrap gap-2">
                      {startup.sectors.map((sector: string) => (
                        <Badge key={sector} variant="outline">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {startup.description_md && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">About</p>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      {startup.description_md.split('\n').map((paragraph: string, i: number) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Updates Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Latest Updates
            </h2>
            
            {updates.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">
                    No updates published yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {updates.map((update) => (
                  <Card key={update.id}>
                    <CardHeader>
                      <div className="space-y-2">
                        {update.title && (
                          <CardTitle className="text-xl">{update.title}</CardTitle>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {formatDate(update.published_at)}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none text-muted-foreground">
                        {update.content_md.split('\n').map((paragraph: string, i: number) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 