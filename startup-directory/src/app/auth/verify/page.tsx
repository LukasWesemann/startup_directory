"use client"

import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { CheckCircle, XCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function EmailVerificationPage() {
  const searchParams = useSearchParams()
  
  // Check for error parameters
  const error = searchParams.get('error')
  const errorCode = searchParams.get('error_code')
  const errorDescription = searchParams.get('error_description')
  
  const hasError = error || errorCode || errorDescription

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      <header>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Logo />
            <MainNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="mx-auto w-full max-w-md space-y-6">
            <Card
              style={{
                backgroundColor: 'transparent',
                boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
                border: '1px solid #404040'
              }}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {hasError ? (
                    <XCircle className="h-16 w-16 text-red-500" />
                  ) : (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {hasError ? "Verification Failed" : "Email Verified!"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {hasError ? (
                    <div className="p-4 text-sm text-red-700 bg-red-50 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="font-medium">Verification failed</p>
                      <p className="mt-2">
                        {errorDescription || "The verification link is invalid or has expired. Please try signing up again or contact support if the problem persists."}
                      </p>
                      {errorCode && (
                        <p className="mt-1 text-xs opacity-75">Error code: {errorCode}</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-green-700 bg-green-50 dark:bg-green-950/20 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-md">
                      <p className="font-medium">Account activated successfully!</p>
                      <p className="mt-2">
                        Your email has been verified and your account is now active. 
                        You can now sign in to access your startup dashboard.
                      </p>
                    </div>
                  )}
                  
                  <div className="text-sm text-muted-foreground text-center">
                    {hasError ? (
                      <p>Please try again or contact support for assistance.</p>
                    ) : (
                      <p>Welcome to the Startup Directory! 🚀</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-3 pt-4">
                    {hasError ? (
                      <>
                        <Button 
                          asChild
                          style={{
                            backgroundColor: '#0F8A8A',
                            borderColor: '#0F8A8A',
                            color: 'white'
                          }}
                          className="hover:bg-teal-700 hover:border-teal-700"
                        >
                          <Link href="/auth/signup">
                            Try Signing Up Again
                          </Link>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          asChild
                        >
                          <Link href="/auth/signin">
                            Go to Sign In
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          asChild
                          style={{
                            backgroundColor: '#0F8A8A',
                            borderColor: '#0F8A8A',
                            color: 'white'
                          }}
                          className="hover:bg-teal-700 hover:border-teal-700"
                        >
                          <Link href="/auth/signin">
                            Sign In to Your Account
                          </Link>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          asChild
                        >
                          <Link href="/">
                            Back to Homepage
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 