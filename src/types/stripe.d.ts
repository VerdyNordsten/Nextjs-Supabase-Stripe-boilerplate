import Stripe from 'stripe';

declare namespace JSX {
  interface IntrinsicElements {
    'stripe-buy-button': {
      'buy-button-id': string;
      'publishable-key': string;
    }
  }
}

export type StripeCheckoutSession = Stripe.Checkout.Session;
export type StripeEvent = Stripe.Event; 