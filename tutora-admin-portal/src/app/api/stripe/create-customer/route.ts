import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe-build-safe'

export async function POST(request: NextRequest) {
  try {
    const { email, name, companyName, phone } = await request.json()
    const stripe = getStripe()

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        companyName,
        phone,
        source: 'tutora-admin-portal',
        created_at: new Date().toISOString(),
      },
    })

    // Create subscription with trial period
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: 'price_1234567890', // Replace with your actual price ID
        },
      ],
      trial_period_days: 14,
      metadata: {
        companyName,
        planType: 'basic',
      },
    })

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      },
      subscription: {
        id: subscription.id,
        status: subscription.status,
        trialEnd: subscription.trial_end,
      },
    })
  } catch (error) {
    console.error('Stripe customer creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    )
  }
} 