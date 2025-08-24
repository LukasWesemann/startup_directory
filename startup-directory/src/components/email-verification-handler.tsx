"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function EmailVerificationHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    // Only run on homepage and auth pages to improve performance
    if (!pathname || (!pathname.startsWith('/auth') && pathname !== '/')) {
      return
    }

    const handleEmailVerification = async () => {
      const supabase = createClient()
      
      // Check for Supabase email verification parameters
      const error = searchParams.get('error')
      const errorCode = searchParams.get('error_code')
      const errorDescription = searchParams.get('error_description')
      
      // Check for Supabase verification parameters
      const type = searchParams.get('type')
      const token = searchParams.get('token')
      
      // Check URL hash for access_token (Supabase verification success)
      const hash = window.location.hash
      const hasAccessToken = hash.includes('access_token')
      const hasType = hash.includes('type=signup') || hash.includes('type=recovery')
      
      // If there are error parameters, redirect to verification page with error
      if (error || errorCode || errorDescription) {
        const params = new URLSearchParams()
        if (error) params.set('error', error)
        if (errorCode) params.set('error_code', errorCode)
        if (errorDescription) params.set('error_description', errorDescription)
        
        router.replace(`/auth/verify?${params.toString()}`)
        return
      }

      // If this looks like a Supabase verification redirect
      if (type === 'signup' || type === 'recovery' || token || hasAccessToken || hasType) {
        try {
          // Try to get the session to see if verification was successful
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          
          if (session && !sessionError) {
            // Verification was successful, redirect to verification success page
            router.replace('/auth/verify')
            return
          } else {
            // No session, but this might still be a verification attempt
            // Check if we can extract verification info from the URL
            if (token || hasAccessToken) {
              // This looks like a verification attempt, redirect to verification page
              router.replace('/auth/verify')
              return
            }
          }
        } catch (err) {
          console.error('Error checking session:', err)
          // If there's an error but we have verification parameters, still redirect
          if (token || hasAccessToken || type) {
            router.replace('/auth/verify')
            return
          }
        }
      }
    }

    handleEmailVerification()
  }, [searchParams, router, pathname])

  return null
} 