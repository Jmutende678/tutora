import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY
    const hasPublishableKey = !!process.env.STRIPE_PUBLISHABLE_KEY
    const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET
    
    const secretKeyPreview = process.env.STRIPE_SECRET_KEY 
      ? process.env.STRIPE_SECRET_KEY.substring(0, 20) + '...' 
      : 'NOT SET'
    
    return NextResponse.json({
      success: true,
      stripe_config: {
        secret_key_set: hasSecretKey,
        publishable_key_set: hasPublishableKey,
        webhook_secret_set: hasWebhookSecret,
        secret_key_preview: secretKeyPreview,
        environment: process.env.NODE_ENV
      },
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
