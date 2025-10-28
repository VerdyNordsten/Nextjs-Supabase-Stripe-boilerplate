export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    lateApiUrl: process.env.LATE_API_URL || 'https://api.late.com',
    openaiApiUrl: process.env.OPENAI_API_URL || 'https://api.openai.com/v1',
    endpoints: {
      auth: {
        login: '/auth/login',
        signup: '/auth/signup',
        logout: '/auth/logout',
        callback: '/auth/callback',
      },
      user: {
        profile: '/api/user/profile',
        preferences: '/api/user/preferences',
        delete: '/api/user/delete',
      },
      social: {
        accounts: '/api/social/accounts',
        connect: '/api/social/connect',
        disconnect: '/api/social/disconnect',
        post: '/api/social/post',
        schedule: '/api/social/schedule',
      },
      ai: {
        generateCaption: '/api/ai/generate-caption',
        analyzeContent: '/api/ai/analyze-content',
      },
      media: {
        upload: '/api/media/upload',
        library: '/api/media/library',
        delete: '/api/media/delete',
      },
      subscription: {
        checkout: '/api/stripe/checkout',
        webhook: '/api/stripe/webhook',
        cancel: '/api/stripe/cancel',
        reactivate: '/api/stripe/reactivate',
        sync: '/api/stripe/sync',
      },
      dashboard: {
        calendar: '/api/dashboard/calendar',
        analytics: '/api/dashboard/analytics',
        scheduled: '/api/dashboard/scheduled',
      },
    },
  } as const;
  
export const getApiUrl = (endpoint: string) =>
  `${API_CONFIG.baseUrl}${endpoint}`;

export const getLateApiUrl = (endpoint: string) =>
  `${API_CONFIG.lateApiUrl}${endpoint}`;

export const getOpenaiApiUrl = (endpoint: string) =>
  `${API_CONFIG.openaiApiUrl}${endpoint}`;
  
