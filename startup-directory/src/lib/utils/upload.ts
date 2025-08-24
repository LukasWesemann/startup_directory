import { createClient } from '@/lib/supabase/client'

export async function uploadFile(
  file: File,
  bucket: string = 'startup-logos',
  path?: string
): Promise<string> {
  const supabase = createClient()
  
  // Generate a unique filename if no path is provided
  const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`
  
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      // If bucket doesn't exist, throw error instead of fallback
      if (error.message.includes('bucket') || error.message.includes('not found')) {
        throw new Error('Storage bucket not found. Please configure storage in your Supabase project.')
      }
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return publicUrl
  } catch (err: any) {
    // Don't create blob URLs as fallback to avoid memory leaks
    throw new Error(`Upload failed: ${err.message}`)
  }
}

export async function deleteFile(
  url: string,
  bucket: string = 'startup-logos'
): Promise<void> {
  // If it's a blob URL (temporary), just revoke it
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
    return
  }

  const supabase = createClient()
  
  try {
    // Extract the file path from the URL
    const urlParts = url.split('/')
    const fileName = urlParts[urlParts.length - 1]
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])

    if (error) {
      console.warn('Failed to delete file from storage:', error.message)
    }
  } catch (err) {
    console.warn('Storage not available for deletion:', err)
  }
} 