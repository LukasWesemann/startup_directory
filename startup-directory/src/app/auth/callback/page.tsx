"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      
      // Get URL parameters
      const error = searchParams.get('error')
      const errorCode = searchParams.get('error_code')
      const errorDescription = searchParams.get('error_description')
      
      // Check for verification parameters
      const type = searchParams.get('type')
      const token = searchParams.get('token')
      
      // Check URL hash for access_token
      const hash = window.location.hash
      const hasAccessToken = hash.includes('access_token')
      
      // If there are error parameters, redirect to verification page with error
      if (error || errorCode || errorDescription) {
        const params = new URLSearchParams()
        if (error) params.set('error', error)
        if (errorCode) params.set('error_code', errorCode)
        if (errorDescription) params.set('error_description', errorDescription)
        
        router.replace(`/auth/verify?${params.toString()}`)
        return
      }

      // If this looks like a verification attempt
      if (type === 'signup' || type === 'recovery' || token || hasAccessToken) {
        try {
          // Try to get the session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          
          if (session && !sessionError) {
            // Verification was successful
            router.replace('/auth/verify')
            return
          } else {
            // No session, but this might still be a verification attempt
            router.replace('/auth/verify')
            return
          }
        } catch (err) {
          console.error('Error in auth callback:', err)
          // If there's an error but we have verification parameters, still redirect
          router.replace('/auth/verify')
          return
        }
      }

      // If we get here, this might not be a verification callback
      // Redirect to homepage
      router.replace('/')
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f0f0f' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-muted-foreground">Processing verification...</p>
      </div>
    </div>
  )
} 