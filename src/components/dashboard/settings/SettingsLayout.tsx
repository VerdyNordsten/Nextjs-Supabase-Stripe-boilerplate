"use client"

import React from 'react'
import { User, Gift } from 'lucide-react'

interface SettingsLayoutProps {
  activeTab: 'account' | 'subscription'
  onTabChange: (tab: 'account' | 'subscription') => void
  children: React.ReactNode
}

export function SettingsLayout({ activeTab, onTabChange, children }: SettingsLayoutProps) {
  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => onTabChange('account')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'account'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <User className="h-4 w-4" />
          Account
        </button>
        <button
          onClick={() => onTabChange('subscription')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'subscription'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Gift className="h-4 w-4" />
          Subscription
        </button>
      </div>

      {children}
    </div>
  )
}