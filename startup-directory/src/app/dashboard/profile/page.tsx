import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/dashboard/profile-form"

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

      <ProfileForm startup={startup} />
    </div>
  )
} 