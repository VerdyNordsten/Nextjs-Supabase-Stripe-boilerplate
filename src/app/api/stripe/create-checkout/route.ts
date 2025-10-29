import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    console.log('[Stripe API] Creating checkout session...');
    
    const { userId, email, isTrialCheckout = false } = await request.json();

    if (!userId || !email) {
      console.error('[Stripe API] Missing required fields:', { userId, email });
      return NextResponse.json(
        { error: 'Missing required fields: userId and email are required' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('[Stripe API] STRIPE_SECRET_KEY is not set');
      return NextResponse.json(
        { error: 'Stripe is not configured. Missing STRIPE_SECRET_KEY.' },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_PRICE_ID) {
      console.error('[Stripe API] STRIPE_PRICE_ID is not set');
      return NextResponse.json(
        { error: 'Stripe is not configured. Missing STRIPE_PRICE_ID.' },
        { status: 500 }
      );
    }

    console.log('[Stripe API] Using Price ID:', process.env.STRIPE_PRICE_ID);
    console.log('[Stripe API] App URL:', process.env.NEXT_PUBLIC_APP_URL);
    console.log('[Stripe API] Is Trial Checkout:', isTrialCheckout);

    const subscriptionData: Stripe.Checkout.SessionCreateParams['subscription_data'] = {
      metadata: {
        user_id: userId,
      },
    };

    if (isTrialCheckout) {
      subscriptionData.trial_period_days = 7;
      subscriptionData.trial_settings = {
        end_behavior: {
          missing_payment_method: 'cancel',
        },
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: email,
      client_reference_id: userId,
      metadata: {
        user_id: userId,
        is_trial: isTrialCheckout ? 'true' : 'false',
      },
      success_url: isTrialCheckout 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?trial=started`
        : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?payment=success&tab=subscription`,
      cancel_url: isTrialCheckout
        ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?trial=canceled`
        : `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
      payment_method_collection: 'always',
      subscription_data: subscriptionData,
    });

    console.log('[Stripe API] Checkout session created:', session.id);
    console.log('[Stripe API] Checkout URL:', session.url);

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('[Stripe API] Error creating checkout session:', error);
    
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }
    
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

