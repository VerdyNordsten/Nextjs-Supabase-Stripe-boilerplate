'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabaseBrowser as supabase } from '@/utils/supabase-browser';
import {
  Session,
  User,
  SupabaseClient
} from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  user_id: string;
  email?: string;
  full_name: string | null;
  avatar_url: string | null;
  timezone: string | null;
  login_type: string | null;
  email_unsubscribed: boolean;
  referral_source: string | null;
  badges: string[] | null;
  feedbacks: string | null;
  profile_image_key: string | null;
  stripe_customer_id: string | null;
  current_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  cancel_at_period_end: boolean;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export type PlanStatus = 'free' | 'trial' | 'pro' | 'loading';

interface SessionData {
  user_profiles: {
    id: string;
    email: string;
    fullName: string | null;
    loginType: string | null;
  } | null;
  accessToken: string | null;
  expires: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  subscription: Subscription | null;
  planStatus: PlanStatus;
  isLoading: boolean;
  supabase: SupabaseClient;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{
    user: User | null;
    session: Session | null;
  }>;
  signOut: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<{ 
    data: { user: User | null } | null; 
    error: Error | null;
  }>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isSubscriber: boolean;
  getSessionData: () => Promise<SessionData>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [planStatus, setPlanStatus] = useState<PlanStatus>('loading');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscriber, setIsSubscriber] = useState(false);

  const fetchAllUserData = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_user_data');
      if (error) {
        console.error('[AuthContext] ❌ RPC error:', error);
        setUserProfile(null);
        setSubscription(null);
        setPlanStatus('free');
        setIsSubscriber(false);
        return;
      }

      if (data) {
        setUserProfile(data.profile);
        setSubscription(data.subscription);
        setPlanStatus(data.planStatus || 'free');
        setIsSubscriber(data.isSubscriber || false);
      }
    } catch (error) {
      console.error('[AuthContext] ❌ Fetch error:', error);
      setUserProfile(null);
      setSubscription(null);
      setPlanStatus('free');
      setIsSubscriber(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;
    
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !mounted) {
          setIsLoading(false);
          return;
        }

        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await fetchAllUserData();
        }
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            if (!mounted) return;
            
            const isLoggingOut = typeof window !== 'undefined' && sessionStorage.getItem('logging-out') === 'true';

            if (isLoggingOut && _event === 'SIGNED_OUT') {
              return;
            }
            
            console.log('[AuthContext] Auth state change:', _event, 'has session:', !!newSession);
            
            const newUser = newSession?.user ?? null;
            setSession(newSession);
            setUser(newUser);
            
            if (newUser) {
              await fetchAllUserData();
              
              if (isLoggingOut && typeof window !== 'undefined') {
                sessionStorage.removeItem('logging-out');
              }
            } else {
              setIsSubscriber(false);
              setUserProfile(null);
              setSubscription(null);
              setPlanStatus('free');
              
              if (_event === 'TOKEN_REFRESHED' && isLoggingOut) {
                console.log('[AuthContext] Session expired during logout');
              }
              
              if (_event === 'SIGNED_OUT' || _event === 'TOKEN_REFRESHED') {
                console.log('[AuthContext] User signed out or session expired');
              }
            }
          }
        );

        authSubscription = subscription;
        
        if (mounted) setIsLoading(false);
      } catch (error) {
        console.error("[AuthContext] Auth initialization error:", error);
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [fetchAllUserData]);

  const getSessionData = useCallback(async (): Promise<SessionData> => {

    const { data: rpcData, error } = await supabase.rpc('get_session_data');

    if (error) {
      console.error('[AuthContext] ❌ RPC error:', error);
      throw error;
    }

    const sessionData: SessionData = {
      user_profiles: rpcData?.user ? {
        id: rpcData.user.id,
        email: rpcData.user.email,
        fullName: rpcData.user.fullName,
        loginType: rpcData.user.loginType
      } : null,
      accessToken: rpcData?.accessToken || null,
      expires: rpcData?.expiresAt || null
    };

    return sessionData;
  }, []);

  const refreshUserData = useCallback(async () => {
    if (user?.id) {
      await fetchAllUserData();
    }
  }, [user, fetchAllUserData]);

  const value = {
    user,
    session,
    userProfile,
    subscription,
    planStatus,
    isLoading,
    supabase,
    signInWithGoogle: async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const hasPayment = urlParams.get('payment') === 'true';
        const isRegisterPage = window.location.pathname === '/register';
        const redirectToSubscription = urlParams.get('redirect_to_subscription') === 'true';
        
        let redirectTo = `${window.location.origin}/auth/callback`;
        const params = new URLSearchParams();
        
        if (isRegisterPage) {
          params.set('signup', 'true');
          if (redirectToSubscription) {
            params.set('redirect_to_subscription', 'true');
          }
        } else if (hasPayment) {
          params.set('payment', 'true');
        }
        
        if (params.toString()) {
          redirectTo += `?${params.toString()}`;
        }
        
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            skipBrowserRedirect: false,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });
        
        if (error) {
          console.error('Google sign in error:', error);
          throw error;
        }
      } catch (error) {
        console.error('Google sign in error:', error);
        throw error;
      }
    },
    signInWithEmail: async (email: string, password: string) => {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) throw authError;

      const { data: profile } = await supabase
        .from('users')
        .select('is_deleted, deleted_at')
        .eq('id', authData.user?.id)
        .single();

      if (profile?.is_deleted) {
        await supabase
          .from('users')
          .update({ 
            is_deleted: false, 
            deleted_at: null,
            reactivated_at: new Date().toISOString() 
          })
          .eq('id', authData.user?.id);
      }

      try {
        await supabase.rpc('sync_user_on_signup', {
          p_user_id: authData.user.id,
          p_email: authData.user.email,
          p_full_name: authData.user.user_metadata?.full_name ?? authData.user.user_metadata?.name ?? null,
          p_avatar_url: authData.user.user_metadata?.avatar_url ?? authData.user.user_metadata?.picture ?? null,
          p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
          p_login_type: (authData.user.app_metadata?.provider ?? 'EMAIL').toUpperCase(),
          p_stripe_customer_id: null
        });
      } catch (syncError) {
        console.error('Failed to sync user data on sign in:', syncError);
      }

      return authData;
    },
    signOut: async () => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('logging-out', 'true');
      }
      
      setSession(null);
      setUser(null);
      setUserProfile(null);
      setIsSubscriber(false);
      
      try {
        const signOutPromise = supabase.auth.signOut({ scope: 'global' });
        
        await Promise.race([
          signOutPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Sign out timeout')), 3000)
          )
        ]);
      } catch (err) {
        console.log('[AuthContext] Sign out completed (may have been expired):', err);
      }
      
      try {
        const clearCookie = (name: string) => {
          const domains = [
            '',
            window.location.hostname,
            `.${window.location.hostname}`
          ];
          const paths = ['/', '/auth', '/dashboard'];
          
          domains.forEach(domain => {
            paths.forEach(path => {
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain ? '; domain=' + domain : ''};`;
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain ? '; domain=' + domain : ''}; SameSite=Lax;`;
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain ? '; domain=' + domain : ''}; SameSite=Strict;`;
            });
          });
        };
        
        if (typeof document !== 'undefined') {
          const cookies = document.cookie.split(';');
          cookies.forEach(cookie => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            if (name) {
              clearCookie(name);
            }
          });
          
          const supabaseCookies = [
            'sb-auth-token',
            'sb-access-token',
            'sb-refresh-token',
            'supabase.auth.token',
            'supabase.auth.refresh-token'
          ];
          
          supabaseCookies.forEach(clearCookie);
        }
        
        if (typeof localStorage !== 'undefined') {
          localStorage.clear();
        }
        
        if (typeof sessionStorage !== 'undefined') {
          const loggingOut = sessionStorage.getItem('logging-out');
          sessionStorage.clear();
          if (loggingOut) {
            sessionStorage.setItem('logging-out', loggingOut);
          }
        }
      } catch (err) {
        console.error('Storage clear error:', err);
      }
      
      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
    },
    signUpWithEmail: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;

      if (data?.user) {
        try {
          await supabase.rpc('sync_user_on_signup', {
            p_user_id: data.user.id,
            p_email: data.user.email,
            p_full_name: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null,
            p_avatar_url: data.user.user_metadata?.avatar_url ?? data.user.user_metadata?.picture ?? null,
            p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
            p_login_type: (data.user.app_metadata?.provider ?? 'EMAIL').toUpperCase(),
            p_stripe_customer_id: null
          });
        } catch (syncError) {
          console.error('Failed to sync user data:', syncError);
        }
      }

      return { data, error };
    },
    updatePassword: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    },
    updateEmail: async (newEmail: string) => {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });
      if (error) throw error;
    },
    resetPassword: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`
      });
      if (error) throw error;
    },
    deleteAccount: async () => {
      const { error: dataError } = await supabase
        .from('users')
        .delete()
        .eq('id', user?.id);
      
      if (dataError) throw dataError;

      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user?.id);

      if (subscriptionError) throw subscriptionError;

      const { error: authError } = await supabase.auth.admin.deleteUser(
        user?.id as string
      );

      if (authError) throw authError;

      await supabase.auth.signOut();
    },
    isSubscriber,
    getSessionData,
    refreshUserData,
  };

  useEffect(() => {
    if (!user?.id) return;
    
    const channel = supabase
      .channel(`user_data_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('[AuthContext] 🔄 Profile updated:', payload);
          await fetchAllUserData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('[AuthContext] 🔄 Subscription updated:', payload);
          await fetchAllUserData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchAllUserData]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 