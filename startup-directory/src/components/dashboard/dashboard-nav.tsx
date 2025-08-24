"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HamburgerMenu } from "@/components/ui/hamburger-menu"
import { Logo } from "@/components/logo"
import { useAuth } from "@/lib/hooks/use-auth"

export function DashboardNav() {
  const { signOut } = useAuth()

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
    <header className="pt-2">
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