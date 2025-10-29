"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isOnboarding = pathname === '/dashboard/onboarding'

  if (isOnboarding) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-60 transition-all duration-300">
        <div className="lg:hidden h-16" />
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}

