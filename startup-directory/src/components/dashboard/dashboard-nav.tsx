"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function DashboardNav() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header>
              <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Startup Pulse Logo" className="h-12 w-auto -mt-1" />
              <div className="flex items-baseline gap-2">
                <img src="/MLAI_textlogo.png" alt="MLAI" className="h-6 w-auto" />
                <span className="text-2xl font-normal text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
                  Valley
                </span>
              </div>
            </Link>
            <nav className="flex space-x-4">
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Overview
              </Link>
              <Link 
                href="/dashboard/profile" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Profile
              </Link>
              <Link 
                href="/dashboard/updates" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Updates
              </Link>
            </nav>
          </div>
          
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
} 