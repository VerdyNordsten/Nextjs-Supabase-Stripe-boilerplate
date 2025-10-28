'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useAccessControl } from '@/hooks/useAccessControl';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/verify-email',
  '/reset-password',
  '/update-password',
  '/auth/callback',
  '/checkout'
];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const pathname = usePathname();
  const { hasAccess } = useAccessControl();

  // Prevent redirect conflicts during sign out
  useEffect(() => {
    const isLoggingOut = typeof window !== 'undefined' && sessionStorage.getItem('logging-out') === 'true';
    
    // If logging out, don't interfere with the logout process
    if (isLoggingOut) {
      return;
    }
    
    // Only redirect if not loading, no user, and on protected route
    if (!authLoading && !user && !PUBLIC_ROUTES.includes(pathname)) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      window.location.assign(redirectUrl);
    }
  }, [user, authLoading, pathname]);

  useEffect(() => {
    if (!authLoading && user) {
      const isDashboardRoute = pathname.startsWith('/dashboard');
      if (isDashboardRoute) {
      }
    }
  }, [user, authLoading, hasAccess, pathname]);
  
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      sessionStorage.removeItem('logging-out');
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col space-y-4 items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-r-purple-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
        <div className="text-gray-700 font-medium">Loading...</div>
      </div>
    );
  }

  if (PUBLIC_ROUTES.includes(pathname) || user) {
    return <>{children}</>;
  }

  return null;
}