"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HamburgerMenu } from "@/components/ui/hamburger-menu"
import { useAuth } from "@/lib/hooks/use-auth"

export function MainNav() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex gap-3">
        <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
          Loading...
        </div>
      </div>
    )
  }

  if (user) {
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
        
        <Button variant="outline" onClick={signOut}>
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
            onClick={signOut}
            className="w-full justify-start"
          >
            Sign Out
          </Button>
        </div>
      </HamburgerMenu>
    )

    return (
      <div className="flex items-center gap-3">
        {desktopNav}
        {mobileNav}
      </div>
    )
  }

  const desktopNav = (
    <div className="hidden md:flex gap-3">
      <Link
        href="/auth/signin"
        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Sign In
      </Link>
      <Link
        href="/auth/signup"
        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
      >
        Join as Startup
      </Link>
    </div>
  )

  const mobileNav = (
    <HamburgerMenu>
      <Link
        href="/auth/signin"
        className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
      >
        Sign In
      </Link>
      <Link
        href="/auth/signup"
        className="block px-4 py-3 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
      >
        Join as Startup
      </Link>
    </HamburgerMenu>
  )

  return (
    <div className="flex items-center gap-3">
      {desktopNav}
      {mobileNav}
    </div>
  )
} 