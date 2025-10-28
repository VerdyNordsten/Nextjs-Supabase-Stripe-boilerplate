"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { HelpCircle } from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="p-6">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <HelpCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Contact Support
          </h3>
          <p className="text-gray-600">
            We&apos;re here to help - Coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

