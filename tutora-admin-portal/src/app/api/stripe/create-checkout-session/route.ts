import { NextRequest, NextResponse } from 'next/server'
import { stripeService } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { planId, billingCycle, successUrl, cancelUrl, userCount, metadata } = await request.json()

    if (!planId || !billingCycle || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    console.log('Creating checkout session for:', { 
      planId, 
      billingCycle, 
      userCount,
      metadata 
    })

    // Create Stripe checkout session with dynamic pricing
    const session = await stripeService.createCheckoutSession(
      planId,
      billingCycle,
      successUrl,
      cancelUrl,
      {
        source: 'tutora_admin_portal',
        billing_cycle: billingCycle,
        user_count: userCount?.toString(),
        ...metadata
      },
      userCount // Pass userCount for pricing calculation
    )

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    })
  } catch (error: any) {
    console.error('Stripe checkout session creation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create checkout session' 
      },
      { status: 500 }
    )
  }
} 