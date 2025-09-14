import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe-build-safe'

export async function POST() {
  try {
    const stripe = getStripe()
    
    // Create a fresh product and price to avoid any ID issues
    const product = await stripe.products.create({
      name: 'Test Tutora Plan',
      description: 'Simple test plan for debugging'
    })
    
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 8900, // $89.00
      currency: 'usd',
      recurring: {
        interval: 'month'
      }
    })
    
    // Create checkout session with the fresh price
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: price.id,
          quantity: 1,
        }
      ],
      success_url: 'https://www.tutoralearn.com',
      cancel_url: 'https://www.tutoralearn.com',
    })
    
    return NextResponse.json({
      success: true,
      url: session.url,
      productId: product.id,
      priceId: price.id,
      sessionId: session.id
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack
    }, { status: 500 })
  }
}
