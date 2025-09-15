import Stripe from 'stripe'

// Initialize Stripe with real API key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build'

// Only create Stripe instance if we have a real key
const stripe = stripeSecretKey !== 'sk_test_dummy_key_for_build' 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  : null

if (stripeSecretKey !== 'sk_test_dummy_key_for_build') {
  console.log('✅ Stripe configured successfully with live keys')
} else {
  console.log('⚠️ Stripe using dummy key for build - configure STRIPE_SECRET_KEY for production')
}

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
  stripeAdditionalUsersMonthlyId?: string
  stripeAdditionalUsersAnnualId?: string
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
    stripeProductId: 'prod_T3jChyF673mpk0',
    stripeMonthlyPriceId: 'price_1S7bkU3aA9p13T3HJHT2dwbU',
    stripeAnnualPriceId: 'price_1S7bkV3aA9p13T3H1COSFXSF',
    stripeAdditionalUsersMonthlyId: 'price_1S7bkV3aA9p13T3HX9qDNSOy',
    stripeAdditionalUsersAnnualId: 'price_1S7bkV3aA9p13T3HQ54HHtDa'
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
    stripeProductId: 'prod_T3jCZY6N5JEWXw',
    stripeMonthlyPriceId: 'price_1S7bkW3aA9p13T3HSs2j3nb6',
    stripeAnnualPriceId: 'price_1S7bkX3aA9p13T3HHaRDZtlj',
    stripeAdditionalUsersMonthlyId: 'price_1S7bkX3aA9p13T3HnRII2xv7',
    stripeAdditionalUsersAnnualId: 'price_1S7bkX3aA9p13T3HU8QfAKzo'
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
    stripeProductId: 'prod_T3jCL1LZAIkgBq',
    stripeMonthlyPriceId: 'price_1S7bkY3aA9p13T3HtGSVyXw6',
    stripeAnnualPriceId: 'price_1S7bkZ3aA9p13T3HQUp7IETt',
    stripeAdditionalUsersMonthlyId: 'price_1S7bkZ3aA9p13T3HBUG5DuzO',
    stripeAdditionalUsersAnnualId: 'price_1S7bkZ3aA9p13T3HelRVknxw'
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
    stripeProductId: 'prod_T3jDsEB4peFLCP',
    stripeMonthlyPriceId: 'price_1S7bka3aA9p13T3HDsgsQ8Io',
    stripeAnnualPriceId: 'price_1S7bkb3aA9p13T3HT6b5r75A',
    stripeAdditionalUsersMonthlyId: 'price_1S7bkb3aA9p13T3HVDDMIQcS',
    stripeAdditionalUsersAnnualId: 'price_1S7bkc3aA9p13T3HaJlet4QD'
  }
}

export class StripeService {
  private stripe: Stripe | null

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
    if (!this.stripe) {
      throw new Error('Stripe not configured - please set STRIPE_SECRET_KEY environment variable')
    }

    const plan = PRICING_PLANS[planId]
    if (!plan) {
      throw new Error('Invalid plan ID')
    }

    const effectiveUserCount = userCount || plan.baseUsers
    const additionalUsers = Math.max(0, effectiveUserCount - plan.baseUsers)

    // Get the correct price IDs
    const basePriceId = billingCycle === 'annual' ? plan.stripeAnnualPriceId : plan.stripeMonthlyPriceId
    const additionalUsersPriceId = billingCycle === 'annual' 
      ? plan.stripeAdditionalUsersAnnualId 
      : plan.stripeAdditionalUsersMonthlyId

    if (!basePriceId) {
      throw new Error(`No ${billingCycle} price ID configured for plan ${planId}`)
    }

    console.log('Creating subscription with:', {
      planId,
      billingCycle,
      effectiveUserCount,
      baseUsers: plan.baseUsers,
      additionalUsers,
      basePriceId,
      additionalUsersPriceId
    })

    // Build line items for subscription
    const lineItems: any[] = [
      {
        price: basePriceId,
        quantity: 1, // Base plan
      }
    ]

    // Add additional users as a separate line item if needed
    if (additionalUsers > 0 && additionalUsersPriceId) {
      lineItems.push({
        price: additionalUsersPriceId,
        quantity: additionalUsers,
      })
    }

    try {
      console.log('Creating Stripe session with line items:', lineItems)
      
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: lineItems,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          planId,
          billingCycle,
          userCount: effectiveUserCount.toString(),
          source: metadata?.source || 'api'
        },
        subscription_data: {
          trial_period_days: 14,
          metadata: {
            planId,
            billingCycle,
            userCount: effectiveUserCount.toString()
          }
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        customer_creation: 'always'
      })

      console.log('✅ Stripe session created successfully:', session.id)
      return session
    } catch (error: any) {
      console.error('❌ Stripe checkout session creation failed:', error)
      console.error('Error details:', {
        message: error.message,
        type: error.type,
        code: error.code,
        planId,
        billingCycle,
        lineItems
      })
      throw new Error(`Payment setup failed: ${error.message}`)
    }
  }

    async createCustomer(email: string, name: string, companyName: string) {
    if (!this.stripe) {
      throw new Error('Stripe not configured - please set STRIPE_SECRET_KEY environment variable')
    }
    
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
    if (!this.stripe) {
      throw new Error('Stripe not configured - please set STRIPE_SECRET_KEY environment variable')
    }
    
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
    if (!this.stripe) {
      throw new Error('Stripe not configured - please set STRIPE_SECRET_KEY environment variable')
    }
    
    try {
    return await this.stripe.subscriptions.retrieve(subscriptionId)
    } catch (error: any) {
      console.error('❌ Stripe subscription retrieval failed:', error)
      throw new Error(`Subscription retrieval failed: ${error.message}`)
    }
  }

  async updateSubscription(subscriptionId: string, planId: string) {
    if (!this.stripe) {
      throw new Error('Stripe not configured - please set STRIPE_SECRET_KEY environment variable')
    }
    
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
    if (!this.stripe) {
      throw new Error('Stripe not configured - please set STRIPE_SECRET_KEY environment variable')
    }
    
    try {
    return await this.stripe.subscriptions.cancel(subscriptionId)
    } catch (error: any) {
      console.error('❌ Stripe subscription cancellation failed:', error)
      throw new Error(`Subscription cancellation failed: ${error.message}`)
    }
  }

  async getCustomer(customerId: string) {
    if (!this.stripe) {
      throw new Error('Stripe not configured - please set STRIPE_SECRET_KEY environment variable')
    }
    
    try {
    return await this.stripe.customers.retrieve(customerId)
    } catch (error: any) {
      console.error('❌ Stripe customer retrieval failed:', error)
      throw new Error(`Customer retrieval failed: ${error.message}`)
    }
  }

  async constructWebhookEvent(body: string, signature: string) {
    if (!this.stripe) {
      throw new Error('Stripe not configured - please set STRIPE_SECRET_KEY environment variable')
    }
    
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