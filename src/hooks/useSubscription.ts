'use client';

import { useAuth } from '@/contexts/AuthContext';

export interface Subscription {
  id: string;
  user_id: string;
  status: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  cancel_at_period_end: boolean;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export function useSubscription() {
  const { subscription, isLoading, refreshUserData } = useAuth();

  const syncWithStripe = async (subscriptionId: string) => {
    try {
      const response = await fetch('/api/stripe/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to sync with Stripe');
      }
      
      await refreshUserData();
    } catch (error) {
      console.error('[useSubscription] Stripe sync error:', error);
      throw error;
    }
  };
  
  return {
    subscription,
    isLoading,
    error: null,
    syncWithStripe,
    fetchSubscription: refreshUserData
  };
} 