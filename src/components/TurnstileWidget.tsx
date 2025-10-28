'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, params?: TurnstileRenderParams) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string;
    };
  }
}

interface TurnstileRenderParams {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  tabindex?: number;
  'retry-interval'?: number;
  'refresh-expired'?: 'auto' | 'manual' | 'never';
  'retry-on-expired'?: 'auto' | 'manual' | 'never';
}

interface TurnstileWidgetProps {
  siteKey: string;
  onVerify?: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
}

export default function TurnstileWidget({ 
  siteKey, 
  onVerify, 
  onError, 
  onExpire,
  theme = 'auto' 
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const loadTurnstileScript = () => {
      if (document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
        return; 
      }

      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) {
        return;
      }

      try {
        const widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          'error-callback': onError,
          'expired-callback': onExpire,
          theme,
        });
        widgetIdRef.current = widgetId;
      } catch (error) {
        console.error('Turnstile render error:', error);
        if (onError) onError();
      }
    };

    loadTurnstileScript();

    if (window.turnstile) {
      renderWidget();
    } else {
      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval);
          renderWidget();
        }
      }, 100);

      setTimeout(() => clearInterval(checkInterval), 10000);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          console.error('Turnstile cleanup error:', e);
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onVerify, onError, onExpire, theme]);

  return <div className="flex justify-center"><div ref={containerRef} /></div>;
}