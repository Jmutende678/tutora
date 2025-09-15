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
        monthlyPrice: 8900, // AUD $89.00 in cents
        annualPrice: 7500,  // AUD $75.00 in cents (15% discount)
        baseUsers: 10,
        additionalUserMonthlyPrice: 800, // AUD $8.00 in cents
        additionalUserAnnualPrice: 700,  // AUD $7.00 in cents
      },
      {
        id: 'growth',
        name: 'Growth Plan', 
        description: 'Ideal for growing organizations scaling their training',
        monthlyPrice: 29900, // AUD $299.00 in cents
        annualPrice: 24900,  // AUD $249.00 in cents (17% discount)
        baseUsers: 25,
        additionalUserMonthlyPrice: 1200, // AUD $12.00 in cents
        additionalUserAnnualPrice: 1000,  // AUD $10.00 in cents
      },
      {
        id: 'professional',
        name: 'Professional Plan',
        description: 'Advanced features for established organizations',
        monthlyPrice: 69900, // AUD $699.00 in cents
        annualPrice: 59900,  // AUD $599.00 in cents (14% discount)
        baseUsers: 50,
        additionalUserMonthlyPrice: 1500, // AUD $15.00 in cents
        additionalUserAnnualPrice: 1300,  // AUD $13.00 in cents
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        description: 'Custom solutions for large organizations',
        monthlyPrice: 199900, // AUD $1999.00 in cents
        annualPrice: 169900,  // AUD $1699.00 in cents (15% discount)
        baseUsers: 100,
        additionalUserMonthlyPrice: 2000, // AUD $20.00 in cents
        additionalUserAnnualPrice: 1700,  // AUD $17.00 in cents
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
      
      // Create additional user monthly price
      const additionalUserMonthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.additionalUserMonthlyPrice,
        currency: 'aud',
        recurring: {
          interval: 'month'
        },
        active: true,
        metadata: {
          plan_id: plan.id,
          billing_cycle: 'monthly',
          price_type: 'additional_users'
        }
      })
      
      createdPrices.push(additionalUserMonthlyPrice)
      console.log(`👥 Created additional user monthly price: ${additionalUserMonthlyPrice.id}`)
      
      // Create additional user annual price
      const additionalUserAnnualPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.additionalUserAnnualPrice,
        currency: 'aud',
        recurring: {
          interval: 'year'
        },
        active: true,
        metadata: {
          plan_id: plan.id,
          billing_cycle: 'annual',
          price_type: 'additional_users'
        }
      })
      
      createdPrices.push(additionalUserAnnualPrice)
      console.log(`👥 Created additional user annual price: ${additionalUserAnnualPrice.id}`)
    }
    
    console.log('🎉 All products and prices created successfully!')
    
    // Organize prices by plan and type for easy updating
    const pricesByPlan = {}
    for (const price of createdPrices) {
      const planId = price.metadata.plan_id
      if (!pricesByPlan[planId]) {
        pricesByPlan[planId] = {}
      }
      
      const priceType = price.metadata.price_type || 'base'
      const billingCycle = price.metadata.billing_cycle
      
      if (priceType === 'base') {
        if (billingCycle === 'monthly') {
          pricesByPlan[planId].monthlyPriceId = price.id
        } else {
          pricesByPlan[planId].annualPriceId = price.id
        }
      } else if (priceType === 'additional_users') {
        if (billingCycle === 'monthly') {
          pricesByPlan[planId].additionalUsersMonthlyId = price.id
        } else {
          pricesByPlan[planId].additionalUsersAnnualId = price.id
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Active Stripe products and prices created successfully for ALL plans',
      products: createdProducts.map(p => ({
        id: p.id,
        name: p.name,
        active: p.active
      })),
      pricesByPlan,
      totalPrices: createdPrices.length,
      updateInstructions: {
        file: 'src/lib/stripe.ts',
        action: 'Replace the stripeProductId, stripeMonthlyPriceId, stripeAnnualPriceId, stripeAdditionalUsersMonthlyId, and stripeAdditionalUsersAnnualId for each plan',
        priceMapping: pricesByPlan
      }
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
