'use client';

import { useAccessControl } from './useAccessControl';

export function useFeatureAccess() {
  const { hasAccess, reason, trialEndTime, subscriptionEndTime } = useAccessControl();

  return {
    hasAccess,
    isPaidUser: reason === 'subscription',
    isTrialUser: reason === 'trial',
    isFreeUser: !hasAccess,

    trialEndTime,
    subscriptionEndTime,

    canSchedulePosts: hasAccess,
    canUseAICaption: hasAccess,
    canAccessAnalytics: hasAccess,
    canConnectMultipleAccounts: hasAccess,
    
    requiresUpgrade: (_feature: string) => {
      if (!hasAccess) {
        return true;
      }
      return false;
    },

    getUpgradeMessage: () => {
      if (reason === 'subscription') return null;
      if (reason === 'trial') return 'Your trial is active. Upgrade to continue after trial ends.';
      return 'Subscribe to unlock all features and start managing your social media.';
    }
  };
}


