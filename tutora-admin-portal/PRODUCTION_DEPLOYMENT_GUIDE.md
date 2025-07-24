# 🚀 TUTORA PRODUCTION DEPLOYMENT GUIDE

*Complete guide to deploy Tutora as a production-ready SaaS platform*

## 📋 **PREREQUISITES CHECKLIST**

Before deploying, ensure you have:
- [ ] **Stripe Account** (for payment processing)
- [ ] **OpenAI API Key** (for AI module builder)
- [ ] **Gmail/SMTP Access** (for email notifications)
- [ ] **Domain Name** (for custom branding)
- [ ] **SSL Certificate** (automatically handled by Vercel)
- [ ] **Supabase Account** (database - already configured)

## 🎯 **PHASE 1: ENVIRONMENT SETUP** (15 minutes)

### Step 1.1: Configure Environment Variables
```bash
# Copy the template
cp env.production.template .env.local

# Edit with your actual values
nano .env.local
```

### Step 1.2: Critical Variables to Update
```bash
# 💳 STRIPE (REQUIRED)
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY  # Use sk_test_ for testing
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY  # Use pk_test_ for testing
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# 🤖 OPENAI (REQUIRED for AI features)
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY

# 📧 EMAIL (REQUIRED for notifications)
SMTP_USER=support@yourdomain.com
SMTP_PASS=your-gmail-app-password

# 🏢 BRANDING (CUSTOMIZE)
APP_DOMAIN=yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
SUPPORT_EMAIL=support@yourdomain.com
NEXT_PUBLIC_APP_URL=https://admin.yourdomain.com

# 🔐 SECURITY (GENERATE STRONG SECRETS)
NEXTAUTH_SECRET=your-super-secure-secret-32-chars-min
JWT_SECRET=another-super-secure-secret-32-chars-min
```

### Step 1.3: Test Local Setup
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` and verify:
- [ ] Pricing page loads
- [ ] Registration flow works (with test Stripe keys)
- [ ] Admin dashboard displays
- [ ] Support system functions

## 🚀 **PHASE 2: PRODUCTION DEPLOYMENT** (20 minutes)

### Step 2.1: Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Step 2.2: Configure Vercel Environment Variables
In Vercel Dashboard → Your Project → Settings → Environment Variables:

**CRITICAL VARIABLES:**
```
NEXT_PUBLIC_SUPABASE_URL=https://sphkmvjfufrjbojfahar.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (your anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (your service key)
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_KEY
SMTP_USER=support@yourdomain.com
SMTP_PASS=your-gmail-app-password
NEXTAUTH_SECRET=your-secure-secret
JWT_SECRET=your-jwt-secret
```

### Step 2.3: Custom Domain Setup
1. **Add Domain in Vercel**:
   - Vercel Dashboard → Domains → Add Domain
   - Enter: `admin.yourdomain.com`

2. **Update DNS Records**:
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**: Auto-configured by Vercel

## 💳 **PHASE 3: STRIPE CONFIGURATION** (15 minutes)

### Step 3.1: Create Stripe Products
Go to Stripe Dashboard → Products → Create Product:

**Starter Plan:**
- Name: "Tutora Starter"
- Price: $89/month
- Product ID: Save for later

**Growth Plan:**
- Name: "Tutora Growth" 
- Price: $299/month
- Mark as "Popular"

**Professional Plan:**
- Name: "Tutora Professional"
- Price: $799/month

### Step 3.2: Configure Webhooks
1. **Create Webhook Endpoint**:
   - URL: `https://admin.yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`

2. **Test Webhook**:
   ```bash
   stripe listen --forward-to https://admin.yourdomain.com/api/webhooks/stripe
   ```

### Step 3.3: Update Pricing in Code
Edit `tutora-admin-portal/src/lib/stripe.ts` with your actual product IDs.

## 📧 **PHASE 4: EMAIL SYSTEM SETUP** (10 minutes)

### Step 4.1: Gmail App Password Setup
1. **Enable 2FA** on your Gmail account
2. **Generate App Password**:
   - Gmail Settings → Security → 2-Step Verification → App Passwords
   - Select "Mail" → Generate Password
   - Use this password in `SMTP_PASS`

### Step 4.2: Test Email Notifications
```bash
# Test support ticket email
curl -X POST https://admin.yourdomain.com/api/support/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test Email",
    "description": "Testing email notifications",
    "userEmail": "test@yourdomain.com",
    "userName": "Test User",
    "type": "technical"
  }'
```

## 🤖 **PHASE 5: AI FEATURES SETUP** (5 minutes)

### Step 5.1: OpenAI API Key
1. **Get API Key**: https://platform.openai.com/api-keys
2. **Add to Environment**: `OPENAI_API_KEY=sk-proj-...`
3. **Test AI Generation**: Upload a document in admin portal

### Step 5.2: Verify AI Module Builder
- [ ] Document upload works
- [ ] Video transcription works
- [ ] AI generates training modules
- [ ] Modules are saved to database

## 🔒 **PHASE 6: SECURITY & COMPLIANCE** (10 minutes)

