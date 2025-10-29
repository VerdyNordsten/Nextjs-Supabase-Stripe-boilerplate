'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Script from 'next/script';
import { supabaseBrowser as supabase } from '@/utils/supabase-browser';

export default function RegisterPage() {
  const { user, isLoading: authLoading, signInWithGoogle, signUpWithEmail } = useAuth();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);

  const _redirectToSubscription = searchParams.get('redirect_to_subscription') === 'true';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code && !urlParams.get('redirect_to_subscription')) {
        const callbackParams = new URLSearchParams();
        callbackParams.set('code', code);
        callbackParams.set('signup', 'true');
        callbackParams.set('redirect_to_subscription', 'true');
        window.location.replace(`/auth/callback?${callbackParams.toString()}`);
      }
    }
  }, []);

  const redirectToStripeCheckout = useCallback(async () => {
    if (!user) return;
    
    try {
      setShowWelcome(true);
      
      console.log('[Register] Syncing user profile...');
      
      const { data: syncData, error: syncError } = await supabase.rpc('sync_user_on_signup', {
        p_user_id: user.id,
        p_email: user.email,
        p_full_name: fullName || null,
        p_avatar_url: user.user_metadata?.avatar_url || null,
        p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        p_login_type: user.app_metadata?.provider || 'email',
        p_stripe_customer_id: null
      });

      if (syncError) {
        console.warn('⚠️ Failed to sync user profile:', syncError);
      } else {
        console.log('✅ User profile synced successfully', syncData);
      }
      
      const checkoutResponse = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          isTrialCheckout: true, 
        }),
      });

      const checkoutData = await checkoutResponse.json();
      
      if (checkoutResponse.ok && checkoutData.url) {
        console.log('✅ Redirecting to Stripe checkout for trial setup');
        window.location.href = checkoutData.url;
      } else {
        console.error('Failed to create checkout session:', checkoutData);
        alert('Failed to start trial. Please try again from the dashboard.');
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start trial. Please try again from the dashboard.');
      router.replace('/dashboard');
    }
  }, [user, router, fullName]);

  const redirectAfterRegistration = useCallback(() => {
    redirectToStripeCheckout();
  }, [redirectToStripeCheckout]);

  useEffect(() => {
    const isOAuthCallback = typeof window !== 'undefined' && window.location.search.includes('code=');
    
    if (!authLoading && user && !isOAuthCallback) {
      const timer = setTimeout(() => redirectAfterRegistration(), 100);
      return () => clearTimeout(timer);
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [user, authLoading, redirectAfterRegistration]);


  const handleGoogleSignUp = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google sign up failed');
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName) {
      setError('Please enter your full name');
      return;
    }

    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (!isDevelopment) {
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const turnstileToken = formData.get('cf-turnstile-response') as string;
        
        if (!turnstileToken) {
          setError('Please complete the security verification');
          setIsLoading(false);
          return;
        }

        const verifyResponse = await fetch('/api/verify-turnstile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 'cf-turnstile-response': turnstileToken }),
        });

        if (!verifyResponse.ok) {
          throw new Error('Verification failed');
        }

        const verifyResult = await verifyResponse.json();

        if (!verifyResult.success) {
          setError('Security verification failed. Please try again.');
          setIsLoading(false);
          return;
        }
      } else {
        console.log('[Register] Development mode - skipping Turnstile verification');
      }

      const { data, error: signUpError } = await signUpWithEmail(email, password);
      if (signUpError) throw signUpError;
      
      if (data?.user && !data.user.email_confirmed_at) {
        router.replace(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      
      redirectAfterRegistration();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (showWelcome) {
    const isDark = resolvedTheme === 'dark';
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDark ? 'bg-linear-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-linear-to-br from-purple-50 via-white to-blue-50'}`}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`text-3xl font-bold mb-3 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
            Almost There! 🚀
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className={`mb-6 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Redirecting to payment setup for your 7-day free trial...
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className={`flex items-center justify-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            <div className={`animate-spin rounded-full h-5 w-5 border-2 ${isDark ? 'border-slate-600 border-t-blue-400' : 'border-gray-200 border-t-blue-600'}`}></div>
            <span className="text-sm">Preparing checkout...</span>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className={`text-xs mt-4 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
            You won&apos;t be charged during the trial period
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (isLoading || authLoading) {
    const isDark = resolvedTheme === 'dark';
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-linear-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-linear-to-br from-purple-50 via-white to-blue-50'}`}>
        <div className="relative mb-6">
          <div className={`animate-spin rounded-full h-16 w-16 border-4 ${isDark ? 'border-slate-600 border-t-blue-400' : 'border-gray-200 border-t-blue-600'}`}></div>
          <div className={`absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent ${isDark ? 'border-r-purple-400' : 'border-r-purple-600'} animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
        <div className={`text-xl font-semibold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Setting up your account...</div>
        <div className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Preparing your trial setup</div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${resolvedTheme === 'dark' ? 'bg-linear-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-linear-to-br from-purple-50 via-white to-blue-50'}`}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${resolvedTheme === 'dark' ? 'text-slate-100' : 'text-gray-900'}`}>Start Your Free Trial</h1>
            <p className={resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Create your account and get instant access</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-xl p-6 mb-6 border ${resolvedTheme === 'dark' ? 'bg-linear-to-br from-slate-800 to-slate-700 border-slate-600' : 'bg-linear-to-br from-blue-50 to-purple-50 border-blue-200'}`}
          >
            <h3 className={`font-semibold mb-3 flex items-center gap-2 ${resolvedTheme === 'dark' ? 'text-slate-100' : 'text-gray-900'}`}>
              <Zap className={`w-5 h-5 ${resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              What you&apos;ll get:
            </h3>
            <ul className="space-y-2">
              {['7-day free trial', 'Unlimited posts', 'AI caption generation', 'Multi-platform support', 'Analytics dashboard'].map((benefit, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`flex items-start gap-2 text-sm ${resolvedTheme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}
                >
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${resolvedTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`rounded-xl shadow-xl p-8 ${resolvedTheme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}
          >
            <button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 px-6 py-3 border-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4 ${
                resolvedTheme === 'dark'
                  ? 'border-slate-600 hover:border-slate-500 hover:bg-slate-700 text-slate-200'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium">Continue with Google</span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${resolvedTheme === 'dark' ? 'border-slate-600' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 ${resolvedTheme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-white text-gray-500'}`}>Or sign up with email</span>
              </div>
            </div>

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <label htmlFor="fullName" className={`block text-sm font-medium mb-1 ${resolvedTheme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>Full Name</label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isLoading}
                  className={`w-full ${resolvedTheme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400' : ''}`}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-1 ${resolvedTheme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className={`w-full ${resolvedTheme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400' : ''}`}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-1 ${resolvedTheme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>Password</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                  className={`w-full ${resolvedTheme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400' : ''}`}
                  placeholder="Min. 6 characters"
                />
              </div>

              <div>
                {process.env.NODE_ENV === 'development' ? (
                  <div className={`p-3 border rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                    <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>🔧 Development Mode - Captcha Disabled</p>
                  </div>
                ) : process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
                  <>
                    <div className="flex justify-center">
                      <div
                        className="cf-turnstile"
                        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                        data-callback="onTurnstileCallback"
                      ></div>
                    </div>
                  </>
                ) : (
                  <div className={`p-3 border rounded-lg ${resolvedTheme === 'dark' ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}`}>
                    <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>Turnstile site key not configured</p>
                  </div>
                )}
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 border rounded-lg ${resolvedTheme === 'dark' ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'}`}>
                  <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <p className={`text-xs text-center mt-4 ${resolvedTheme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>

            <div className={`text-center mt-6 pt-6 border-t ${resolvedTheme === 'dark' ? 'border-slate-600' : 'border-gray-200'}`}>
              <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                Already have an account?{' '}
                <button onClick={() => router.push('/login')} className={`font-medium ${resolvedTheme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                  Sign in
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
