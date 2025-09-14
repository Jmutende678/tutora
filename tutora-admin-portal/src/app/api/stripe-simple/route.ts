import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST() {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }
    
    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-08-27.basil' })
    
    console.log('Creating simple checkout session...')
    
    // Create the simplest possible checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1S529e3aA9p13T3HurTMrkPc', // Your actual starter monthly price
          quantity: 1,
        }
      ],
      success_url: 'https://www.tutoralearn.com/success',
      cancel_url: 'https://www.tutoralearn.com/pricing',
      subscription_data: {
        trial_period_days: 14,
      },
      customer_creation: 'always'
    })
    
    console.log('✅ Simple checkout session created:', session.id)
    
    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
      message: 'Simple checkout session created successfully'
    })
    
  } catch (error: any) {
    console.error('❌ Simple checkout failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      errorType: error.type || 'unknown',
      errorCode: error.code || 'unknown'
    }, { status: 500 })
  }
}
