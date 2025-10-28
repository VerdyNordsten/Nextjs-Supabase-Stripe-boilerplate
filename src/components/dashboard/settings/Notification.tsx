"use client"

import React from 'react'
import { CheckCircle, AlertTriangle } from 'lucide-react'

interface NotificationProps {
  type: 'success' | 'error' | 'payment-success'
  message: string
}

export function Notification({ type, message }: NotificationProps) {
  if (type === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
        <p className="text-green-800 font-medium">{message}</p>
      </div>
    )
  }

  if (type === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
        <p className="text-red-800 font-medium">{message}</p>
      </div>
    )
  }

  if (type === 'payment-success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
        <p className="text-green-800 font-medium">
          🎉 {message}
        </p>
      </div>
    )
  }

  return null
}