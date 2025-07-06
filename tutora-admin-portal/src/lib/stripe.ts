import Stripe from 'stripe'
import { nanoid } from 'nanoid'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export interface PricingPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  maxUsers: number
  maxModules: number
  priority: 'basic' | 'premium' | 'enterprise'
  stripeProductId?: string
  stripePriceId?: string
}

export const PRICING_PLANS: Record<string, PricingPlan> = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 99,
    interval: 'month',
    features: [
      'Up to 50 users',
      'Basic training modules',
      'Progress tracking',
      'Email support',
      'Basic analytics'
    ],
    maxUsers: 50,
    maxModules: 10,
    priority: 'basic',
    stripePriceId: 'price_basic_monthly'
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 299,
    interval: 'month',
    features: [
      'Up to 200 users',
      'Advanced training modules',
      'Custom quizzes',
      'Advanced analytics',
      'Priority support',
      'Custom branding'
    ],
    maxUsers: 200,
    maxModules: 50,
    priority: 'premium',
    stripePriceId: 'price_premium_monthly'
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    interval: 'month',
    features: [
      'Unlimited users',
      'Custom training modules',
      'Advanced AI features',
      'White-label solution',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee'
    ],
    maxUsers: -1, // Unlimited
    maxModules: -1, // Unlimited
    priority: 'enterprise',
    stripePriceId: 'price_enterprise_monthly'
  }
}

export class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = stripe
  }

  async createCheckoutSession(
    planId: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>
  ) {
    const plan = PRICING_PLANS[planId]
    if (!plan) {
      throw new Error('Invalid plan ID')
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Tutora ${plan.name} Plan`,
              description: `${plan.features.join(', ')}`,
              images: ['https://tutora.com/logo.png'],
            },
            unit_amount: plan.price * 100,
            recurring: {
              interval: plan.interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planId,
        ...metadata
      },
      subscription_data: {
        metadata: {
          planId,
          ...metadata
        }
      },
      customer_creation: 'always',
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true,
      },
    })

    return session
  }

  async createCustomer(email: string, name: string, companyName: string) {
    const customer = await this.stripe.customers.create({
      email,
      name,
      metadata: {
        companyName,
        source: 'tutora_admin_portal'
      }
    })

    return customer
  }

  async createPortalSession(customerId: string, returnUrl: string) {
    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return portalSession
  }

  async getSubscription(subscriptionId: string) {
    return await this.stripe.subscriptions.retrieve(subscriptionId)
  }

  async updateSubscription(subscriptionId: string, planId: string) {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)
    const plan = PRICING_PLANS[planId]
    
    if (!plan) {
      throw new Error('Invalid plan ID')
    }

    // Create a new price for the subscription update
    const price = await this.stripe.prices.create({
      currency: 'usd',
      unit_amount: plan.price * 100,
      recurring: {
        interval: plan.interval,
      },
      product_data: {
        name: `Tutora ${plan.name} Plan`,
      },
    })

    return await this.stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: price.id,
        },
      ],
      metadata: {
        planId
      }
    })
  }

  async cancelSubscription(subscriptionId: string) {
    return await this.stripe.subscriptions.cancel(subscriptionId)
  }

  async getCustomer(customerId: string) {
    return await this.stripe.customers.retrieve(customerId)
  }

  async constructWebhookEvent(body: string, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    
    try {
      return this.stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err}`)
    }
  }

  async handleWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        return await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
      
      case 'customer.subscription.created':
        return await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription)
      
      case 'customer.subscription.updated':
        return await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
      
      case 'customer.subscription.deleted':
        return await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
      
      case 'invoice.payment_succeeded':
        return await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
      
      case 'invoice.payment_failed':
        return await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const { planId } = session.metadata!
    const plan = PRICING_PLANS[planId]
    
    // This will be handled by the webhook API route
    return {
      type: 'checkout_completed',
      customerId: session.customer,
      subscriptionId: session.subscription,
      planId,
      plan,
      session
    }
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    return {
      type: 'subscription_created',
      customerId: subscription.customer,
      subscriptionId: subscription.id,
      planId: subscription.metadata.planId,
      subscription
    }
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    return {
      type: 'subscription_updated',
      customerId: subscription.customer,
      subscriptionId: subscription.id,
      planId: subscription.metadata.planId,
      subscription
    }
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    return {
      type: 'subscription_deleted',
      customerId: subscription.customer,
      subscriptionId: subscription.id,
      planId: subscription.metadata.planId,
      subscription
    }
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    return {
      type: 'payment_succeeded',
      customerId: invoice.customer,
      subscriptionId: invoice.subscription,
      amount: invoice.amount_paid,
      invoice
    }
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    return {
      type: 'payment_failed',
      customerId: invoice.customer,
      subscriptionId: invoice.subscription,
      amount: invoice.amount_due,
      invoice
    }
  }
}

export const stripeService = new StripeService()
export default stripe 