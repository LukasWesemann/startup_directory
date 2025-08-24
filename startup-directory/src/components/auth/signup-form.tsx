"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card
        style={{
          backgroundColor: 'transparent',
          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
          border: '1px solid #404040'
        }}
      >
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 text-sm text-green-700 bg-green-50 dark:bg-green-950/20 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-md">
              <p className="font-medium">Account created successfully!</p>
              <p className="mt-2">
                We've sent a confirmation email to <strong>{email}</strong>. 
                Please check your inbox and click the confirmation link to activate your account.
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Didn't receive the email? Check your spam folder or contact support.</p>
            </div>
            
            <div className="flex justify-center pt-8">
              <Button 
                onClick={() => router.push("/auth/signin")}
                style={{
                  backgroundColor: '#0F8A8A',
                  borderColor: '#0F8A8A',
                  color: 'white'
                }}
                className="hover:bg-teal-700 hover:border-teal-700"
              >
                Go to Sign In
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      style={{
        backgroundColor: 'transparent',
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        border: '1px solid #404040'
      }}
    >
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name" className="mt-4 block">Startup Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              placeholder="Your startup name"
              className={loading ? "opacity-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="mt-4 block">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="your@email.com"
              className={loading ? "opacity-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="mt-4 block">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              placeholder="Min 6 characters"
              className={loading ? "opacity-50" : ""}
            />
          </div>
          
          <div className="flex justify-center pt-8">
            <Button 
              type="submit" 
              disabled={loading}
              style={{
                backgroundColor: loading ? '#6B7280' : '#0F8A8A',
                borderColor: loading ? '#6B7280' : '#0F8A8A',
                color: 'white'
              }}
              className={`hover:bg-teal-700 hover:border-teal-700 transition-all duration-200 ${
                loading ? 'cursor-not-allowed opacity-75' : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 