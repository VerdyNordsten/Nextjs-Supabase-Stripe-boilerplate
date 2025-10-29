"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaBars } from 'react-icons/fa';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import ThemeToggle from '@/components/ThemeToggle';

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
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/')}
              className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              SaaS Templates
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground hover:text-primary transition font-medium">Features</a>
            <a href="#pricing" className="text-foreground hover:text-primary transition font-medium">Pricing</a>
            <a
              href="https://kreate.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-amber-600 transition font-medium flex items-center gap-1"
            >
              ☕ Buy Me Coffee
            </a>

            <ThemeToggle />

            {!user ? (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="text-foreground hover:text-primary transition font-medium"
                >
                  Sign In
                </button>
                <motion.button
                  onClick={onStartTrial}
                  disabled={isCreatingTrial}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50"
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
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
                  >
                    Go to Dashboard
                  </button>
                )}

                {shouldShowSubscriptionButton && (
                  <button
                    onClick={() => router.push('/dashboard/settings?tab=subscription')}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
                  >
                    View Subscription
                  </button>
                )}

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 hover:bg-muted px-3 py-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-popover rounded-lg shadow-xl py-2 border border-border">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-popover-foreground">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push('/dashboard');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push('/dashboard/settings?tab=subscription');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        Profile & Subscription
                      </button>
                      <div className="border-t border-border my-1"></div>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted disabled:opacity-50"
                      >
                        {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <FaBars className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition"
            >
              Pricing
            </a>
            <a
              href="https://kreate.gg/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition"
            >
              ☕ Buy Me Coffee
            </a>
            
            {!user ? (
              <>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push('/login');
                  }}
                  className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition"
                >
                  Sign In
                </button>
                <motion.button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onStartTrial();
                  }}
                  disabled={isCreatingTrial}
                  className="block w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50"
                  whileHover={{ scale: isCreatingTrial ? 1 : 1.02 }}
                  whileTap={{ scale: isCreatingTrial ? 1 : 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Start Free Trial
                </motion.button>
              </>
            ) : (
              <>
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-popover-foreground">{user.email}</p>
                </div>
                {shouldShowDashboardButton && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push('/dashboard');
                    }}
                    className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition"
                  >
                    Go to Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push('/dashboard/settings?tab=subscription');
                  }}
                  className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition"
                >
                  Profile & Subscription
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="block w-full text-left px-4 py-2 text-destructive hover:bg-muted rounded-lg transition disabled:opacity-50"
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