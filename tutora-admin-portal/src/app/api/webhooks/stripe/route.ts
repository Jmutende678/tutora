import { NextRequest, NextResponse } from 'next/server'
import { stripeService } from '@/lib/stripe'
import { firebaseService } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
    }

    const event = await stripeService.constructWebhookEvent(body, signature)

    console.log('Webhook event received:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event)
        break
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event)
        break
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}

async function handleCheckoutCompleted(event: any) {
  const session = event.data.object
  console.log('Checkout completed for session:', session.id)

  try {
    // Get customer details from Stripe
    const customer = await stripeService.getCustomer(session.customer as string)
    
    // Create company in Firebase
    const companyData = {
      name: session.metadata?.companyName || 'New Company',
      email: (customer as any).email || session.customer_email,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      adminUser: {
        name: session.metadata?.adminName || 'Admin',
        email: (customer as any).email || session.customer_email,
      },
    }

    const planId = session.metadata?.planId || 'basic'
    const company = await firebaseService.createCompany(companyData, planId)
    
    console.log('Company created successfully:', company.companyCode)
  } catch (error) {
    console.error('Error creating company:', error)
  }
}

async function handleSubscriptionCreated(event: any) {
  const subscription = event.data.object
  console.log('Subscription created:', subscription.id)
  
  // Log subscription details
  console.log('Subscription details:', {
    id: subscription.id,
    customerId: subscription.customer,
    status: subscription.status,
    planId: subscription.metadata?.planId || 'unknown'
  })
}

async function handleSubscriptionUpdated(event: any) {
  const subscription = event.data.object
  console.log('Subscription updated:', subscription.id)
  
  // Log subscription changes
  console.log('Subscription status:', subscription.status)
}

async function handleSubscriptionDeleted(event: any) {
  const subscription = event.data.object
  console.log('Subscription deleted:', subscription.id)
  
  // Log subscription cancellation
  console.log('Subscription cancelled for customer:', subscription.customer)
}

async function handlePaymentSucceeded(event: any) {
  const invoice = event.data.object
  console.log('Payment succeeded for invoice:', invoice.id)
  
  // Log payment success
  console.log('Payment amount:', invoice.amount_paid / 100)
}

async function handlePaymentFailed(event: any) {
  const invoice = event.data.object
  console.log('Payment failed for invoice:', invoice.id)
  
  // Log payment failure
  console.log('Payment failure reason:', invoice.last_payment_error?.message || 'Unknown')
} 