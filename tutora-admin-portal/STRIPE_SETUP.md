# 💳 Stripe Setup Guide - Enable Real Payments

## 🚨 CRITICAL: This enables real revenue generation!

## Step 1: Get Your Stripe Keys

### 1.1 Create/Login to Stripe Account
1. Go to https://dashboard.stripe.com/
2. Create account or login
3. Complete business verification:
   - Business name: "Tutora"
   - Business type: "Software/SaaS"
   - Industry: "Education/Training"

### 1.2 Get Test Keys (Start Here)
1. In Stripe Dashboard, ensure you're in "Test mode" (toggle top-left)
2. Go to "Developers" → "API keys"
3. Copy these keys:

**Test Keys (Safe to start with):**
```
Publishable key: pk_test_51...
Secret key: sk_test_51...
```

### 1.3 Get Live Keys (After Testing)
1. Complete Stripe onboarding process
2. Switch to "Live mode" 
3. Get production keys:
```
Publishable key: pk_live_51...
Secret key: sk_live_51...
```

## Step 2: Update Environment Variables

### 2.1 Update .env.local
Replace placeholder values in `tutora-admin-portal/.env.local`:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51ABC123_YOUR_ACTUAL_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_1ABC123_YOUR_WEBHOOK_SECRET_HERE

# Test Credit Cards (for testing)
# 4242424242424242 - Visa (success)
# 4000000000000002 - Visa (decline)
# 4000000000009995 - Visa (insufficient funds)
```

### 2.2 Update Vercel Environment Variables
1. Go to https://vercel.com/dashboard
2. Select your Tutora project
3. Go to "Settings" → "Environment Variables"
4. Add/Update:
   - `STRIPE_SECRET_KEY` = your actual secret key
   - `STRIPE_PUBLISHABLE_KEY` = your actual publishable key
   - `STRIPE_WEBHOOK_SECRET` = your webhook secret

## Step 3: Set Up Webhooks

### 3.1 Create Webhook Endpoint
1. In Stripe Dashboard → "Developers" → "Webhooks"
2. Click "Add endpoint"
3. Endpoint URL: `https://tutora-g6d5ktgta-johns-projects-eb6ca0cb.vercel.app/api/webhooks/stripe`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated` 
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `checkout.session.completed`

### 3.2 Copy Webhook Secret
1. Click on your webhook
2. Copy "Signing secret" (starts with `whsec_`)
3. Update STRIPE_WEBHOOK_SECRET in .env.local and Vercel

## Step 4: Test Payment Flow

### 4.1 Test Scenarios
Use these test cards in TEST MODE:

**Successful Payment:**
- Card: 4242 4242 4242 4242
- Expiry: Any future date (12/25)
- CVC: Any 3 digits (123)
- ZIP: Any 5 digits (12345)

**Declined Payment:**
- Card: 4000 0000 0000 0002
- Expiry: Any future date
- CVC: Any 3 digits

### 4.2 Test Complete Flow
1. Go to your pricing page
2. Select a plan and user count  
3. Click "Get Started"
4. Fill out registration form
5. Complete Stripe checkout with test card
6. Verify:
   - User receives welcome email
   - Company gets created in Supabase
   - Company code is generated
   - Payment appears in Stripe dashboard

## Step 5: Monitor & Analytics

### 5.1 Stripe Dashboard Metrics
Track these in Stripe:
- Monthly Recurring Revenue (MRR)
- Customer churn rate
- Payment success rate
- Revenue by plan type

### 5.2 Key Metrics to Watch
- **Checkout Abandonment**: Track users who start but don't complete
- **Payment Failures**: Monitor and retry failed payments
- **Subscription Changes**: Upgrades/downgrades
- **Churn Reasons**: Why customers cancel

## Step 6: Go Live Checklist

### Before Switching to Live Mode:

✅ **Test all payment scenarios**  
✅ **Verify webhook handling**  
✅ **Confirm email notifications work**  
✅ **Test subscription management**  
✅ **Verify company creation process**  
✅ **Test mobile app login with company codes**

### Switch to Live Mode:
1. Complete Stripe business verification
2. Update environment variables with live keys
3. Test with small real payment first
4. Monitor for 24 hours
5. Gradually increase marketing spend

## Step 7: Revenue Optimization

### 7.1 Conversion Optimization
- A/B test checkout button text
- Test different pricing displays
- Optimize form fields (remove unnecessary fields)
- Add trust badges and security symbols

### 7.2 Failed Payment Recovery
Set up automatic retry logic:
```javascript
// In webhook handler
if (event.type === 'invoice.payment_failed') {
  // Retry payment after 3 days
  // Send customer notification
  // Update subscription status
}
```

## 🎯 Expected Results

**With Real Stripe Keys:**
- ✅ Customers can actually pay and use the service
- ✅ Automatic revenue tracking
- ✅ Professional checkout experience  
- ✅ Compliance with payment standards
- ✅ Ready for scale (handle 1000+ customers)

**Timeline:** 30 minutes to set up, 1-2 hours for thorough testing

## 🚨 Security Notes

1. **Never commit real keys to git**
2. **Use test mode until fully tested**
3. **Monitor unusual payment patterns**
4. **Set up fraud prevention rules**
5. **Keep webhook secrets secure**

**PRIORITY**: Do this step immediately - it's blocking all revenue! 