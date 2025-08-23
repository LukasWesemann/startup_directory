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
      className="cursor-pointer transition-all duration-300 ease-in-out flex flex-col h-full hover:scale-102 hover:shadow-2xl shadow-lg"
      style={{
        backgroundColor: 'transparent',
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        border: '1px solid #404040'
      }}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
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
        </div>
        
        {/* Tags positioned at bottom of profile section */}
        <div className="flex items-center space-x-2 mt-2">
          <Badge 
            className="text-xs rounded-[4px] text-white"
            style={{ backgroundColor: '#0F8A8A' }}
          >
            {startup.stage.replace('-', ' ')}
          </Badge>
          {startup.sectors && startup.sectors.length > 0 && (
            <Badge 
              className="text-xs rounded-[4px] text-gray-800"
              style={{ 
                backgroundColor: '#F5F5DC',
                border: '1px solid #E5E5D0'
              }}
            >
              {startup.sectors[0]}
            </Badge>
          )}
        </div>
        {update.title && (
          <h4 className="font-medium text-foreground mt-3">{update.title}</h4>
        )}
      </CardHeader>
      <CardContent className="pt-0 flex-1 flex flex-col">
        <div className="prose prose-sm dark:prose-invert max-w-none flex-1">
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