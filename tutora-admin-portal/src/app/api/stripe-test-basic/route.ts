import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil',
    })
    
    // Create the absolute simplest checkout session possible
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1S529e3aA9p13T3HurTMrkPc',
          quantity: 1,
        }
      ],
      success_url: 'https://www.tutoralearn.com',
      cancel_url: 'https://www.tutoralearn.com',
    })
    
    return NextResponse.json({
      success: true,
      url: session.url
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
