'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface StripeBuyButtonProps {
  buyButtonId: string;
  publishableKey: string;
  className?: string;
}

export function StripeBuyButton({ buyButtonId, publishableKey, className }: StripeBuyButtonProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.body.appendChild(script);

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://js.stripe.com') return;
      
      if (event.data.type === 'buy-button:success') {
        console.log('Payment successful, redirecting...');
        window.localStorage.setItem('stripe_payment_intent', event.data.payload.paymentIntentId);
        router.push('/dashboard/settings?payment=success&tab=subscription');
        router.refresh();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      document.body.removeChild(script);
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  useEffect(() => {
  }, []);

  if (!user) return null;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: `
          <stripe-buy-button
            buy-button-id="${buyButtonId}"
            publishable-key="${publishableKey}"
            client-reference-id="${user.id}"
            customer-email="${user.email}"
            success-url="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?payment=success&tab=subscription"
            cancel-url="${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true"
          >
          </stripe-buy-button>
        `
      }}
    />
  );
} 
