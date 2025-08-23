"use client"

import { UpdateWithStartup } from "@/lib/types/database"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { formatDateShort } from "@/lib/utils"

interface UpdateModalProps {
  update: UpdateWithStartup | null
  onClose: () => void
}

export function UpdateModal({ update, onClose }: UpdateModalProps) {
  if (!update) return null

  const { startup } = update
  const publishedDate = formatDateShort(update.published_at)

  return (
    <Dialog open={!!update} onOpenChange={() => onClose()}>
      <DialogContent className="!w-[48vw] !max-w-[48vw] !sm:max-w-[48vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Link 
              href={`/s/${startup.slug}`}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={startup.logo_url || ""} alt={startup.name} />
                <AvatarFallback>
                  {startup.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg text-foreground">{startup.name}</h3>
                <p className="text-sm text-muted-foreground">{startup.tagline}</p>
              </div>
            </Link>
            <Badge variant="secondary">
              {startup.stage.replace('-', ' ')}
            </Badge>
          </div>
          
          {update.title && (
            <DialogTitle className="text-xl font-semibold mt-4">
              {update.title}
            </DialogTitle>
          )}
        </DialogHeader>

        <div className="mt-6 space-y-8">
          <div className="prose prose-base dark:prose-invert max-w-none break-words leading-relaxed">
            <ReactMarkdown>{update.content_md}</ReactMarkdown>
          </div>

          {update.images.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-foreground text-lg">Images</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {update.images.map((image, index) => (
                  <div key={index} className="space-y-3">
                    <img
                      src={image.url}
                      alt={image.alt || `Update image ${index + 1}`}
                      className="w-full rounded-lg border border-border shadow-sm"
                      style={{
                        aspectRatio: `${image.w} / ${image.h}`,
                        objectFit: 'cover'
                      }}
                    />
                    {image.alt && (
                      <p className="text-sm text-muted-foreground">{image.alt}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Published on {publishedDate}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 