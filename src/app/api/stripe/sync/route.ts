import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/utils/supabase-admin';
import { withCors } from '@/utils/cors';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = withCors(async function POST(request: NextRequest) {
  try {
    console.log('Starting sync process...');
    const { subscriptionId } = await request.json();
    
    if (!subscriptionId) {
      console.error('No subscription ID provided');
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    const { data: existingSubscription, error: checkError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking subscription:', checkError);
      throw checkError;
    }

    if (!existingSubscription) {
      console.log('No existing subscription found, fetching from Stripe...');
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      const customerResponse = await stripe.customers.retrieve(stripeSubscription.customer as string);
      
      if (customerResponse.deleted) {
        console.error('Customer has been deleted:', stripeSubscription.customer);
        throw new Error('Invalid customer');
      }

      const customer = customerResponse as Stripe.Customer;
      const userId = customer.metadata?.user_id;

      if (!userId) {
        console.error('No user_id in customer metadata:', customer.id);
        throw new Error('No user_id found in customer metadata');
      }

      const { error: insertError } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: userId,
          stripe_customer_id: stripeSubscription.customer as string,
          stripe_subscription_id: subscriptionId,
          status: stripeSubscription.status,
          price_id: stripeSubscription.items.data[0]?.price.id,
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error creating subscription:', insertError);
        throw insertError;
      }
    } else {
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      const { error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: stripeSubscription.status,
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscriptionId);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        throw updateError;
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Subscription sync failed:', error);
    return NextResponse.json({ 
      error: 'Failed to sync subscription',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}); 