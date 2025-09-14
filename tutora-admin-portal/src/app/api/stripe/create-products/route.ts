import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe-build-safe'

export async function POST() {
  try {
    const stripe = getStripe()
    
    console.log('🚀 Creating new Tutora products in Stripe...')
    
    // Define the complete product structure
    const productPlans = [
      {
        id: 'starter',
        name: 'Starter Plan',
        description: 'Perfect for small teams getting started (up to 10 users)',
        monthlyPrice: 8900, // $89.00
        annualPrice: 7500,  // $75.00 (annual discount)
        baseUsers: 10,
        overagePrice: 800,  // $8.00 per additional user
        features: [
          'Up to 10 team members included',
          'Additional users $8/month each',
          '10 AI-generated modules per month',
          'Basic analytics & reporting',
          'Email support',
          'Mobile app access',
          'Basic quiz & assessment tools'
        ]
      },
      {
        id: 'growth',
        name: 'Growth Plan',
        description: 'Complete training solution for growing teams (up to 25 users)',
        monthlyPrice: 29900, // $299.00
        annualPrice: 24900,  // $249.00 (annual discount)
        baseUsers: 25,
        overagePrice: 1200, // $12.00 per additional user
        features: [
          'Up to 25 team members included',
          'Additional users $12/month each',
          'Unlimited AI-generated modules',
          'Advanced analytics & insights',
          'Priority support',
          'Custom branding',
          'Advanced quiz & certification',
          'API access',
          'Custom learning paths'
        ]
      },
      {
        id: 'professional',
        name: 'Professional Plan',
        description: 'Advanced platform for established organizations (up to 50 users)',
        monthlyPrice: 69900, // $699.00
        annualPrice: 59900,  // $599.00 (annual discount)
        baseUsers: 50,
        overagePrice: 1400, // $14.00 per additional user
        features: [
          'Up to 50 team members included',
          'Additional users $14/month each',
          'Unlimited AI-generated modules',
          'Advanced AI features & customization',
          'Priority support',
          'Custom branding & white-label options',
          'SSO integration',
          'Advanced security features',
          'API access',
          'Custom integrations'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        description: 'Full-scale solution for large organizations (up to 100 users)',
        monthlyPrice: 199900, // $1999.00
        annualPrice: 169900,  // $1699.00 (annual discount)
        baseUsers: 100,
        overagePrice: 2000,  // $20.00 per additional user
        features: [
          'Up to 100 team members included',
          'Additional users $20/month each',
          'Unlimited AI-generated modules',
          'Advanced AI features & customization',
          'White-label solution',
          '24/7 dedicated support',
          'Custom integrations',
          'Advanced security features',
          'Dedicated account manager',
          'Custom onboarding & training'
        ]
      }
    ]

    const createdProducts = []

    for (const plan of productPlans) {
      console.log(`📦 Creating ${plan.name}...`)
      
      // Create the main product
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          plan_id: plan.id,
          base_users: plan.baseUsers.toString(),
          overage_price: (plan.overagePrice / 100).toString(), // Store as dollars
          features: JSON.stringify(plan.features)
        }
      })

      // Create monthly price
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.monthlyPrice,
        currency: 'usd',
        recurring: {
          interval: 'month'
        },
        nickname: `${plan.name} - Monthly`,
        metadata: {
          plan_id: plan.id,
          billing_cycle: 'monthly',
          base_users: plan.baseUsers.toString()
        }
      })

      // Create annual price
      const annualPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.annualPrice,
        currency: 'usd',
        recurring: {
          interval: 'month' // Still monthly billing, but at discounted annual rate
        },
        nickname: `${plan.name} - Annual`,
        metadata: {
          plan_id: plan.id,
          billing_cycle: 'annual',
          base_users: plan.baseUsers.toString(),
          annual_discount: 'true'
        }
      })

      // Create overage price (for additional users)
      const overagePrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.overagePrice,
        currency: 'usd',
        recurring: {
          interval: 'month'
        },
        nickname: `${plan.name} - Additional User`,
        metadata: {
          plan_id: plan.id,
          price_type: 'overage',
          per_unit: 'user'
        }
      })

      createdProducts.push({
        plan_id: plan.id,
        name: plan.name,
        product_id: product.id,
        monthly_price_id: monthlyPrice.id,
        annual_price_id: annualPrice.id,
        overage_price_id: overagePrice.id,
        base_users: plan.baseUsers,
        monthly_amount: plan.monthlyPrice / 100,
        annual_amount: plan.annualPrice / 100,
        overage_amount: plan.overagePrice / 100
      })

      console.log(`✅ Created ${plan.name} with product ID: ${product.id}`)
    }

    console.log('🎉 All products created successfully!')

    return NextResponse.json({
      success: true,
      message: 'All Tutora products created successfully in Stripe',
      products: createdProducts,
      summary: {
        total_products: createdProducts.length,
        total_prices: createdProducts.length * 3, // Each product has 3 prices (monthly, annual, overage)
        next_steps: [
          'Update pricing page with new product IDs',
          'Test checkout flow',
          'Delete old products if needed'
        ]
      }
    })

  } catch (error: any) {
    console.error('❌ Error creating Stripe products:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.type,
      code: error.code,
      details: 'Failed to create Stripe products. Check console for full error details.'
    }, { status: 500 })
  }
}

// GET endpoint to list current products (for cleanup)
export async function GET() {
  try {
    const stripe = getStripe()
    
    const products = await stripe.products.list({ limit: 100 })
    const prices = await stripe.prices.list({ limit: 100 })
    
    return NextResponse.json({
      success: true,
      products: products.data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        active: p.active,
        created: new Date(p.created * 1000).toISOString(),
        metadata: p.metadata
      })),
      prices: prices.data.map(p => ({
        id: p.id,
        product: p.product,
        unit_amount: p.unit_amount,
        currency: p.currency,
        recurring: p.recurring,
        nickname: p.nickname,
        active: p.active,
        metadata: p.metadata
      })),
      summary: {
        total_products: products.data.length,
        active_products: products.data.filter(p => p.active).length,
        total_prices: prices.data.length,
        active_prices: prices.data.filter(p => p.active).length
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}


