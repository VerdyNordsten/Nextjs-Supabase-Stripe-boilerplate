import { useAuth } from '@/contexts/AuthContext';

export function useTrialStatus() {
  const { planStatus, subscription, isLoading } = useAuth();
  
  const isInTrial = planStatus === 'trial' || subscription?.status === 'trialing';
  const trialEndTime = subscription?.status === 'trialing' ? subscription.current_period_end : null;

  return { 
    isInTrial, 
    trialEndTime, 
    isLoading 
  };
}