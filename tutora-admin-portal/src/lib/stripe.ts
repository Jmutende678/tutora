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
  baseUsers: number
  additionalUserPrice: number
  popular?: boolean
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
    monthlyPrice: 89,
    annualPrice: 75, // 15% discount
    baseUsers: 10,
    additionalUserPrice: 8,
    features: [
      'Up to 10 team members (additional users $8/month)',
      '10 AI-generated modules per month',
      'Basic analytics & reporting',
      'Email support',
      'Mobile app access',
      'Basic quiz & assessment tools'
    ],
    maxUsers: 10,
    maxModules: 10,
    priority: 'basic',
    stripeProductId: 'prod_starter',
    stripeMonthlyPriceId: 'price_starter_monthly',
    stripeAnnualPriceId: 'price_starter_annual'
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 299,
    annualPrice: 249, // 17% discount
    baseUsers: 25,
    additionalUserPrice: 12,
    popular: true,
    features: [
      'Up to 25 team members (additional users $12/month)',
      'Unlimited AI-generated modules',
      'Advanced analytics & insights',
      'Priority support',
      'Custom branding',
      'Advanced quiz & certification',
      'API access',
      'Custom learning paths',
      'Progress tracking & reporting'
    ],
    maxUsers: 25,
    maxModules: -1,
    priority: 'premium',
    stripeProductId: 'prod_growth',
    stripeMonthlyPriceId: 'price_growth_monthly',
    stripeAnnualPriceId: 'price_growth_annual'
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 699,
    annualPrice: 599, // 14% discount
    baseUsers: 50,
    additionalUserPrice: 14,
    features: [
      'Up to 50 team members (additional users $14/month)',
      'Unlimited AI-generated modules',
      'Advanced AI features & customization',
      'Priority support',
      'Custom branding & white-label options',
      'SSO integration',
      'Advanced security features',
      'API access',
      'Custom integrations',
      'Advanced analytics & reporting'
    ],
    maxUsers: 50,
    maxModules: -1,
    priority: 'enterprise',
    stripeProductId: 'prod_professional',
    stripeMonthlyPriceId: 'price_professional_monthly',
    stripeAnnualPriceId: 'price_professional_annual'
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 1999,
    annualPrice: 1699, // 15% discount
    baseUsers: 100,
    additionalUserPrice: 20,
    features: [
      'Up to 100 team members (additional users $20/month)',
      'Unlimited AI-generated modules',
      'Advanced AI features & customization',
      'White-label solution',
      '24/7 dedicated support',
      'Custom integrations',
      'Advanced security features',
      'SLA guarantees',
      'Custom deployment options',
      'Dedicated account manager',
      'Custom contracts for 200+ users'
    ],
    maxUsers: 100,
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

    // Calculate bundle pricing based on base users + additional users
    const basePrice = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice
    const effectiveUserCount = userCount || plan.baseUsers
    
    let totalPrice = basePrice
    
    // Add additional user costs if exceeding base users
    if (effectiveUserCount > plan.baseUsers) {
      const additionalUsers = effectiveUserCount - plan.baseUsers
      totalPrice += (additionalUsers * plan.additionalUserPrice)
    }
    
    // For annual billing, multiply by 12
    const unitAmount = billingCycle === 'annual' 
      ? totalPrice * 12 * 100 // Convert to cents and multiply by 12 for annual payment
      : totalPrice * 100 // Convert to cents for monthly payment

    const interval = billingCycle === 'annual' ? 'year' : 'month'

    console.log('Bundle pricing calculation:', {
      planId,
      basePrice,
      effectiveUserCount,
      baseUsers: plan.baseUsers,
      additionalUserPrice: plan.additionalUserPrice,
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
          basePrice: basePrice.toString(),
          totalMonthlyPrice: totalPrice.toString(),
          pricingModel: 'bundle',
          ...metadata
        },
        subscription_data: {
          trial_period_days: 14,
          metadata: {
            planId,
            billingCycle,
            userCount: effectiveUserCount.toString(),
            basePrice: basePrice.toString(),
            totalMonthlyPrice: totalPrice.toString(),
            pricingModel: 'bundle',
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
        ui_mode: 'hosted',
        custom_text: {
          submit: {
            message: 'Start your 14-day free trial today!'
          }
        },
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