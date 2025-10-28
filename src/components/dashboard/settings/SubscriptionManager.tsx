"use client"

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Gift, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Subscription {
  id: string
  status: string
  created_at: string
  current_period_end?: string
  cancel_at_period_end?: boolean
  stripe_subscription_id?: string
}

interface SubscriptionManagerProps {
  subscription: Subscription | null
  isLoading: boolean
  isInTrial: boolean
  trialEndTime?: string | null
  fetchSubscription: () => Promise<void>
}

export function SubscriptionManager({ 
  subscription, 
  isLoading, 
  isInTrial, 
  trialEndTime, 
  fetchSubscription 
}: SubscriptionManagerProps) {
  const router = useRouter()
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return
    
    setIsCancelling(true)
    try {
      const response = await fetch('/api/stripe/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subscriptionId: subscription.stripe_subscription_id 
        }),
      })
      
      if (!response.ok) throw new Error('Failed to cancel subscription')
      
      setIsCancelModalOpen(false)
      await fetchSubscription()
    } catch (error) {
      console.error('Error canceling subscription:', error)
    } finally {
      setIsCancelling(false)
    }
  }

  const handleReactivateSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return
    
    try {
      const response = await fetch('/api/stripe/reactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subscriptionId: subscription.stripe_subscription_id 
        }),
      })
      
      if (!response.ok) throw new Error('Failed to reactivate subscription')
      
      await fetchSubscription()
    } catch (error) {
      console.error('Error reactivating subscription:', error)
    }
  }

  return (
    <>
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Subscription Status
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-600">Loading subscription details...</span>
              </div>
            </div>
          ) : subscription ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : subscription.status === 'trialing'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Started</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(subscription.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {subscription.current_period_end && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {subscription.cancel_at_period_end ? 'Ends on' : 'Renews on'}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                {subscription.status === 'canceled' ? (
                  <Button
                    onClick={() => router.push('/checkout?force=true')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Resubscribe
                  </Button>
                ) : subscription.cancel_at_period_end ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        Your subscription will end on{' '}
                        <span className="font-medium">
                          {subscription.current_period_end ?
                            new Date(subscription.current_period_end).toLocaleDateString() :
                            'soon'
                          }
                        </span>
                      </p>
                    </div>
                    <Button
                      onClick={handleReactivateSubscription}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Resume Subscription
                    </Button>
                  </div>
                ) : (subscription.status === 'active' || subscription.status === 'trialing') ? (
                  <Button
                    onClick={() => setIsCancelModalOpen(true)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Cancel Subscription
                  </Button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {isInTrial ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                  <div className="flex items-start gap-3">
                    <Gift className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-900 font-medium mb-1">
                        You're in your trial period
                      </p>
                      <p className="text-blue-700 text-sm">
                        Your trial will end on{' '}
                        <span className="font-medium">
                          {trialEndTime ? new Date(trialEndTime).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          }) : 'soon'}
                        </span>
                      </p>
                      <p className="text-blue-700 text-sm mt-2">
                        Subscribe now to continue using the app after the trial ends.
                      </p>
                    </div>
                  </div>
                </div>
              ) : trialEndTime ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-900 font-medium mb-1">
                        Your trial period has ended
                      </p>
                      <p className="text-red-700 text-sm">
                        Trial ended on{' '}
                        <span className="font-medium">
                          {new Date(trialEndTime).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </p>
                      <p className="text-red-700 text-sm mt-2">
                        Subscribe now to regain access to all features.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">
                    Subscribe to unlock all features and start managing your social media.
                  </p>
                </div>
              )}
              
              <button
                onClick={() => router.push('/checkout?force=true')}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Subscribe Now - $19/month
              </button>
              <p className="text-center text-xs text-gray-500 mt-3">
                🔒 Secure payment powered by Stripe
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Cancel Subscription?
            </h3>
            <p className="text-gray-600 mb-6">
              You'll continue to have access until the end of your billing period on{' '}
              <span className="font-medium">
                {subscription?.current_period_end ?
                  new Date(subscription.current_period_end).toLocaleDateString() :
                  'your next billing date'
                }
              </span>. No refunds are provided for cancellations.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setIsCancelModalOpen(false)}
                variant="outline"
                disabled={isCancelling}
                className="border-gray-300"
              >
                Keep Subscription
              </Button>
              <Button
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isCancelling ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Canceling...
                  </span>
                ) : (
                  'Yes, Cancel'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}