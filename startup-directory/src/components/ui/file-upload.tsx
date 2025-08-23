"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X } from "lucide-react"

interface FileUploadProps {
  value?: string | null
  onChange: (url: string | null) => void
  onFileSelect?: (file: File) => Promise<void>
  disabled?: boolean
  label?: string
  accept?: string
  maxSize?: number // in MB
}

export function FileUpload({ 
  value, 
  onChange, 
  onFileSelect,
  disabled = false, 
  label = "Upload file",
  accept = "image/*",
  maxSize = 5
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    setError(null)
    setUploading(true)

    try {
      if (onFileSelect) {
        await onFileSelect(file)
      } else {
        // Create a temporary URL for preview
        const previewUrl = URL.createObjectURL(file)
        onChange(previewUrl)
      }
    } catch (err) {
      setError('Failed to process image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={value || ""} alt="Profile picture" />
          <AvatarFallback className="text-lg">
            {value ? "IMG" : "?"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={disabled || uploading}
            className="w-fit"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Choose Image"}
          </Button>
          
          {value && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              disabled={disabled || uploading}
              className="w-fit"
              size="sm"
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      <p className="text-xs text-muted-foreground">
        Accepted formats: JPG, PNG, GIF. Max size: {maxSize}MB
      </p>
    </div>
  )
} 