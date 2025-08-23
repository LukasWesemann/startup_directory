"use client"

import { UpdateWithStartup } from "@/lib/types/database"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatDateShort } from "@/lib/utils"

interface UpdateCardProps {
  update: UpdateWithStartup
  onClick: () => void
}

export function UpdateCard({ update, onClick }: UpdateCardProps) {
  const { startup } = update
  const publishedDate = formatDateShort(update.published_at)
  
  // Extract first paragraph or limit content for preview
  const contentPreview = update.content_md.length > 200 
    ? update.content_md.substring(0, 200) + "..." 
    : update.content_md

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow border-border bg-card"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Link 
            href={`/s/${startup.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={startup.logo_url || ""} alt={startup.name} />
              <AvatarFallback>
                {startup.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{startup.name}</h3>
              <p className="text-sm text-muted-foreground">{startup.tagline}</p>
            </div>
          </Link>
          <Badge variant="secondary" className="text-xs">
            {startup.stage.replace('-', ' ')}
          </Badge>
        </div>
        {update.title && (
          <h4 className="font-medium text-foreground mt-3">{update.title}</h4>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {contentPreview}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-muted-foreground">
            {publishedDate}
          </span>
          {update.images.length > 0 && (
            <span className="text-xs text-muted-foreground">
              📸 {update.images.length} image{update.images.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 