"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { profileSchema, stageOptions, type ProfileFormData } from "@/lib/validations"
import { Startup } from "@/lib/types/database"
import { X } from "lucide-react"

interface ProfileFormProps {
  startup: Startup
}

export function ProfileForm({ startup }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: startup.name,
    slug: startup.slug,
    tagline: startup.tagline || "",
    description_md: startup.description_md || "",
    website_url: startup.website_url || "",
    location: startup.location || "",
    sectors: startup.sectors || [],
    stage: startup.stage,
    is_public: startup.is_public,
  })
  const [newSector, setNewSector] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const validatedData = profileSchema.parse(formData)
      
      const { error } = await supabase
        .from('startups')
        .update(validatedData)
        .eq('id', startup.id)

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        router.refresh()
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

  const addSector = () => {
    if (newSector.trim() && !formData.sectors?.includes(newSector.trim())) {
      setFormData(prev => ({
        ...prev,
        sectors: [...(prev.sectors || []), newSector.trim()]
      }))
      setNewSector("")
    }
  }

  const removeSector = (sectorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      sectors: prev.sectors?.filter(sector => sector !== sectorToRemove) || []
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Startup Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 text-sm text-green-500 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
              Profile updated successfully!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Startup Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                required
                disabled={loading}
                placeholder="your-startup-name"
              />
              <p className="text-xs text-muted-foreground">
                Your public profile will be at: /s/{formData.slug}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
              disabled={loading}
              placeholder="A brief description of what you do"
              maxLength={120}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description_md}
              onChange={(e) => setFormData(prev => ({ ...prev, description_md: e.target.value }))}
              disabled={loading}
              placeholder="Tell people about your startup..."
              rows={4}
              maxLength={2000}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                disabled={loading}
                placeholder="https://your-website.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                disabled={loading}
                placeholder="San Francisco, CA"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage">Stage</Label>
            <select
              id="stage"
              value={formData.stage}
              onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value as any }))}
              disabled={loading}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              {stageOptions.map((stage) => (
                <option key={stage} value={stage}>
                  {stage.replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Sectors</Label>
            <div className="flex gap-2">
              <Input
                value={newSector}
                onChange={(e) => setNewSector(e.target.value)}
                disabled={loading}
                placeholder="Add a sector (e.g., fintech, AI)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSector())}
              />
              <Button type="button" onClick={addSector} disabled={loading} variant="outline">
                Add
              </Button>
            </div>
            {formData.sectors && formData.sectors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.sectors.map((sector) => (
                  <Badge key={sector} variant="secondary" className="flex items-center gap-1">
                    {sector}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeSector(sector)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_public"
              checked={formData.is_public}
              onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
              disabled={loading}
              className="rounded border-gray-300"
            />
            <Label htmlFor="is_public">Make profile public</Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 