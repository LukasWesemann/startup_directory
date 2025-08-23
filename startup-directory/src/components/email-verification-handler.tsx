"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function EmailVerificationHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleEmailVerification = async () => {
      const supabase = createClient()
      
      // Check for email verification parameters
      const error = searchParams.get('error')
      const errorCode = searchParams.get('error_code')
      const errorDescription = searchParams.get('error_description')
      
      // If there are error parameters, redirect to verification page with error
      if (error || errorCode || errorDescription) {
        const params = new URLSearchParams()
        if (error) params.set('error', error)
        if (errorCode) params.set('error_code', errorCode)
        if (errorDescription) params.set('error_description', errorDescription)
        
        router.replace(`/auth/verify?${params.toString()}`)
        return
      }

      // Check if this is a successful email verification
      // Supabase typically includes access_token in the URL hash for successful verifications
      const hash = window.location.hash
      if (hash && (hash.includes('access_token') || hash.includes('type=recovery'))) {
        try {
          // Try to get the session to see if verification was successful
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          
          if (session && !sessionError) {
            // Verification was successful, redirect to verification success page
            router.replace('/auth/verify')
            return
          }
        } catch (err) {
          console.error('Error checking session:', err)
        }
      }

      // Check for other verification-related parameters
      const type = searchParams.get('type')
      if (type === 'signup' || type === 'recovery') {
        // This looks like a verification redirect, redirect to verification page
        router.replace('/auth/verify')
        return
      }
    }

    handleEmailVerification()
  }, [searchParams, router])

  return null
} 