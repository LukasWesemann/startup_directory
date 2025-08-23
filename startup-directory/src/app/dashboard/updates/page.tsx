import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { UpdateFormModal } from "@/components/dashboard/update-form-modal"
import { formatDateShort } from "@/lib/utils"

async function getUpdates() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/signin")
  }

  const { data: updates, error } = await supabase
    .from('updates')
    .select('*')
    .eq('startup_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading updates:', error)
    return []
  }

  return updates || []
}

export default async function UpdatesPage() {
  const updates = await getUpdates()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manage Updates
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your startup updates
          </p>
        </div>
        <UpdateFormModal>
          <Button>
            Create Update
          </Button>
        </UpdateFormModal>
      </div>

      {updates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                No updates yet
              </h3>
              <p className="text-muted-foreground">
                Share your first update to let people know what you're working on.
              </p>
              <UpdateFormModal>
                <Button>
                  Create Your First Update
                </Button>
              </UpdateFormModal>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {updates.map((update) => (
            <Card key={update.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    {update.title && (
                      <CardTitle className="text-lg">{update.title}</CardTitle>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge variant={update.is_published ? "default" : "secondary"}>
                        {update.is_published ? "Published" : "Draft"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDateShort(update.created_at)}
                      </span>
                    </div>
                  </div>
                  <UpdateFormModal updateId={update.id} update={update}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </UpdateFormModal>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {update.content_md.length > 300 
                    ? `${update.content_md.substring(0, 300)}...`
                    : update.content_md
                  }
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 