### Step 6.1: Security Headers
Vercel automatically adds security headers. Verify at:
https://securityheaders.com/?q=https://admin.yourdomain.com

### Step 6.2: GDPR Compliance
Update privacy policy URL in environment variables:
```bash
PRIVACY_POLICY_URL=https://yourdomain.com/privacy
TERMS_OF_SERVICE_URL=https://yourdomain.com/terms
```

### Step 6.3: Rate Limiting
Already configured in middleware. Monitor in production.

## 📊 **PHASE 7: MONITORING & ANALYTICS** (15 minutes)

### Step 7.1: Vercel Analytics
Enable in Vercel Dashboard → Analytics → Enable

### Step 7.2: Error Monitoring (Optional)
Add Sentry for error tracking:
```bash
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
```

### Step 7.3: Google Analytics (Optional)
```bash
GOOGLE_ANALYTICS_ID=G-YOUR_GA_ID
```

## 🧪 **PHASE 8: TESTING & VALIDATION** (20 minutes)

### Step 8.1: End-to-End Testing Checklist
**Customer Journey:**
- [ ] Visit pricing page at `https://admin.yourdomain.com`
- [ ] Select a plan and complete payment
- [ ] Receive welcome email with company code
- [ ] Login to admin dashboard
- [ ] Create a training module
- [ ] Test mobile app with company code
- [ ] Submit a support ticket
- [ ] Verify analytics dashboard

**Payment Testing:**
```bash
# Use Stripe test card numbers
# Success: 4242 4242 4242 4242
# Decline: 4000 0000 0000 0002
```

### Step 8.2: Load Testing
```bash
# Test concurrent users (optional)
npm install -g artillery
artillery quick --count 10 --num 5 https://admin.yourdomain.com
```

### Step 8.3: Security Testing
- [ ] SQL injection protection
- [ ] XSS protection  
- [ ] CSRF protection
- [ ] Rate limiting works
- [ ] SSL certificate valid

## 🚀 **PHASE 9: GO LIVE** (5 minutes)

### Step 9.1: Switch to Live Mode
1. **Update Stripe Keys** to live keys (sk_live_, pk_live_)
2. **Update Environment Variables** in Vercel
3. **Redeploy**: `vercel --prod`

### Step 9.2: DNS Propagation
Wait 5-10 minutes for DNS changes to propagate globally.

### Step 9.3: Final Verification
- [ ] Live payments work
- [ ] Email notifications send
- [ ] AI features function
- [ ] Mobile app connects
- [ ] All features operational

## 📈 **PHASE 10: POST-LAUNCH** (Ongoing)

### Step 10.1: Monitor Key Metrics
- **Revenue**: Stripe Dashboard
- **Usage**: Vercel Analytics  
- **Errors**: Vercel Functions Logs
- **Performance**: Vercel Speed Insights

### Step 10.2: Customer Support Setup
- [ ] Monitor `support@yourdomain.com`
- [ ] Respond to support tickets within 4 hours
- [ ] Update knowledge base based on common questions

### Step 10.3: Scaling Considerations
**When you reach 100+ customers:**
- Consider Redis for caching
- Implement database read replicas
- Add CDN for static assets
- Monitor Supabase usage limits

## 🆘 **TROUBLESHOOTING GUIDE**

### Common Issues:

**"Stripe webhook failed"**
- Verify webhook URL is correct
- Check webhook secret matches
- Ensure endpoint is publicly accessible

**"Email not sending"**
- Verify Gmail app password
- Check SMTP credentials
- Test with simple email first

**"AI module builder not working"**
- Verify OpenAI API key
- Check API usage limits
- Monitor OpenAI dashboard

**"Mobile app can't connect"**
- Verify company code generation
- Check Supabase connection
- Test with demo company code

**"Dashboard showing no data"**
- Check Supabase service role key
- Verify database tables exist
- Run database setup SQL if needed

### Support Contacts:
- **Vercel Support**: https://vercel.com/help
- **Stripe Support**: https://support.stripe.com/
- **Supabase Support**: https://supabase.com/support
- **OpenAI Support**: https://help.openai.com/

## ✅ **SUCCESS METRICS**

Your deployment is successful when:
- [ ] Customers can register and pay
- [ ] Company codes generate automatically
- [ ] Users can login with company codes
- [ ] Training modules can be created and delivered
- [ ] Support tickets are tracked
- [ ] Analytics provide insights
- [ ] Mobile app syncs with web dashboard
- [ ] Email notifications are delivered
- [ ] Revenue is being generated

## 🎉 **CONGRATULATIONS!**

You now have a fully functional, production-ready SaaS platform that can:
- ✅ **Generate Revenue**: Automated customer acquisition and billing
- ✅ **Deliver Value**: AI-powered training content creation and delivery
- ✅ **Scale Automatically**: Handle hundreds of companies and thousands of users
- ✅ **Provide Support**: Integrated ticketing and customer service
- ✅ **Generate Insights**: Real-time analytics and reporting

**Your multi-million dollar SaaS is now live! 🚀**

---

*Last Updated: Phase 4 Completion*
*Status: Production Ready* 