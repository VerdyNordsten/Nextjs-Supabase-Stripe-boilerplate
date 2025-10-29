'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Script from 'next/script';

export default function LoginPage() {
  const { user, isLoading: authLoading, signInWithGoogle, signInWithEmail } = useAuth();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectUrl = searchParams.get('redirect');
  const shouldShowPayment = searchParams.get('payment') === 'true';

  const redirectAfterLogin = useCallback(() => {
    if (shouldShowPayment) {
      router.replace('/checkout');
    } else {
      router.replace(redirectUrl || '/dashboard');
    }
  }, [shouldShowPayment, redirectUrl, router]);

  useEffect(() => {
    const isLoggingOut = typeof window !== 'undefined' && sessionStorage.getItem('logging-out') === 'true';
    
    if (isLoggingOut) {
      sessionStorage.removeItem('logging-out');
      const cookiesToClear = [
        'sb-auth-token', 'sb-access-token', 'sb-refresh-token', 
        'supabase-auth-token', 'sb-gaysybqkjmrbrtaqgdwg-auth-token',
        'sb-gaysybqkjmrbrtaqgdwg-auth-token-code-verifier'
      ];
      
      cookiesToClear.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; max-age=0`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; max-age=0`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}; max-age=0`;
      });
      
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      setIsLoading(false);
      return;
    }
    
    const isOAuthCallback = window.location.search.includes('code=');
    
    if (!authLoading && user && !isOAuthCallback && !isLoggingOut) {
      const timer = setTimeout(() => redirectAfterLogin(), 100);
      return () => clearTimeout(timer);
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [user, authLoading, redirectAfterLogin]);


  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google sign in failed');
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password');
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
        console.log('[Login] Development mode - skipping Turnstile verification');
      }

      await signInWithEmail(email, password);
      redirectAfterLogin();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || authLoading) {
    const isDark = resolvedTheme === 'dark';
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-linear-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-linear-to-br from-purple-50 via-white to-blue-50'}`}>
        <div className="relative mb-6">
          <div className={`animate-spin rounded-full h-16 w-16 border-4 ${isDark ? 'border-slate-600 border-t-blue-400' : 'border-gray-200 border-t-blue-600'}`}></div>
          <div className={`absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent ${isDark ? 'border-r-purple-400' : 'border-r-purple-600'} animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
        <div className={`text-xl font-semibold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Signing you in...</div>
        <div className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Please wait a moment</div>
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
            <h1 className={`text-3xl font-bold mb-2 ${resolvedTheme === 'dark' ? 'text-slate-100' : 'text-gray-900'}`}>Welcome Back</h1>
            <p className={resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Sign in to access your account</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-xl p-6 mb-6 border ${resolvedTheme === 'dark' ? 'bg-linear-to-br from-slate-800 to-slate-700 border-slate-600' : 'bg-linear-to-br from-blue-50 to-purple-50 border-blue-200'}`}
          >
            <h3 className={`font-semibold mb-3 flex items-center gap-2 ${resolvedTheme === 'dark' ? 'text-slate-100' : 'text-gray-900'}`}>
              <Zap className={`w-5 h-5 ${resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              Why sign in:
            </h3>
            <ul className="space-y-2">
              {['Access your scheduled posts', 'AI-powered caption generation', 'Analytics dashboard', 'Connected accounts', 'Premium features'].map((benefit, i) => (
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
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 px-6 py-3 border-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4 ${
                resolvedTheme === 'dark'
                  ? 'border-slate-600 hover:border-slate-500 hover:bg-slate-700 text-slate-200'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Image src="/Google-Logo.png" alt="Google Logo" width={20} height={20} />
              <span className="font-medium">Continue with Google</span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${resolvedTheme === 'dark' ? 'border-slate-600' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 ${resolvedTheme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-white text-gray-500'}`}>Or sign in with email</span>
              </div>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-4">
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
                  disabled={isLoading}
                  className={`w-full ${resolvedTheme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400' : ''}`}
                  placeholder="Your password"
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

              <div className="flex items-center justify-between">
                <button type="button" onClick={() => router.push('/reset-password')} className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className={`text-center mt-6 pt-6 border-t ${resolvedTheme === 'dark' ? 'border-slate-600' : 'border-gray-200'}`}>
              <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                Don't have an account?{' '}
                <button onClick={() => router.push('/register')} className={`font-medium ${resolvedTheme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                  Sign up
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
