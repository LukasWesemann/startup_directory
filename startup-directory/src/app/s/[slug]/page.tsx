import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { MainNav } from "@/components/main-nav"
import Link from "next/link"
import { MapPin, Globe, ExternalLink, Twitter, Linkedin, Calendar, MessageSquare } from "lucide-react"
import { UpdateWithStartup } from "@/lib/types/database"

interface PageProps {
  params: {
    slug: string
  }
}

async function getStartupData(slug: string) {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }

  try {
    const supabase = await createClient()
    
    // Get startup data
    const { data: startup, error: startupError } = await supabase
      .from('startups')
      .select('*')
      .eq('slug', slug)
      .eq('is_public', true)
      .single()

    if (startupError || !startup) {
      return null
    }

    // Get updates for this startup
    const { data: updates, error: updatesError } = await supabase
      .from('updates')
      .select('*')
      .eq('startup_id', startup.id)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(10)

    if (updatesError) {
      console.error('Error fetching updates:', updatesError)
    }

    return {
      startup,
      updates: updates || []
    }
  } catch (error) {
    console.error('Supabase error:', error)
    return null
  }
}

export default async function StartupPage({ params }: PageProps) {
  const data = await getStartupData(params.slug)
  
  if (!data) {
    notFound()
  }

  const { startup, updates } = data

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <header>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Logo />
            <MainNav />
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
                    className="text-xs rounded-[4px] text-white"
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

                {/* Row 1.5: Sectors */}
                {startup.sectors && startup.sectors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {startup.sectors.map((sector: string) => (
                      <Badge 
                        key={sector}
                        className="text-xs rounded-[4px] text-gray-800"
                        style={{ 
                          backgroundColor: '#F5F5DC',
                          border: '1px solid #E5E5D0'
                        }}
                      >
                        {sector}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Row 2: Social Media Links */}
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
                      <Twitter className="w-4 h-4" />
                      Twitter
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
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Row 3: Description */}
                {startup.description_md && (
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {startup.description_md.split('\n').map((paragraph: string, i: number) => (
                      <p key={i} className="mb-2">{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Updates Section */}
          {updates.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold text-foreground">Latest Updates</h2>
              </div>
              
              <div className="space-y-4">
                {updates.map((update) => (
                  <Card 
                    key={update.id}
                    style={{
                      backgroundColor: 'transparent',
                      boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
                      border: '1px solid #404040'
                    }}
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(update.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        
                        <div className="prose prose-sm prose-invert max-w-none">
                          {update.content_md && update.content_md.split('\n').map((paragraph: string, i: number) => (
                            <p key={i} className="mb-2">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <Card 
            style={{
              backgroundColor: 'transparent',
              boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
              border: '1px solid #404040'
            }}
          >
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Want to share your startup's journey?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Join the directory and start sharing your updates with the community.
                </p>
                <div className="flex justify-center gap-3">
                  <Link href="/auth/signup">
                    <Button 
                      style={{
                        backgroundColor: '#0F8A8A',
                        borderColor: '#0F8A8A',
                        color: 'white'
                      }}
                      className="hover:bg-teal-700 hover:border-teal-700"
                    >
                      Join as Startup
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline">
                      Browse More Startups
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 