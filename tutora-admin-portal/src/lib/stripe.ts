import Stripe from 'stripe'

// Initialize Stripe with real API key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is required in environment variables')
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
  typescript: true,
})

console.log('✅ Stripe configured successfully with live keys')

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
            ...metadata
          }
        }
      })

      return session
    } catch (error: any) {
      console.error('❌ Stripe checkout session creation failed:', error)
      throw new Error(`Payment setup failed: ${error.message}`)
    }
  }

  async createCustomer(email: string, name: string, companyName: string) {
    try {
    const customer = await this.stripe.customers.create({
      email,
      name,
      metadata: {
          company_name: companyName,
        source: 'tutora_admin_portal'
      }
    })
    return customer
    } catch (error: any) {
      console.error('❌ Stripe customer creation failed:', error)
      throw new Error(`Customer creation failed: ${error.message}`)
    }
  }

  async createPortalSession(customerId: string, returnUrl: string) {
    try {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })
    return session
    } catch (error: any) {
      console.error('❌ Stripe portal session creation failed:', error)
      throw new Error(`Portal access failed: ${error.message}`)
    }
  }

  async getSubscription(subscriptionId: string) {
    try {
    return await this.stripe.subscriptions.retrieve(subscriptionId)
    } catch (error: any) {
      console.error('❌ Stripe subscription retrieval failed:', error)
      throw new Error(`Subscription retrieval failed: ${error.message}`)
    }
  }

  async updateSubscription(subscriptionId: string, planId: string) {
    try {
    const plan = PRICING_PLANS[planId]
    if (!plan) {
      throw new Error('Invalid plan ID')
    }

      // TODO: Implement proper subscription update
      // For now, return the current subscription
      return await this.stripe.subscriptions.retrieve(subscriptionId)
    } catch (error: any) {
      console.error('❌ Stripe subscription update failed:', error)
      throw new Error(`Subscription update failed: ${error.message}`)
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
    return await this.stripe.subscriptions.cancel(subscriptionId)
    } catch (error: any) {
      console.error('❌ Stripe subscription cancellation failed:', error)
      throw new Error(`Subscription cancellation failed: ${error.message}`)
    }
  }

  async getCustomer(customerId: string) {
    try {
    return await this.stripe.customers.retrieve(customerId)
    } catch (error: any) {
      console.error('❌ Stripe customer retrieval failed:', error)
      throw new Error(`Customer retrieval failed: ${error.message}`)
    }
  }

  async constructWebhookEvent(body: string, signature: string) {
    try {
      return this.stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (error: any) {
      console.error('❌ Stripe webhook construction failed:', error)
      throw new Error(`Webhook verification failed: ${error.message}`)
    }
  }

  async handleWebhookEvent(event: Stripe.Event) {
    console.log('🔔 Processing Stripe webhook event:', event.type)

    try {
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
          console.log('⚠️ Unhandled webhook event type:', event.type)
      }
    } catch (error) {
      console.error('❌ Webhook event processing failed:', error)
      throw error
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    console.log('✅ Checkout completed for session:', session.id)
    // TODO: Implement checkout completion logic
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    console.log('✅ Subscription created:', subscription.id)
    // TODO: Implement subscription creation logic
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    console.log('✅ Subscription updated:', subscription.id)
    // TODO: Implement subscription update logic
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    console.log('✅ Subscription deleted:', subscription.id)
    // TODO: Implement subscription deletion logic
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    console.log('✅ Payment succeeded for invoice:', invoice.id)
    // TODO: Implement payment success logic
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    console.log('❌ Payment failed for invoice:', invoice.id)
    // TODO: Implement payment failure logic
  }
}

export const stripeService = new StripeService() 