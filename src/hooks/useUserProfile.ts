'use client';

import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  id: string;
  user_id: string;
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

export function useUserProfile() {
  const { userProfile, isLoading, supabase, user, refreshUserData } = useAuth();

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    console.log('[useUserProfile] Updating profile with:', updates);

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('[useUserProfile] Database error:', error);
        throw error;
      }

      console.log('[useUserProfile] Update successful:', data);
      await refreshUserData();
      
      return data;
    } catch (err) {
      console.error('[useUserProfile] Update error:', err);
      throw err;
    }
  };

  return {
    profile: userProfile,
    isLoading,
    error: null,
    updateProfile,
    refreshProfile: refreshUserData
  };
}

