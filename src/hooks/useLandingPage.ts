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
        // Not logged in → go to register (will redirect to Stripe checkout after signup)
        router.push('/register');
        return;
      }

      // Already logged in → check trial/subscription status
      if (subscription || isInTrial) {
        // Already has subscription or trial → go to dashboard
        router.push('/dashboard');
        return;
      }

      // Logged in but no trial/subscription → redirect to Stripe checkout
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
        // Redirect to Stripe checkout
        window.location.href = checkoutData.url;
      } else {
        // Failed to create checkout → go to dashboard
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