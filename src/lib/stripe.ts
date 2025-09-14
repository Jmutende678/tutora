import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null;

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    interval: 'month',
    features: [
      'Up to 50 users',
      '10 training modules',
      'Basic analytics',
      'Email support',
      'Mobile app access',
      '5GB storage'
    ],
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    interval: 'month',
    features: [
      'Up to 200 users',
      '50 training modules',
      'Advanced analytics & reporting',
      'Priority support',
      'Custom branding',
      '25GB storage',
      'API access',
      'Integrations (Slack, Teams)'
    ],
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'price_professional'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    features: [
      'Unlimited users',
      'Unlimited modules',
      'White-label solution',
      'Dedicated account manager',
      'Custom integrations',
      '100GB+ storage',
      'SSO & advanced security',
      'On-premise deployment option'
    ],
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise'
  }
];

export async function createCheckoutSession(
  planId: string,
  customerEmail: string,
  companyId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const plan = pricingPlans.find(p => p.id === planId);
  if (!plan) {
    throw new Error('Invalid plan ID');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    customer_email: customerEmail,
    metadata: {
      company_id: companyId,
      plan_id: planId,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    subscription_data: {
      metadata: {
        company_id: companyId,
        plan_id: planId,
      },
    },
  });

  return session;
}

export async function createCustomer(
  email: string,
  name: string,
  companyName?: string
): Promise<Stripe.Customer> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      company_name: companyName || '',
    },
  });

  return customer;
}

export async function getCustomer(customerId: string): Promise<Stripe.Customer | null> {
  if (!stripe) {
    return null;
  }

  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer as Stripe.Customer;
  } catch (error) {
    console.error('Error retrieving customer:', error);
    return null;
  }
}

export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
  if (!stripe) {
    return null;
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return null;
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });

  return updatedSubscription;
}

export async function constructWebhookEvent(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('Stripe webhook secret not configured');
  }

  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  return event;
}

export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  const { supabase } = await import('./supabase');

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const companyId = session.metadata?.company_id;
      const planId = session.metadata?.plan_id;

      if (companyId && planId) {
        // Update company plan
        await supabase
          .from('companies')
          .update({
            plan: planId,
            stripe_customer_id: session.customer as string,
            updated_at: new Date().toISOString()
          })
          .eq('id', companyId);

        console.log(`Company ${companyId} upgraded to ${planId}`);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const companyId = subscription.metadata?.company_id;

      if (companyId) {
        const status = subscription.status === 'active' ? 'active' : 'inactive';
        
        await supabase
          .from('companies')
          .update({
            status: status,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', subscription.customer as string);

        console.log(`Subscription updated for company ${companyId}: ${status}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      
      await supabase
        .from('companies')
        .update({
          plan: 'starter',
          status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_customer_id', subscription.customer as string);

      console.log(`Subscription cancelled for customer ${subscription.customer}`);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      
      await supabase
        .from('companies')
        .update({
          status: 'suspended',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_customer_id', invoice.customer as string);

      console.log(`Payment failed for customer ${invoice.customer}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

export { stripe };
