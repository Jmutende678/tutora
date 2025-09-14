# 🚀 Railway Environment Variables Setup

## 📧 Email Configuration (Gmail App Password Method)

Add these environment variables to your Railway deployment:

### **Required Email Variables:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=admin@tutoralearn.com
SMTP_PASS=YOUR_16_CHAR_APP_PASSWORD_HERE
ADMIN_EMAIL=admin@tutoralearn.com
```

### **Existing Variables (Keep These):**
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_stripe_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key_here

# OpenAI Configuration  
OPENAI_API_KEY=sk-your_openai_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key_here

# App Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-railway-domain.railway.app
```

## 🔧 How to Add to Railway:

1. **Go to your Railway project dashboard**
2. **Click on your service**
3. **Go to "Variables" tab**
4. **Add each variable one by one:**
   - Variable Name: `SMTP_HOST`
   - Value: `smtp.gmail.com`
   - Click "Add"
   
5. **Repeat for all email variables above**

## 📱 Get Your Gmail App Password:

1. **Go to**: https://myaccount.google.com/security
2. **Enable 2-Step Verification** (if not already)
3. **Click "App passwords"**
4. **Select "Mail" and "Other (custom name)"**
5. **Name**: "Tutora Website"
6. **Copy the 16-character password** (format: `abcd efgh ijkl mnop`)
7. **Use this as your `SMTP_PASS` value**

## ✅ Test Your Setup:

After adding these variables and redeploying:

1. **Submit contact form** → Check admin@tutoralearn.com
2. **Use AI demo** → Get "HOT LEAD" alert
3. **Check Railway logs** → See email confirmations

## 🎯 Expected Email Notifications:

- **📝 Contact Form**: Professional HTML email with all form details
- **🤖 AI Module**: "HOT LEAD ALERT" when someone uses the demo  
- **👤 Registration**: New user signup notifications
- **💰 Quote Request**: Priority sales alerts

Your email notifications are now fully automated! 🎉
