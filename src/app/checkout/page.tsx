'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { useSubscription } from '@/hooks/useSubscription';

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const canceled = searchParams.get('canceled');
  const forcePayment = searchParams.get('force') === 'true'; // Allow forcing payment page
  
  const { isInTrial, isLoading: trialLoading } = useTrialStatus();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();

  useEffect(() => {
    if (!user) {
      console.log('[Checkout] No user found, redirecting to login...');
      router.push('/login?payment=true');
      return;
    }

    if (canceled) {
      console.log('[Checkout] User canceled payment, showing message...');
      return;
    }

    // Wait for trial and subscription status to load
    if (trialLoading || subscriptionLoading) {
      console.log('[Checkout] Loading trial/subscription status...');
      return;
    }

    // Check if user already has trial or active subscription (and not forcing payment)
    if (!forcePayment && (isInTrial || subscription)) {
      console.log('[Checkout] User already has trial or subscription, redirecting to dashboard...');
      console.log('[Checkout] Trial:', isInTrial, 'Subscription:', subscription?.status);
      router.push('/dashboard');
      return;
    }

    const createCheckoutSession = async () => {
      try {
        console.log('[Checkout] Creating Stripe Checkout Session...');
        console.log('[Checkout] User ID:', user.id);
        console.log('[Checkout] User Email:', user.email);

        const response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
          }),
        });

        const data = await response.json();
        console.log('[Checkout] API Response:', data);

        if (!response.ok) {
          throw new Error(data.error || data.details || 'Failed to create checkout session');
        }

        if (data.url) {
          console.log('[Checkout] ✅ Redirecting to Stripe:', data.url);
          window.location.href = data.url;
        } else {
          throw new Error('No checkout URL received from server');
        }
      } catch (err: unknown) {
        console.error('[Checkout] ❌ Error:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
      }
    };

    createCheckoutSession();
  }, [user, router, canceled, isInTrial, subscription, forcePayment, trialLoading, subscriptionLoading]);

  if (canceled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Canceled</h2>
          <p className="text-gray-600 mb-6">
            You canceled the payment process. No charges were made.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/checkout')}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-2">
            We couldn&apos;t create your checkout session.
          </p>
          <p className="text-sm text-red-600 mb-6 font-mono bg-red-50 p-3 rounded">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
          <div 
            className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-r-purple-600 animate-spin mx-auto" 
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Creating your checkout session...
          </h2>
          <p className="text-gray-600">
            Please wait while we redirect you to Stripe
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <div className="flex items-start gap-3 text-left">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-1">🔒 Secure Payment</p>
              <p>You&apos;ll be redirected to Stripe&apos;s secure checkout page to complete your subscription.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

