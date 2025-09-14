import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET() {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }
    
    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })
    
    // Test the starter plan price IDs
    const testPriceIds = [
      'price_1S529e3aA9p13T3HurTMrkPc', // starter monthly
      'price_1S529f3aA9p13T3HNYO0GSdr', // starter annual
      'price_1S529f3aA9p13T3HWN6prLbH', // starter additional users monthly
    ]
    
    const results = []
    
    for (const priceId of testPriceIds) {
      try {
        const price = await stripe.prices.retrieve(priceId)
        results.push({
          id: priceId,
          status: 'found',
          active: price.active,
          product: price.product,
          currency: price.currency
        })
      } catch (error: any) {
        results.push({
          id: priceId,
          status: 'error',
          error: error.message
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
