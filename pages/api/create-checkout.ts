import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Simple pricing configuration
const PLANS = {
  starter: {
    name: 'Starter',
    baseUsers: 10,
    monthlyPriceId: 'price_1S5Qfu3aA9p13T3HlAJfqnNT',
    annualPriceId: 'price_1S5Qfu3aA9p13T3HPNg4riM9',
    additionalUsersMonthly: 'price_1S5Qfv3aA9p13T3HSWeOn42g',
    additionalUsersAnnual: 'price_1S5Qfv3aA9p13T3HjB1NwqLj'
  },
  growth: {
    name: 'Growth',
    baseUsers: 25,
    monthlyPriceId: 'price_1S5Qfw3aA9p13T3HXZa1S2pt',
    annualPriceId: 'price_1S5Qfx3aA9p13T3H9SKsvnXv',
    additionalUsersMonthly: 'price_1S5Qfx3aA9p13T3Hinsd9TIP',
    additionalUsersAnnual: 'price_1S5Qfy3aA9p13T3HBytmJD7f'
  },
  professional: {
    name: 'Professional',
    baseUsers: 50,
    monthlyPriceId: 'price_1S5Qfy3aA9p13T3HYEp3UQoB',
    annualPriceId: 'price_1S5Qfz3aA9p13T3Hw4rHDmB2',
    additionalUsersMonthly: 'price_1S5Qfz3aA9p13T3HZQUU4dbb',
    additionalUsersAnnual: 'price_1S5Qg03aA9p13T3HzaWlSH9Q'
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🚀 Railway Checkout API called')
    
    const { planId, billingCycle, userCount } = req.body
    
    console.log('📝 Request data:', { planId, billingCycle, userCount })
    
    // Validate required fields
    if (!planId || !billingCycle) {
      console.log('❌ Missing required fields')
      return res.status(400).json({ error: 'Missing planId or billingCycle' })
    }
    
    // Get plan configuration
    const plan = PLANS[planId as keyof typeof PLANS]
    if (!plan) {
      console.log('❌ Invalid plan ID:', planId)
      return res.status(400).json({ error: 'Invalid plan ID' })
    }
    
    console.log('✅ Plan found:', plan.name)
    
    // Calculate users and pricing
    const requestedUsers = userCount || plan.baseUsers
    const additionalUsers = Math.max(0, requestedUsers - plan.baseUsers)
    
    console.log('📊 User calculation:', {
      baseUsers: plan.baseUsers,
      requestedUsers,
      additionalUsers
    })
    
    // Build line items
    const lineItems = []
    
    // Base plan
    const basePriceId = billingCycle === 'annual' ? plan.annualPriceId : plan.monthlyPriceId
    lineItems.push({
      price: basePriceId,
      quantity: 1
    })
    
    console.log('💰 Base plan added:', basePriceId)
    
    // Additional users if needed
    if (additionalUsers > 0) {
      const additionalPriceId = billingCycle === 'annual' 
        ? plan.additionalUsersAnnual 
        : plan.additionalUsersMonthly
        
      lineItems.push({
        price: additionalPriceId,
        quantity: additionalUsers
      })
      
      console.log('👥 Additional users added:', { priceId: additionalPriceId, quantity: additionalUsers })
    }
    
    // Create Stripe checkout session
    console.log('🏗️ Creating Stripe session...')
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: lineItems,
      success_url: 'https://www.tutoralearn.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://www.tutoralearn.com/pricing',
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          plan_id: planId,
          billing_cycle: billingCycle,
          user_count: requestedUsers.toString(),
          additional_users: additionalUsers.toString()
        }
      },
      metadata: {
        plan_id: planId,
        billing_cycle: billingCycle,
        user_count: requestedUsers.toString(),
        additional_users: additionalUsers.toString()
      },
      allow_promotion_codes: true
      // NO customer_creation - conflicts with subscription mode
    })
    
    console.log('✅ Railway Stripe session created:', session.id)
    
    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    })
    
  } catch (error: any) {
    console.error('❌ Railway API Error:', error)
    
    return res.status(500).json({ 
      error: 'Checkout creation failed',
      details: error.message 
    })
  }
}
