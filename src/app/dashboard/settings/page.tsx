"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useSubscription } from '@/hooks/useSubscription'
import { useTrialStatus } from '@/hooks/useTrialStatus'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  SettingsLayout, 
  Notification, 
  AccountSettings, 
  SubscriptionManager 
} from '@/components/dashboard/settings'

export default function SettingsPage() {
  const { user, userProfile } = useAuth()
  const { updateProfile } = useUserProfile()
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentStatus = searchParams.get('payment')
  
  const [activeTab, setActiveTab] = useState<'account' | 'subscription'>('account')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const { subscription, isLoading: isLoadingSubscription, fetchSubscription } = useSubscription()
  const { isInTrial, trialEndTime } = useTrialStatus()

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'subscription') {
      setActiveTab('subscription')
    }
  }, [searchParams])

  useEffect(() => {
    if (paymentStatus === 'success') {
      console.log('Payment successful!')
      setActiveTab('subscription')
      setTimeout(() => {
        router.replace('/dashboard/settings?tab=subscription')
      }, 3000)
    }
  }, [paymentStatus, router])

  useEffect(() => {
    if (user?.id) {
      fetchSubscription()
    }
  }, [user?.id, fetchSubscription])

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setTimeout(() => setError(null), 5000)
  }

  const handleSuccess = (successMessage: string) => {
    setSuccess(successMessage)
    setTimeout(() => setSuccess(null), 3000)
  }

  return (
    <SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {paymentStatus === 'success' && (
        <Notification 
          type="payment-success" 
          message="Payment successful! Your subscription is now active." 
        />
      )}

      {success && (
        <Notification type="success" message={success} />
      )}

      {error && (
        <Notification type="error" message={error} />
      )}

      {activeTab === 'account' && (
        <AccountSettings
          user={user}
          userProfile={userProfile}
          updateProfile={updateProfile}
          onError={handleError}
          onSuccess={handleSuccess}
        />
      )}

      {activeTab === 'subscription' && (
        <SubscriptionManager
          subscription={subscription}
          isLoading={isLoadingSubscription}
          isInTrial={isInTrial}
          trialEndTime={trialEndTime}
          fetchSubscription={fetchSubscription}
        />
      )}
    </SettingsLayout>
  )
}