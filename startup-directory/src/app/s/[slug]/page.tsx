import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <header>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Startup Pulse Logo" className="h-12 w-auto -mt-1" />
              <div className="flex items-baseline gap-2">
                <img src="/MLAI_textlogo.png" alt="MLAI" className="h-6 w-auto" />
                <span className="text-2xl font-normal text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
                  Valley
                </span>
              </div>
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
          <Card 
            style={{
              backgroundColor: 'transparent',
              boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
              border: '1px solid #404040'
            }}
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={startup.logo_url || ""} alt={startup.name} />
                    <AvatarFallback className="text-lg">
                      {startup.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground">
                      {startup.name}
                    </h1>
                    {startup.tagline && (
                      <p className="text-lg text-muted-foreground mt-2">
                        {startup.tagline}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 1: Stage and Location */}
                <div className="flex flex-wrap gap-3">
                  <Badge 
                    className="text-white"
                    style={{ backgroundColor: '#0F8A8A' }}
                  >
                    {startup.stage.replace('-', ' ')}
                  </Badge>
                  {startup.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {startup.location}
                    </div>
                  )}
                </div>

                {/* Row 2: Social Media Links and Email */}
                <div className="flex flex-wrap gap-3">
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
                  {startup.twitter_url && (
                    <a 
                      href={startup.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      X (Twitter)
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {startup.linkedin_url && (
                    <a 
                      href={startup.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {startup.email && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {startup.email}
                    </div>
                  )}
                </div>

                {startup.sectors && startup.sectors.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Sectors</p>
                    <div className="flex flex-wrap gap-2">
                      {startup.sectors.map((sector: string) => (
                        <Badge 
                          key={sector}
                          className="text-gray-800"
                          style={{ 
                            backgroundColor: '#F5F5DC',
                            border: '1px solid #E5E5D0'
                          }}
                        >
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
              <Card 
                style={{
                  backgroundColor: 'transparent',
                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
                  border: '1px solid #404040'
                }}
              >
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">
                    No updates published yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {updates.map((update) => (
                  <Card 
                    key={update.id}
                    style={{
                      backgroundColor: 'transparent',
                      boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
                      border: '1px solid #404040'
                    }}
                  >
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