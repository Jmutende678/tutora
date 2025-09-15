import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Fixing Stripe products and prices...')
    
    // List all products to see their status
    const products = await stripe.products.list({ limit: 100 })
    console.log('📦 Found products:', products.data.map(p => ({ id: p.id, name: p.name, active: p.active })))
    
    // List all prices to see their status
    const prices = await stripe.prices.list({ limit: 100 })
    console.log('💰 Found prices:', prices.data.map(p => ({ id: p.id, active: p.active, product: p.product })))
    
    // Find the problematic price
    const problematicPriceId = 'price_1S529e3aA9p13T3HurTMrkPc'
    const problematicPrice = prices.data.find(p => p.id === problematicPriceId)
    
    if (problematicPrice) {
      console.log('🚨 Found problematic price:', {
        id: problematicPrice.id,
        active: problematicPrice.active,
        product: problematicPrice.product
      })
      
      // Check if the product is active
      const product = await stripe.products.retrieve(problematicPrice.product as string)
      console.log('📦 Associated product:', {
        id: product.id,
        name: product.name,
        active: product.active
      })
      
      // If product is inactive, activate it
      if (!product.active) {
        console.log('🔄 Activating product...')
        await stripe.products.update(product.id, { active: true })
        console.log('✅ Product activated!')
      }
      
      // If price is inactive, we can't reactivate it, but we can create a new one
      if (!problematicPrice.active) {
        console.log('⚠️ Price is inactive. Prices cannot be reactivated once deactivated.')
        console.log('💡 Consider creating new prices or using active ones.')
      }
    }
    
    // Return summary
    const activeProducts = products.data.filter(p => p.active)
    const activePrices = prices.data.filter(p => p.active)
    
    return NextResponse.json({
      success: true,
      message: 'Stripe products analysis complete',
      summary: {
        totalProducts: products.data.length,
        activeProducts: activeProducts.length,
        totalPrices: prices.data.length,
        activePrices: activePrices.length,
        problematicPriceFound: !!problematicPrice,
        problematicPriceActive: problematicPrice?.active || false
      },
      activeProducts: activeProducts.map(p => ({ id: p.id, name: p.name })),
      activePrices: activePrices.map(p => ({ id: p.id, unit_amount: p.unit_amount, currency: p.currency, product: p.product }))
    })
    
  } catch (error: any) {
    console.error('❌ Error fixing Stripe products:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fix Stripe products' 
      },
      { status: 500 }
    )
  }
}
