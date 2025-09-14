import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe-build-safe'

export async function POST(request: Request) {
  try {
    const stripe = getStripe()
    const { productIds, confirm } = await request.json()

    if (!confirm) {
      return NextResponse.json({
        success: false,
        error: 'Confirmation required. Set confirm: true to proceed with deletion.'
      }, { status: 400 })
    }

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json({
        success: false,
        error: 'productIds array is required'
      }, { status: 400 })
    }

    console.log('🗑️ Starting cleanup of old Stripe products...')
    
    const results = []

    for (const productId of productIds) {
      try {
        // First, deactivate all prices for this product
        const prices = await stripe.prices.list({ product: productId })
        
        for (const price of prices.data) {
          if (price.active) {
            await stripe.prices.update(price.id, { active: false })
            console.log(`⏸️ Deactivated price: ${price.id}`)
          }
        }

        // Then deactivate the product (Stripe doesn't allow deletion of products with subscriptions)
        const updatedProduct = await stripe.products.update(productId, { 
          active: false,
          metadata: {
            ...((await stripe.products.retrieve(productId)).metadata || {}),
            deactivated_at: new Date().toISOString(),
            reason: 'Product structure update - replaced with new pricing'
          }
        })

        results.push({
          product_id: productId,
          status: 'deactivated',
          name: updatedProduct.name,
          prices_deactivated: prices.data.filter(p => p.active).length
        })

        console.log(`✅ Deactivated product: ${productId} (${updatedProduct.name})`)

      } catch (error: any) {
        console.error(`❌ Error processing product ${productId}:`, error.message)
        results.push({
          product_id: productId,
          status: 'error',
          error: error.message
        })
      }
    }

    const successful = results.filter(r => r.status === 'deactivated').length
    const failed = results.filter(r => r.status === 'error').length

    return NextResponse.json({
      success: true,
      message: `Cleanup completed: ${successful} products deactivated, ${failed} errors`,
      results,
      summary: {
        total_processed: productIds.length,
        successful_deactivations: successful,
        errors: failed
      },
      note: 'Products are deactivated (not deleted) to preserve subscription history. They will no longer appear in checkout but existing subscriptions remain valid.'
    })

  } catch (error: any) {
    console.error('❌ Error during cleanup:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: 'Failed to cleanup old products. Check console for full error details.'
    }, { status: 500 })
  }
}

// GET endpoint to identify products that should be cleaned up
export async function GET() {
  try {
    const stripe = getStripe()
    
    const products = await stripe.products.list({ limit: 100 })
    const prices = await stripe.prices.list({ limit: 100 })
    
    // Identify potentially old/test products
    const suspiciousProducts = products.data.filter(product => {
      const name = product.name.toLowerCase()
      return (
        name.includes('test') ||
        name.includes('basic') ||
        name.includes('pro') ||
        name.includes('debug') ||
        name.includes('old') ||
        !product.metadata?.plan_id || // Missing our new metadata structure
        product.description?.includes('debugging')
      )
    })

    // Group prices by product for better overview
    const productPrices = {}
    prices.data.forEach(price => {
      if (!productPrices[price.product]) {
        productPrices[price.product] = []
      }
      productPrices[price.product].push({
        id: price.id,
        amount: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval,
        nickname: price.nickname,
        active: price.active
      })
    })

    return NextResponse.json({
      success: true,
      all_products: products.data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        active: p.active,
        created: new Date(p.created * 1000).toISOString(),
        metadata: p.metadata,
        prices: productPrices[p.id] || []
      })),
      suspicious_products: suspiciousProducts.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        reason: 'Potentially old/test product',
        prices: productPrices[p.id] || []
      })),
      summary: {
        total_products: products.data.length,
        active_products: products.data.filter(p => p.active).length,
        suspicious_count: suspiciousProducts.length,
        recommended_action: suspiciousProducts.length > 0 ? 'Review suspicious products and deactivate if needed' : 'No cleanup needed'
      },
      cleanup_instructions: {
        step1: 'Review the suspicious_products list',
        step2: 'POST to this endpoint with productIds array and confirm: true',
        step3: 'Example: {"productIds": ["prod_xxx", "prod_yyy"], "confirm": true}'
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
