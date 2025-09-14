import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    env_check: {
      has_stripe_secret: !!process.env.STRIPE_SECRET_KEY,
      has_stripe_publishable: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      stripe_secret_length: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0,
      publishable_key_length: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.length : 0,
      node_env: process.env.NODE_ENV
    }
  })
}
