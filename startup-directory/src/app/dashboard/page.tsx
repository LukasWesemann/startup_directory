import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Startup, Update } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDateShort } from "@/lib/utils"

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
        <Card 
          style={{
            backgroundColor: 'transparent',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
            border: '1px solid #404040'
          }}
        >
          <CardHeader>
            <CardTitle>Profile Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Slug: <span className="font-medium">{startup.slug}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Stage: <span className="font-medium">{startup.stage.replace('-', ' ')}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Visibility: <span className="font-medium">{startup.is_public ? 'Public' : 'Private'}</span>
              </p>
              <Link href="/dashboard/profile">
                <Button variant="outline" size="sm" className="mt-3">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card 
          style={{
            backgroundColor: 'transparent',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
            border: '1px solid #404040'
          }}
        >
          <CardHeader>
            <CardTitle>Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">
                {updates.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Total updates published
              </p>
              <Link href="/dashboard/updates">
                <Button variant="outline" size="sm" className="mt-3">
                  Manage Updates
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card 
          style={{
            backgroundColor: 'transparent',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
            border: '1px solid #404040'
          }}
        >
          <CardHeader>
            <CardTitle>Public Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                View your public profile page
              </p>
              <Link href={`/s/${startup.slug}`} target="_blank">
                <Button variant="outline" size="sm" className="mt-3">
                  View Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {updates.length > 0 && (
        <Card 
          style={{
            backgroundColor: 'transparent',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
            border: '1px solid #404040'
          }}
        >
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