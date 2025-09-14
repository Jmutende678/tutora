import Stripe from 'stripe'

// Build-safe Stripe initialization
export function createStripeInstance(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY
  
  // During build time, environment variables might not be available
  if (!secretKey || secretKey.startsWith('sk_test_') === false && secretKey.startsWith('sk_live_') === false) {
    console.warn('⚠️ Stripe key not available during build - using dummy instance')
    return null
  }

  try {
    return new Stripe(secretKey, {
      apiVersion: '2025-08-27.basil',
    })
  } catch (error) {
    console.warn('⚠️ Failed to initialize Stripe:', error)
    return null
  }
}

// Build-safe Stripe getter
export function getStripe(): Stripe {
  const stripe = createStripeInstance()
  
  if (!stripe) {
    throw new Error('Stripe not configured - please set STRIPE_SECRET_KEY environment variable')
  }
  
  return stripe
}
