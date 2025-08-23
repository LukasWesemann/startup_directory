"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface HamburgerMenuProps {
  children: React.ReactNode
  className?: string
}

export function HamburgerMenu({ children, className = "" }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    // Close menu when any menu item is clicked
    closeMenu()
  }

  return (
    <div className={`relative ${className}`}>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="md:hidden p-2"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
          />
          
          {/* Menu Content */}
          <div className="fixed right-0 top-0 h-full w-64 bg-background border-l border-border shadow-lg">
            <div className="flex flex-col h-full">
              {/* Close Button */}
              <div className="flex justify-end p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMenu}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Menu Items */}
              <div className="flex-1 px-4 pb-4" onClick={handleMenuClick}>
                <div className="space-y-2">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 