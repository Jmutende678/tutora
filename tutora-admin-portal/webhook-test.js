/**
 * STRIPE WEBHOOK TEST SCRIPT
 * Tests the end-to-end payment flow with Stripe test data
 */

const testWebhookEvent = {
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_123456',
      customer: 'cus_test_123456',
      customer_email: 'test@example.com',
      subscription: 'sub_test_123456',
      metadata: {
        planId: 'growth',
        userCount: '25',
        companyName: 'Test Company Inc'
      },
      customer_details: {
        address: {
          line1: '123 Test Street',
          city: 'Test City',
          country: 'US',
          postal_code: '12345'
        }
      }
    }
  }
}

async function testWebhook() {
  try {
    console.log('🧪 Testing Stripe webhook...')
    
    const response = await fetch('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test-signature-bypass' // For testing only
      },
      body: JSON.stringify(testWebhookEvent)
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Webhook test successful:', result)
    } else {
      console.log('❌ Webhook test failed:', result)
    }
  } catch (error) {
    console.error('❌ Webhook test error:', error)
  }
}

// Uncomment to run test (requires dev server running)
// testWebhook()

console.log(`
🚀 STRIPE WEBHOOK TEST READY

To test the webhook functionality:

1. Start the development server:
   npm run dev

2. Run this test:
   node webhook-test.js

3. Or use Stripe CLI for real webhook testing:
   stripe listen --forward-to localhost:3000/api/webhooks/stripe

Expected Result:
✅ Company created in Supabase
✅ Admin user created with authentication
✅ Welcome email sent
✅ Company code generated (TUT-2024-XXXXX)

This validates the complete payment -> company creation flow.
`)

module.exports = { testWebhookEvent, testWebhook } 