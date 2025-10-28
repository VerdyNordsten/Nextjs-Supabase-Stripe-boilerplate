"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Gift } from 'lucide-react'

export default function ReferralPage() {
  return (
    <div className="p-6">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Gift className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Referral Program
          </h3>
          <p className="text-gray-600">
            Earn 30% commission - Coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

