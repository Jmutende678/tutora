import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET() {
  try {
    // Test Stripe configuration
    const secretKey = process.env.STRIPE_SECRET_KEY
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY
    
    if (!secretKey) {
      return NextResponse.json({ 
        error: 'Missing STRIPE_SECRET_KEY environment variable',
        success: false 
      }, { status: 500 })
    }

    if (!publishableKey) {
      return NextResponse.json({ 
        error: 'Missing STRIPE_PUBLISHABLE_KEY environment variable',
        success: false 
      }, { status: 500 })
    }

    // Initialize Stripe
    const stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    })

    // Test Stripe connection by listing products
    const products = await stripe.products.list({ limit: 1 })
    
    return NextResponse.json({
      success: true,
      message: 'Stripe connection successful',
      hasSecretKey: !!secretKey,
      hasPublishableKey: !!publishableKey,
      secretKeyPrefix: secretKey.substring(0, 12) + '...',
      publishableKeyPrefix: publishableKey.substring(0, 12) + '...',
      productsCount: products.data.length,
      stripeAccount: {
        connected: true,
        apiVersion: '2023-10-16'
      }
    })
    
  } catch (error: any) {
    console.error('Stripe test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.type || 'unknown_error',
      code: error.code || 'no_code'
    }, { status: 500 })
  }
} 