'use client';

import { useAuth } from '@/contexts/AuthContext';

export type PlanStatus = 'free' | 'trial' | 'pro' | 'loading';

export interface PlanStatusInfo {
  status: PlanStatus;
  subscriptionStatus?: string;
  trialEndTime?: string | null;
  currentPeriodEnd?: string | null;
}

export function usePlanStatus() {
  const { planStatus, subscription, isLoading, refreshUserData } = useAuth();

  const planStatusInfo: PlanStatusInfo = {
    status: planStatus,
    subscriptionStatus: subscription?.status,
    currentPeriodEnd: subscription?.current_period_end
  };
   
  return {
    planStatus,
    planStatusInfo,
    isLoading,
    error: null,
    refetch: refreshUserData
  };
}