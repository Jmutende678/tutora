import { NextRequest, NextResponse } from 'next/server'

// Redirect to the correct webhook endpoint
export async function POST(request: NextRequest) {
  try {
    console.log('⚠️ Webhook called at deprecated endpoint /api/stripe-webhook')
    console.log('🔄 Redirecting to correct endpoint /api/webhooks/stripe')
    
    // Forward the request to the correct endpoint
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    const forwardResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/webhooks/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': signature || '',
      },
      body: body
    })
    
    const result = await forwardResponse.json()
    return NextResponse.json(result, { status: forwardResponse.status })
    
  } catch (error: any) {
    console.error('Webhook redirect error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Stripe webhook endpoint active',
    correct_endpoint: '/api/webhooks/stripe',
    note: 'This endpoint redirects to the correct webhook handler'
  })
}
