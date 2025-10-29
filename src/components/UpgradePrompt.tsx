'use client';

import { useRouter } from 'next/navigation';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Sparkles, ArrowRight } from 'lucide-react';

interface UpgradePromptProps {
  feature?: string;
  compact?: boolean;
}

export function UpgradePrompt({ feature = 'this feature', compact = false }: UpgradePromptProps) {
  const router = useRouter();
  const { isFreeUser, isTrialUser, getUpgradeMessage } = useFeatureAccess();

  if (!isFreeUser && !isTrialUser) return null;

  const message = getUpgradeMessage();

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <span className="text-sm text-gray-700">
          {isFreeUser ? 'Upgrade to unlock' : 'Trial active'}
        </span>
        <button
          onClick={() => router.push('/checkout')}
          className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Subscribe
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-blue-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {isFreeUser ? 'Unlock Premium Features' : 'Trial Active'}
          </h3>
          <p className="text-gray-600 mb-4">
            {message || `Subscribe to access ${feature} and all premium features.`}
          </p>
          <button
            onClick={() => router.push('/checkout')}
            className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Subscribe Now - $19/month
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


