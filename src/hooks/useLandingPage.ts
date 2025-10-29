import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useTrialStatus } from '@/hooks/useTrialStatus';

export function useLandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { isInTrial } = useTrialStatus();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isCreatingTrial, setIsCreatingTrial] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        const callbackUrl = `/auth/callback${window.location.search}`;
        window.location.replace(callbackUrl);
      }
    }
  }, []);

  const handleStartTrial = async () => {
    setIsCreatingTrial(true);
    
    try {
      const { createBrowserClient } = await import('@supabase/ssr');
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/register');
        return;
      }

      if (subscription || isInTrial) {
        router.push('/dashboard');
        return;
      }

      const checkoutResponse = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
          isTrialCheckout: true,
        }),
      });

      const checkoutData = await checkoutResponse.json();
      
      if (checkoutResponse.ok && checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        console.error('Checkout creation failed:', checkoutData);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/register');
    } finally {
      setIsCreatingTrial(false);
    }
  };

  const openVideoModal = () => setIsVideoModalOpen(true);
  const closeVideoModal = () => setIsVideoModalOpen(false);

  return {
    isVideoModalOpen,
    isCreatingTrial,
    handleStartTrial,
    openVideoModal,
    closeVideoModal
  };
}