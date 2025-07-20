import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export interface PricingPlan {
  id: string
  name: string
  monthlyPrice: number
  annualPrice: number
  features: string[]
  maxUsers: number
  maxModules: number
  priority: 'basic' | 'premium' | 'enterprise'
  stripeProductId?: string
  stripeMonthlyPriceId?: string
  stripeAnnualPriceId?: string
}

export const PRICING_PLANS: Record<string, PricingPlan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 12,
    annualPrice: 10,
    features: [
      'Up to 25 users',
      '5 AI-generated modules per month',
      'Basic analytics & reporting',
      'Email support',
      'Mobile app access',
      'Basic quiz & assessment tools'
    ],
    maxUsers: 25,
    maxModules: 5,
    priority: 'basic',
    stripeProductId: 'prod_starter',
    stripeMonthlyPriceId: 'price_starter_monthly',
    stripeAnnualPriceId: 'price_starter_annual'
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 29,
    annualPrice: 24,
    features: [
      'Up to 100 users',
      'Unlimited AI-generated modules',
      'Advanced analytics & insights',
      'Priority support',
      'Custom branding',
      'Advanced quiz & certification',
      'API access',
      'Custom learning paths',
      'Progress tracking & reporting'
    ],
    maxUsers: 100,
    maxModules: -1,
    priority: 'premium',
    stripeProductId: 'prod_professional',
    stripeMonthlyPriceId: 'price_professional_monthly',
    stripeAnnualPriceId: 'price_professional_annual'
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 79,
    annualPrice: 65,
    features: [
      'Unlimited users',
      'Unlimited AI-generated modules',
      'Advanced AI features & customization',
      'White-label solution',
      '24/7 dedicated support',
      'Custom integrations',
      'Advanced security features',
      'SLA guarantees',
      'Custom deployment options',
      'Dedicated account manager'
    ],
    maxUsers: -1,
    maxModules: -1,
    priority: 'enterprise',
    stripeProductId: 'prod_enterprise',
    stripeMonthlyPriceId: 'price_enterprise_monthly',
    stripeAnnualPriceId: 'price_enterprise_annual'
  }
}

export class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = stripe
  }

  async createCheckoutSession(
    planId: string,
    billingCycle: 'monthly' | 'annual',
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>,
    userCount?: number
  ) {
    const plan = PRICING_PLANS[planId]
    if (!plan) {
      throw new Error('Invalid plan ID')
    }

    // Calculate dynamic pricing based on user count
    const effectiveUserCount = userCount || 1
    const perUserPrice = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice
    const totalPrice = perUserPrice * effectiveUserCount
    
    // For annual billing, we charge the full year upfront (perUserPrice * userCount * 12 months)
    // For monthly billing, we charge per month (perUserPrice * userCount)
    const unitAmount = billingCycle === 'annual' 
      ? totalPrice * 12 * 100 // Convert to cents and multiply by 12 for annual payment
      : totalPrice * 100 // Convert to cents for monthly payment

    const interval = billingCycle === 'annual' ? 'year' : 'month'

    console.log('Pricing calculation:', {
      planId,
      perUserPrice,
      effectiveUserCount,
      totalPrice,
      unitAmount: unitAmount / 100,
      billingCycle
    })

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Tutora ${plan.name} Plan`,
                description: `${plan.features.slice(0, 3).join(', ')} and more... (${effectiveUserCount} users)`,
                images: ['https://tutoralearn.com/logo.png'],
              },
              unit_amount: unitAmount,
              recurring: {
                interval: interval,
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
          billingCycle,
          userCount: effectiveUserCount.toString(),
          totalMonthlyPrice: totalPrice.toString(),
          ...metadata
        },
        subscription_data: {
          trial_period_days: 14,
          metadata: {
            planId,
            billingCycle,
            userCount: effectiveUserCount.toString(),
            totalMonthlyPrice: totalPrice.toString(),
            ...metadata
          }
        },
        billing_address_collection: 'required',
        tax_id_collection: {
          enabled: true,
        },
        allow_promotion_codes: true,
        automatic_tax: {
          enabled: true,
        },
        // Custom appearance for better readability
        ui_mode: 'hosted',
        custom_text: {
          submit: {
            message: 'Start your 14-day free trial today!'
          }
        },
        // Improve appearance and readability
        locale: 'en',
        phone_number_collection: {
          enabled: true
        }
      })

      return session
    } catch (error: any) {
      console.error('Stripe session creation error:', error)
      throw new Error(`Failed to create checkout session: ${error.message}`)
    }
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
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return session
  }

  async getSubscription(subscriptionId: string) {
    return await this.stripe.subscriptions.retrieve(subscriptionId)
  }

  async updateSubscription(subscriptionId: string, planId: string) {
    const plan = PRICING_PLANS[planId]
    if (!plan) {
      throw new Error('Invalid plan ID')
    }

    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)
    
          // Create a new price for the subscription update
      const price = await this.stripe.prices.create({
        currency: 'usd',
        unit_amount: plan.monthlyPrice * 100,
        recurring: {
          interval: 'month',
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
    return this.stripe.webhooks.constructEvent(body, signature, webhookSecret)
  }

  async handleWebhookEvent(event: Stripe.Event) {
    console.log('Processing webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    console.log('Checkout completed:', session.id)
    // Handle successful checkout - create company, send welcome email, etc.
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    console.log('Subscription created:', subscription.id)
    // Handle new subscription
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    console.log('Subscription updated:', subscription.id)
    // Handle subscription changes
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    console.log('Subscription deleted:', subscription.id)
    // Handle subscription cancellation
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    console.log('Payment succeeded:', invoice.id)
    // Handle successful payment
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    console.log('Payment failed:', invoice.id)
    // Handle failed payment
  }
}

export const stripeService = new StripeService() 