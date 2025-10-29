import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  console.log('AuthCallback: Processing callback for URL:', requestUrl.toString());
  
  const code = requestUrl.searchParams.get('code');
  const error_code = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');
  const next = requestUrl.searchParams.get('next');
  const payment = requestUrl.searchParams.get('payment');
  const isSignup = requestUrl.searchParams.get('signup') === 'true';
  const redirectToSubscription = requestUrl.searchParams.get('redirect_to_subscription') === 'true';

  if (error_code) {
    console.error('AuthCallback: OAuth error:', error_code, error_description);
    return NextResponse.redirect(
      new URL(`/login?error=${error_code}&description=${encodeURIComponent(error_description || '')}`, requestUrl.origin)
    );
  }

  if (code) {
    console.log('AuthCallback: Code received, exchanging for session');
    
    try {
      const cookieStore = await cookies();
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) => {
                  cookieStore.set(name, value, options);
                });
              } catch (error) {
                console.warn('AuthCallback: Could not set cookies:', error);
              }
            },
          },
        }
      );
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('AuthCallback: Exchange error:', error.message);
        console.error('AuthCallback: Error details:', error);
        return NextResponse.redirect(new URL(`/login?error=auth-failed&message=${encodeURIComponent(error.message)}`, requestUrl.origin));
      }

      if (!data.session) {
        console.error('AuthCallback: No session returned from exchange');
        return NextResponse.redirect(new URL('/login?error=no-session', requestUrl.origin));
      }

      console.log('AuthCallback: Session established for user:', data.session.user.email);

      try {
        const user = data.session.user;
        await supabase.rpc('sync_user_on_signup', {
          p_user_id: user.id,
          p_email: user.email,
          p_full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
          p_avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
          p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
          p_login_type: (user.app_metadata?.provider ?? 'EMAIL').toUpperCase(),
          p_stripe_customer_id: null
        });
        console.log('AuthCallback: User data synced successfully');
      } catch (syncError) {
        console.error('AuthCallback: Failed to sync user data:', syncError);
      }

      let redirectUrl = next || '/dashboard';
      
      if (isSignup && redirectToSubscription) {
        redirectUrl = '/register?redirect_to_subscription=true';
        console.log('AuthCallback: Registration with subscription redirect, redirecting to register page');
      }
      else if (isSignup) {
        redirectUrl = '/dashboard/onboarding';
        console.log('AuthCallback: New registration detected, redirecting to onboarding');
      }
      else if (payment === 'true') {
        redirectUrl = '/checkout';
        console.log('AuthCallback: Payment flag detected, redirecting to checkout');
      }
      else {
        try {
          const { data: prefs } = await supabase
            .from('user_preferences')
            .select('has_completed_onboarding')
            .eq('user_id', data.session.user.id)
            .single();
          
          if (!prefs?.has_completed_onboarding) {
            redirectUrl = '/dashboard/onboarding';
            console.log('AuthCallback: Onboarding not completed, redirecting to onboarding');
          }
        } catch {
          console.log('AuthCallback: Could not check onboarding status, defaulting to dashboard');
        }
      }
      
      console.log('AuthCallback: Redirecting to:', redirectUrl);
      
      const response = NextResponse.redirect(new URL(redirectUrl, requestUrl.origin));
      
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      
      return response;
    } catch (error) {
      console.error('AuthCallback: Unexpected error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.redirect(
        new URL(`/login?error=unexpected&message=${encodeURIComponent(errorMessage)}`, requestUrl.origin)
      );
    }
  }

  console.warn('AuthCallback: No code or error in URL, redirecting to login');
  console.warn('AuthCallback: Full URL was:', requestUrl.toString());
  return NextResponse.redirect(new URL('/login?error=missing-code', requestUrl.origin));
}