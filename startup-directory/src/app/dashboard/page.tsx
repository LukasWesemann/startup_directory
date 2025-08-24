import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Startup, Update } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDateShort, cardStyle } from "@/lib/utils"
import { Pen, Compass } from "lucide-react"

async function getDashboardData() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/signin")
  }

  // Get startup profile
  const { data: startup } = await supabase
    .from('startups')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get recent updates
  const { data: updates } = await supabase
    .from('updates')
    .select('*')
    .eq('startup_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return { startup, updates: updates || [] }
}

export default async function DashboardPage() {
  const { startup, updates } = await getDashboardData()

  if (!startup) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Something went wrong loading your startup profile.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pt-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {startup.name}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your startup profile and updates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card style={cardStyle} className="flex flex-col">
          <CardHeader>
            <CardTitle>Profile Status</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              {(() => {
                const fields = [
                  { name: 'Logo', filled: !!startup.logo_url },
                  { name: 'Tagline', filled: !!startup.tagline },
                  { name: 'Description', filled: !!startup.description_md },
                  { name: 'Website', filled: !!startup.website_url },
                  { name: 'Location', filled: !!startup.location },
                  { name: 'Sectors', filled: startup.sectors && startup.sectors.length > 0 },
                  { name: 'Email', filled: !!startup.email },
                  { name: 'Twitter', filled: !!startup.twitter_url },
                  { name: 'LinkedIn', filled: !!startup.linkedin_url }
                ]
                const filledCount = fields.filter(field => field.filled).length
                const completionPercentage = Math.round((filledCount / fields.length) * 100)
                
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Profile Completion</span>
                      <span className="text-sm font-medium text-foreground">{completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${completionPercentage}%`,
                          backgroundColor: completionPercentage >= 80 ? '#0F8A8A' : completionPercentage >= 50 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {filledCount} of {fields.length} fields completed
                      {!startup.logo_url && <span className="block mt-1">• Missing logo</span>}
                      {!startup.tagline && <span className="block">• Missing tagline</span>}
                      {(!startup.sectors || startup.sectors.length === 0) && <span className="block">• Missing sectors</span>}
                    </div>
                  </>
                )
              })()}
            </div>
            <div className="flex gap-2 mt-4">
              <Link href="/dashboard/profile">
                <Button 
                  variant="outline"
                  size="sm" 
                  className="text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <Pen className="w-3 h-3 mr-1" />
                  Edit Profile
                </Button>
              </Link>
              <Link href={`/s/${startup.slug}`} target="_blank">
                <Button 
                  size="sm" 
                  className="text-white hover:bg-teal-700 hover:border-teal-700 transition-colors cursor-pointer"
                  style={{
                    backgroundColor: '#0F8A8A',
                    borderColor: '#0F8A8A',
                  }}
                >
                  View Public Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card style={cardStyle} className="flex flex-col">
          <CardHeader>
            <CardTitle>Updates</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-2 flex-1">
              <p className="text-2xl font-bold text-foreground">
                {updates.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Total updates published
              </p>
            </div>
            <Link href="/dashboard/updates" className="mt-4">
              <Button 
                size="sm" 
                className="text-white hover:bg-teal-700 hover:border-teal-700 transition-colors cursor-pointer"
                style={{
                  backgroundColor: '#0F8A8A',
                  borderColor: '#0F8A8A',
                }}
              >
                Manage Updates
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card style={cardStyle} className="flex flex-col">
          <CardHeader>
            <CardTitle>Discover similar startups</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <Compass className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Coming Soon
                </p>
                <p className="text-xs text-muted-foreground">
                  Find startups in similar sectors and stages
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {updates.length > 0 && (
        <Card style={cardStyle}>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.id} className="border-l-2 pl-4" style={{ borderLeftColor: '#0F8A8A' }}>
                  {update.title && (
                    <h4 className="font-medium text-foreground">{update.title}</h4>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {update.content_md.substring(0, 150)}...
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDateShort(update.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 