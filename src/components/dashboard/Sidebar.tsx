"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { usePlanStatus } from '@/hooks/usePlanStatus'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ThemeToggle from '@/components/ThemeToggle'
import {
  Settings,
  BookOpen,
  Gift,
  MessageSquare,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Calendar
} from 'lucide-react'

const primaryNavItems = [
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const supportNavItems = [
  { name: 'Learning Hub', href: '/dashboard/learning', icon: BookOpen },
  { name: 'Referral (Earn 30%)', href: '/dashboard/referral', icon: Gift },
  { name: 'Feedback', href: '/dashboard/feedback', icon: MessageSquare },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, userProfile, signOut } = useAuth()
  const { planStatus } = usePlanStatus()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      const names = name.split(' ')
      return names.length > 1 
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : name.substring(0, 2).toUpperCase()
    }
    if (!email) return 'U'
    return email.substring(0, 2).toUpperCase()
  }

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isSigningOut) return
    
    setIsSigningOut(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('logging-out', 'true')
        localStorage.clear()
        
        document.cookie.split(';').forEach(cookie => {
          const eqPos = cookie.indexOf('=')
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
          if (name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
          }
        })
        
        window.location.replace('/login')
      }
    }
  }

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b border-border flex items-center px-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
        <span className="ml-3 text-lg font-bold text-foreground">SaaS Templates</span>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-45 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-46 h-screen w-60 sm:w-64 border-r border-border bg-sidebar flex flex-col transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:w-60 lg:shadow-none",
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
      <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-linear-to-r from-blue-600 to-blue-400 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">SaaS Templates</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 overscroll-contain">
        <div className="space-y-1">
          {primaryNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="mt-8">
          <h4 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Support
          </h4>
          <div className="space-y-1">
            {supportNavItems.map((item) => {
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          <Link
            href="/dashboard/support"
            className="mt-3 flex items-center justify-center gap-2 w-full rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-muted-foreground transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            Contact Support
          </Link>
        </div>
      </nav>

      <div className="relative border-t border-sidebar-border p-4 space-y-3 bg-sidebar z-10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile?.avatar_url || user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-linear-to-r from-blue-600 to-blue-400 text-white">
              {getInitials(userProfile?.full_name, userProfile?.email || user?.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">{userProfile?.email || user?.email}</p>
          </div>
        </div>
        <Badge
          variant={planStatus === 'trial' ? "outline" : planStatus === 'free' ? "secondary" : "default"}
          className="w-full justify-center pointer-events-none transition-all duration-200"
        >
          {planStatus === 'loading' ? (
            <span className="opacity-50">Loading...</span>
          ) : planStatus === 'free' ? (
            "Free Plan"
          ) : planStatus === 'trial' ? (
            "Trial"
          ) : (
            "Pro Plan"
          )}
        </Badge>
        <Button
          onClick={handleSignOut}
          disabled={isSigningOut}
          variant="outline"
          size="sm"
          type="button"
          className="relative w-full flex items-center justify-center gap-2 text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-destructive hover:border-destructive transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 z-20 cursor-pointer"
        >
          {isSigningOut ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-red-600"></div>
              Signing out...
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4" />
              Sign Out
            </>
          )}
        </Button>
      </div>
    </aside>
    </>
  )
}

