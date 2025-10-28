'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseBrowser as supabase } from '@/utils/supabase-browser';

interface AccessStatus {
  hasAccess: boolean;
  reason: 'trial' | 'subscription' | 'none';
  trialEndTime: string | null;
  subscriptionEndTime: string | null;
  planStatus: 'free' | 'trial' | 'pro';
  isLoading: boolean;
}

export function useAccessControl() {
  const { user } = useAuth();
  const [accessStatus, setAccessStatus] = useState<AccessStatus>({
    hasAccess: false,
    reason: 'none',
    trialEndTime: null,
    subscriptionEndTime: null,
    planStatus: 'free',
    isLoading: true,
  });

  const checkAccess = useCallback(async () => {
    // Don't check access if user is not available or still loading
    if (!user) {
      setAccessStatus({
        hasAccess: false,
        reason: 'none',
        trialEndTime: null,
        subscriptionEndTime: null,
        planStatus: 'free',
        isLoading: false,
      });
      return;
    }

    if (!user.id) {
      setAccessStatus({
        hasAccess: false,
        reason: 'none',
        trialEndTime: null,
        subscriptionEndTime: null,
        planStatus: 'free',
        isLoading: false,
      });
      return;
    }

    try {
      // Use the get_user_data RPC function to get all user data in one call
      const { data, error } = await supabase.rpc('get_user_data');

      if (error) {
        console.error('[useAccessControl] Error getting user data:', error);
        setAccessStatus({
          hasAccess: false,
          reason: 'none',
          trialEndTime: null,
          subscriptionEndTime: null,
          planStatus: 'free',
          isLoading: false,
        });
        return;
      }

      const planStatus = data?.planStatus || 'free';
      const isSubscriber = data?.isSubscriber || false;
      const subscription = data?.subscription;

      let hasAccess = false;
      let reason: 'trial' | 'subscription' | 'none' = 'none';
      let trialEndTime: string | null = null;
      let subscriptionEndTime: string | null = null;

      if (isSubscriber && subscription) {
        const periodEnd = new Date(subscription.current_period_end);
        const now = new Date();

        if (periodEnd > now) {
          hasAccess = true;
          if (subscription.status === 'trialing') {
            reason = 'trial';
            trialEndTime = subscription.current_period_end;
          } else {
            reason = 'subscription';
            subscriptionEndTime = subscription.current_period_end;
          }
        }
      }

      setAccessStatus({
        hasAccess,
        reason,
        trialEndTime,
        subscriptionEndTime,
        planStatus,
        isLoading: false,
      });
    } catch (error) {
      console.error('[useAccessControl] Error checking access:', error);
      setAccessStatus({
        hasAccess: false,
        reason: 'none',
        trialEndTime: null,
        subscriptionEndTime: null,
        planStatus: 'free',
        isLoading: false,
      });
    }
  }, [user]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('access_control_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        () => checkAccess()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, checkAccess]);

  return {
    ...accessStatus,
    refetch: checkAccess,
  };
}
