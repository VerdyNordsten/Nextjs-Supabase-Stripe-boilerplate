"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaBars } from 'react-icons/fa';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useTrialStatus } from '@/hooks/useTrialStatus';

interface NavigationProps {
  onStartTrial: () => void;
  isCreatingTrial: boolean;
}

export function Navigation({ onStartTrial, isCreatingTrial }: NavigationProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { subscription, isLoading: isLoadingSubscription } = useSubscription();
  const { isInTrial } = useTrialStatus();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsDropdownOpen(false);
      await new Promise(resolve => setTimeout(resolve, 300));
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
      alert('Failed to sign out. Please try again.');
    }
  };

  const shouldShowDashboardButton = !isLoadingSubscription && (subscription || isInTrial);
  const shouldShowSubscriptionButton = !isLoadingSubscription && !isInTrial && (
    !subscription ||
    subscription.status === 'canceled' ||
    (subscription.cancel_at_period_end && new Date(subscription.current_period_end) > new Date())
  );

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/')}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              UptoPilot
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-700 hover:text-blue-600 transition font-medium">Features</a>
            <a href="#pricing" className="text-slate-700 hover:text-blue-600 transition font-medium">Pricing</a>
            
            {!user ? (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="text-slate-700 hover:text-blue-600 transition font-medium"
                >
                  Sign In
                </button>
                <motion.button
                  onClick={onStartTrial}
                  disabled={isCreatingTrial}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                  whileHover={{ scale: isCreatingTrial ? 1 : 1.05 }}
                  whileTap={{ scale: isCreatingTrial ? 1 : 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Start Free Trial
                </motion.button>
              </>
            ) : (
              <>
                {shouldShowDashboardButton && (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Go to Dashboard
                  </button>
                )}
                
                {shouldShowSubscriptionButton && (
                  <button
                    onClick={() => router.push('/dashboard/settings?tab=subscription')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    View Subscription
                  </button>
                )}

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-slate-200">
                      <div className="px-4 py-2 border-b border-slate-200">
                        <p className="text-sm font-medium text-slate-900">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push('/dashboard');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push('/dashboard/settings?tab=subscription');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        Profile & Subscription
                      </button>
                      <div className="border-t border-slate-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 disabled:opacity-50"
                      >
                        {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 transition"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-700" />
              ) : (
                <FaBars className="h-6 w-6 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-3">
            <a 
              href="#features" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Pricing
            </a>
            
            {!user ? (
              <>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push('/login');
                  }}
                  className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  Sign In
                </button>
                <motion.button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onStartTrial();
                  }}
                  disabled={isCreatingTrial}
                  className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                  whileHover={{ scale: isCreatingTrial ? 1 : 1.02 }}
                  whileTap={{ scale: isCreatingTrial ? 1 : 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Start Free Trial
                </motion.button>
              </>
            ) : (
              <>
                <div className="px-4 py-2 border-b border-slate-200">
                  <p className="text-sm font-medium text-slate-900">{user.email}</p>
                </div>
                {shouldShowDashboardButton && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push('/dashboard');
                    }}
                    className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
                  >
                    Go to Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push('/dashboard/settings?tab=subscription');
                  }}
                  className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  Profile & Subscription
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                >
                  {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}