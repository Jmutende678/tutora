import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Creating active Stripe products and prices...')
    
    const plans = [
      {
        id: 'starter',
        name: 'Starter Plan',
        description: 'Perfect for small teams getting started with AI training',
        monthlyPrice: 8900, // $89.00 in cents
        annualPrice: 7500,  // $75.00 in cents (15% discount)
      },
      {
        id: 'growth',
        name: 'Growth Plan', 
        description: 'Ideal for growing organizations scaling their training',
        monthlyPrice: 29900, // $299.00 in cents
        annualPrice: 24900,  // $249.00 in cents
      },
      {
        id: 'professional',
        name: 'Professional Plan',
        description: 'Advanced features for established organizations',
        monthlyPrice: 69900, // $699.00 in cents
        annualPrice: 59900,  // $599.00 in cents
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        description: 'Custom solutions for large organizations',
        monthlyPrice: 199900, // $1999.00 in cents
        annualPrice: 169900,  // $1699.00 in cents
      }
    ]
    
    const createdProducts = []
    const createdPrices = []
    
    for (const plan of plans) {
      console.log(`📦 Creating product: ${plan.name}`)
      
      // Create product
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        active: true,
        metadata: {
          plan_id: plan.id,
          created_by: 'tutora_admin_portal',
          created_at: new Date().toISOString()
        }
      })
      
      createdProducts.push(product)
      console.log(`✅ Created product: ${product.id}`)
      
      // Create monthly price
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.monthlyPrice,
        currency: 'aud',
        recurring: {
          interval: 'month'
        },
        active: true,
        metadata: {
          plan_id: plan.id,
          billing_cycle: 'monthly'
        }
      })
      
      createdPrices.push(monthlyPrice)
      console.log(`💰 Created monthly price: ${monthlyPrice.id}`)
      
      // Create annual price
      const annualPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.annualPrice,
        currency: 'aud',
        recurring: {
          interval: 'year'
        },
        active: true,
        metadata: {
          plan_id: plan.id,
          billing_cycle: 'annual'
        }
      })
      
      createdPrices.push(annualPrice)
      console.log(`📅 Created annual price: ${annualPrice.id}`)
    }
    
    console.log('🎉 All products and prices created successfully!')
    
    return NextResponse.json({
      success: true,
      message: 'Active Stripe products and prices created successfully',
      products: createdProducts.map(p => ({
        id: p.id,
        name: p.name,
        active: p.active
      })),
      prices: createdPrices.map(p => ({
        id: p.id,
        product: p.product,
        unit_amount: p.unit_amount,
        currency: p.currency,
        interval: p.recurring?.interval,
        active: p.active
      })),
      updateInstructions: 'Update src/lib/stripe.ts with these new price IDs'
    })
    
  } catch (error: any) {
    console.error('❌ Error creating Stripe products:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create Stripe products' 
      },
      { status: 500 }
    )
  }
}
