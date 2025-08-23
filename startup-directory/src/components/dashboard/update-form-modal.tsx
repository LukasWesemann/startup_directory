"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { updateSchema, type UpdateFormData } from "@/lib/validations"
import { Update } from "@/lib/types/database"
import { ReactNode } from "react"

interface UpdateFormModalProps {
  children: ReactNode
  update?: Update
  updateId?: string
}

export function UpdateFormModal({ children, update, updateId }: UpdateFormModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<UpdateFormData>({
    title: "",
    content_md: "",
    is_published: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (update) {
      setFormData({
        title: update.title || "",
        content_md: update.content_md,
        is_published: update.is_published,
      })
    }
  }, [update])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const validatedData = updateSchema.parse(formData)
      
      if (update || updateId) {
        // Edit existing update
        const { error } = await supabase
          .from('updates')
          .update(validatedData)
          .eq('id', update?.id || updateId)

        if (error) {
          setError(error.message)
        } else {
          setOpen(false)
          router.refresh()
        }
      } else {
        // Create new update
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setError("You must be logged in to create updates")
          return
        }

        const { error } = await supabase
          .from('updates')
          .insert({
            ...validatedData,
            startup_id: user.id,
          })

        if (error) {
          setError(error.message)
        } else {
          setOpen(false)
          setFormData({
            title: "",
            content_md: "",
            is_published: true,
          })
          router.refresh()
        }
      }
    } catch (err: any) {
      if (err.errors) {
        setError(err.errors[0].message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {update || updateId ? "Edit Update" : "Create Update"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              disabled={loading}
              placeholder="Update title"
              maxLength={80}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content_md}
              onChange={(e) => setFormData(prev => ({ ...prev, content_md: e.target.value }))}
              disabled={loading}
              placeholder="Share what you've been working on..."
              rows={8}
              required
              minLength={50}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground">
              {formData.content_md.length}/2000 characters (minimum 50)
            </p>
          </div>



          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : (update || updateId ? "Update" : "Create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 