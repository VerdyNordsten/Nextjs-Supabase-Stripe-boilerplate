"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export default function LearningPage() {
  return (
    <div className="p-6">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Learning Hub
          </h3>
          <p className="text-gray-600">
            Coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

