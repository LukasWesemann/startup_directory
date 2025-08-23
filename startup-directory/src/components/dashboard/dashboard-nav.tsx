"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { HamburgerMenu } from "@/components/ui/hamburger-menu"
import { Logo } from "@/components/logo"

export function DashboardNav() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const desktopNav = (
    <div className="hidden md:flex items-center space-x-4">
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
      
      <Button variant="outline" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  )

  const mobileNav = (
    <HamburgerMenu>
      <Link 
        href="/dashboard" 
        className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
      >
        Overview
      </Link>
      <Link 
        href="/dashboard/profile" 
        className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
      >
        Profile
      </Link>
      <Link 
        href="/dashboard/updates" 
        className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
      >
        Updates
      </Link>
      <div className="pt-2">
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          className="w-full justify-start"
        >
          Sign Out
        </Button>
      </div>
    </HamburgerMenu>
  )

  return (
    <header>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center space-x-4">
            {desktopNav}
            {mobileNav}
          </div>
        </div>
      </div>
    </header>
  )
} 