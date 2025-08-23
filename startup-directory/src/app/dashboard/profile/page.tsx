import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

async function getStartupProfile() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/signin")
  }

  const { data: startup, error } = await supabase
    .from('startups')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !startup) {
    console.error('Error loading startup profile:', error)
    redirect("/dashboard")
  }

  return startup
}

export default async function ProfilePage() {
  const startup = await getStartupProfile()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Edit Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Update your startup information and settings
        </p>
      </div>

      {/* Public Profile Link */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
        <div>
          <h3 className="font-medium text-foreground">Public Profile</h3>
          <p className="text-sm text-muted-foreground">
            View how your profile appears to the public
          </p>
        </div>
        <Link href={`/s/${startup.slug}`} target="_blank">
          <Button variant="outline" size="sm">
            View Public Profile
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <ProfileForm startup={startup} />
    </div>
  )
} 