import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe-build-safe'

export async function GET() {
  try {
    const stripe = getStripe()
    
    // First, let's see what products exist
    const products = await stripe.products.list({ limit: 10 })
    
    // Then let's try to get the specific price
    let priceDetails = null
    try {
      const price = await stripe.prices.retrieve('price_1S529e3aA9p13T3HurTMrkPc')
      priceDetails = {
        id: price.id,
        active: price.active,
        currency: price.currency,
        product: price.product,
        unit_amount: price.unit_amount,
        recurring: price.recurring
      }
    } catch (priceError: any) {
      priceDetails = { error: priceError.message }
    }
    
    return NextResponse.json({
      success: true,
      products: products.data.map(p => ({
        id: p.id,
        name: p.name,
        active: p.active
      })),
      targetPrice: priceDetails,
      stripeKeyLength: process.env.STRIPE_SECRET_KEY?.length || 0
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.type,
      code: error.code
    }, { status: 500 })
  }
}
