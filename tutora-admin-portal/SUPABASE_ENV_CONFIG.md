# 🔧 SUPABASE ENVIRONMENT CONFIGURATION

## 📋 **Copy This to Create Your .env.local File**

Create a file called `.env.local` in your `tutora-admin-portal` folder and paste this exact content:

```bash
# 🚀 SUPABASE CONFIGURATION (ACTIVE BACKEND)
NEXT_PUBLIC_SUPABASE_URL=https://sphkmvjfufrjbojfahar.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGttdmpmdWZyamJvamZhaGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTY1NDAsImV4cCI6MjA2ODc3MjU0MH0.vdWWqD_XdpPBcT-TfVC5jHL1qTR9Evf4Sc7CP31mp7w
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGttdmpmdWZyamJvamZhaGFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5NjU0MCwiZXhwIjoyMDY4NzcyNTQwfQ.78CLY_DNb6qVzZA050-JdqjpZ7Oq3aeWyKKnT2Ctcxc

# 💳 STRIPE CONFIGURATION (Update with your actual Stripe keys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# 📧 EMAIL CONFIGURATION (Update with your SMTP settings)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=support@tutoralearn.com
SMTP_PASS=your-gmail-app-password

# 🏢 APPLICATION CONFIGURATION
COMPANY_CODE_PREFIX=TUT
ADMIN_EMAIL=admin@tutoralearn.com
SUPPORT_EMAIL=support@tutoralearn.com
SALES_EMAIL=sales@tutoralearn.com
BILLING_EMAIL=billing@tutoralearn.com
APP_DOMAIN=tutoralearn.com
APP_NAME="Tutora Admin Portal"

# 🔐 SECURITY & AUTHENTICATION
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tutora-super-secret-key-change-in-production-2024
JWT_SECRET=another-super-secret-jwt-key-change-in-production-2024

# 🌐 DEPLOYMENT
NODE_ENV=development
APP_URL=http://localhost:3000
API_URL=http://localhost:3000/api

# 🎛️ FEATURE FLAGS
ENABLE_AI_MODULE_BUILDER=true
ENABLE_ADVANCED_ANALYTICS=true
ENABLE_WHITE_LABEL=true
ENABLE_SSO=false
ENABLE_API_ACCESS=true

# 🔍 LOGGING & DEBUG
LOG_LEVEL=info
DEBUG_MODE=false
ENABLE_REQUEST_LOGGING=true

# 🔔 NOTIFICATIONS
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_PUSH_NOTIFICATIONS=false

# 🔥 FIREBASE CONFIGURATION (REMOVED - No longer needed)
# Firebase configuration has been removed as the project now uses Supabase

# 🤖 OPENAI CONFIGURATION (Optional - for AI features)
# OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

## 📝 **How to Create the .env.local File:**

### Option 1: Using Terminal
```bash
cd tutora-admin-portal
touch .env.local
open .env.local
# Then paste the configuration above
```

### Option 2: Using VS Code/Editor
1. Open your `tutora-admin-portal` folder in VS Code
2. Create a new file called `.env.local`
3. Paste the entire configuration above
4. Save the file

## ✅ **What's Already Configured:**
- ✅ **Supabase URL**: Your actual project URL
- ✅ **Supabase Keys**: Your real anon and service role keys
- ✅ **Application Settings**: Tutora branding and configuration
- ✅ **Security**: Development secrets (change for production)

## ⚠️ **What You Need to Update:**
- **Stripe Keys**: Add your actual Stripe test keys
- **Email Settings**: Add your SMTP password if using email features
- **OpenAI Key**: Add if using AI module builder

## 🚀 **After Creating .env.local:**
Run this to test the connection:
```bash
npm run dev
```

Your Supabase backend should now be fully connected! 🎉 