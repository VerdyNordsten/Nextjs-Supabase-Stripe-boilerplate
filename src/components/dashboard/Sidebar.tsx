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
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Call signOut (it will handle the redirect internally)
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
      
      // Even if signOut fails, ensure user is logged out
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('logging-out', 'true')
        localStorage.clear()
        
        // Clear all cookies
        document.cookie.split(';').forEach(cookie => {
          const eqPos = cookie.indexOf('=')
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
          if (name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
          }
        })
        
        // Force redirect
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center px-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-900" />
          ) : (
            <Menu className="h-6 w-6 text-gray-900" />
          )}
        </button>
        <span className="ml-3 text-lg font-bold text-gray-900">UptoPilot</span>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[45] bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-[46] h-screen w-60 sm:w-64 border-r border-gray-200 bg-[#fafafa] flex flex-col transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:w-60 lg:shadow-none",
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">UptoPilot</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden p-1 hover:bg-gray-200 rounded-md transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>
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
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="mt-8">
          <h4 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Support
          </h4>
          <div className="space-y-1">
            {supportNavItems.map((item) => {
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          <Link
            href="/dashboard/support"
            className="mt-3 flex items-center justify-center gap-2 w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            Contact Support
          </Link>
        </div>
      </nav>

      <div className="relative border-t border-gray-200 p-4 space-y-3 bg-[#fafafa] z-10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile?.avatar_url || user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              {getInitials(userProfile?.full_name, userProfile?.email || user?.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{userProfile?.email || user?.email}</p>
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
          className="relative w-full flex items-center justify-center gap-2 text-gray-700 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 z-20 cursor-pointer"
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

