# 🚀 Tutora Admin Portal

A fully automated business management system for the Tutora learning platform that handles payments, company creation, and user management at scale.

## 🎯 What This Does

This admin portal **completely automates your business operations**:

1. **Customer visits pricing page** → Selects plan and pays with Stripe
2. **Payment succeeds** → Company is automatically created in Firebase  
3. **Company code generated** → Unique code like `TUT-2024-XYZ123` 
4. **Welcome email sent** → Admin gets company code and login details
5. **Flutter app ready** → Users can immediately access training platform

**Zero manual work required!** The system handles thousands of customers automatically.

## 🏗️ Architecture

```
Customer Journey:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Website   │───▶│   Stripe    │───▶│  Firebase   │───▶│ Flutter App │
│  Pricing    │    │  Payment    │    │  Company    │    │   Users     │
│   Plans     │    │ Processing  │    │  Creation   │    │  Training   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Components:

- **🌐 Next.js Website**: Customer-facing pricing and signup
- **💳 Stripe Integration**: Handles all payments and subscriptions  
- **🔥 Firebase Backend**: Stores companies, users, and training data
- **📱 Flutter App**: Mobile/web app for end users
- **📧 Email Automation**: Welcome emails and notifications
- **📊 Admin Dashboard**: Real-time analytics and management

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd tutora-admin-portal
npm install
```

### 2. Environment Setup
Copy `env.example` to `.env.local` and configure:

```bash
# Stripe (get from stripe.com dashboard)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Firebase (get from Firebase console)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Email (use Gmail or custom SMTP)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Customize your branding
COMPANY_CODE_PREFIX=TUT
APP_DOMAIN=yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the pricing page!

## 💳 Payment Plans

The system includes 3 intelligent pricing tiers:

### Basic ($99/month)
- Up to 50 users
- Basic training modules  
- Progress tracking
- Email support

### Premium ($299/month) 
- Up to 200 users
- Advanced training modules
- Custom quizzes & branding
- Priority support

### Enterprise ($999/month)
- Unlimited users
- White-label solution
- Dedicated support
- Custom integrations

**Plans are easily customizable in `src/lib/stripe.ts`**

## 🔄 Automated Workflows

### New Company Signup
1. Customer selects plan on pricing page
2. Stripe checkout processes payment
3. Webhook triggers company creation
4. Firebase creates company record
5. Unique company code generated (`TUT-2024-ABC123`)
6. Admin user created with full permissions
7. Default training modules added
8. Welcome email sent with company code
9. Company immediately ready for users

### User Management
- **Auto-scaling**: User limits enforced based on plan
- **Role-based access**: Admin, Manager, User roles
- **Progress tracking**: Automatic progress analytics
- **Notifications**: Email alerts for important events

### Payment Management
- **Automatic billing**: Stripe handles recurring payments
- **Failed payments**: Automatic retry and notification
- **Plan changes**: Instant upgrades/downgrades
- **Cancellations**: Graceful account suspension

## 📊 Admin Dashboard Features

### Real-time Analytics
- Revenue tracking and projections
- Company signup metrics  
- User engagement analytics
- Payment success rates
- Geographic distribution

### Company Management
- View all companies and their status
- Monitor user counts and plan limits
- Handle support requests
- Manage billing and subscriptions

### User Insights
- Track learning progress across companies
- Identify top-performing content
- Monitor completion rates
- Generate compliance reports

## 🔧 Easy Customization

### Change Pricing Plans
Edit `src/lib/stripe.ts`:
```typescript
export const PRICING_PLANS = {
  basic: {
    price: 149, // Change price
    maxUsers: 100, // Change limits
    features: ['New feature'] // Add features
  }
}
```

### Customize Company Codes
Edit environment variables:
```bash
COMPANY_CODE_PREFIX=YOUR  # Creates YOUR-2024-ABC123
```

### Custom Email Templates
Edit `src/lib/email.ts` to customize:
- Welcome emails
- Payment notifications  
- User invitations
- Support requests

### Custom Branding
- Logo: Replace in `public/logo.png`
- Colors: Edit `tailwind.config.js`
- Content: Update pricing page copy

## 📈 Scaling for Growth

### Built for Enterprise Scale
- **Firebase**: Auto-scales to millions of users
- **Stripe**: Handles global payments seamlessly  
- **Next.js**: Optimized for high traffic
- **CDN Ready**: Deploy globally with Vercel

### Performance Optimizations
- Server-side rendering for SEO
- Automatic code splitting
- Image optimization
- Database query optimization
- Caching strategies

### Security Features
- Stripe PCI compliance
- Firebase security rules
- Environment variable protection
- Webhook signature verification
- Rate limiting on API endpoints

## 🚀 Deployment

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel --env-file=.env.local
```

### Option 2: Docker
```bash
docker build -t tutora-admin .
docker run -p 3000:3000 tutora-admin
```

### Option 3: Traditional Hosting
```bash
npm run build
npm start
```

## 🔗 Integration with Flutter App

The admin portal creates companies that immediately work with your Flutter app:

### Firebase Connection
- Same Firebase project
- Shared user authentication
- Real-time data sync
- Automatic user provisioning

### Company Code Flow
1. User opens Flutter app
2. Enters company code (e.g., `TUT-2024-ABC123`)
3. App queries Firebase for company
4. User logs in with email/password
5. Access to company's training content

### Data Structure
```javascript
// Company document in Firebase
{
  id: "company_123",
  companyCode: "TUT-2024-ABC123", 
  name: "Acme Corp",
  plan: "premium",
  maxUsers: 200,
  currentUsers: 45,
  modules: [...], // Training content
  users: [...] // Employee accounts
}
```

## 📧 Email Automation

### Automated Emails
- **Welcome Email**: Company code + getting started
- **Payment Success**: Receipt and confirmation
- **Payment Failed**: Update payment method
- **User Invitations**: Login credentials
- **Support Requests**: Automatic routing

### Email Providers
- Gmail SMTP (easiest setup)
- SendGrid (high volume)
- AWS SES (cost-effective)
- Custom SMTP server

## 🛠️ API Endpoints

### Public API
- `GET /api/plans` - Get pricing plans
- `POST /api/checkout` - Create Stripe checkout
- `POST /api/webhooks/stripe` - Handle payments

### Admin API  
- `GET /api/companies` - List all companies
- `GET /api/analytics` - Revenue and usage data
- `POST /api/companies/:id/suspend` - Suspend company

### Company API
- `GET /api/company/:code` - Get company by code
- `POST /api/users` - Create new user
- `GET /api/modules` - Get training modules

## 🔍 Troubleshooting

### Common Issues

**Stripe webhook not working:**
```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Firebase connection failed:**
- Check Firebase credentials in `.env.local`
- Verify service account permissions
- Ensure Firestore is enabled

**Email not sending:**
- Verify SMTP credentials
- Check Gmail app password setup
- Test with a simple email first

**Company code not generating:**
- Check `COMPANY_CODE_PREFIX` in environment
- Verify nanoid package installation
- Check Firebase write permissions

### Debug Mode
Set `NODE_ENV=development` for detailed logging:
```bash
NODE_ENV=development npm run dev
```

## 📞 Support

### Getting Help
- **Documentation**: Check this README first
- **Issues**: Create GitHub issue with details
- **Email**: Contact support@yourdomain.com
- **Live Chat**: Available in admin dashboard

### Professional Setup
Need help setting up? We offer:
- **1-hour setup call**: $200
- **Complete deployment**: $500  
- **Custom development**: Contact for quote
- **Ongoing support**: $99/month

## 🎯 Next Steps

1. **Set up environment variables** from the examples
2. **Configure Stripe** webhooks and products
3. **Test the complete flow** with a test payment
4. **Customize branding** and pricing
5. **Deploy to production** with your domain
6. **Connect your Flutter app** to the same Firebase

**Result**: A completely automated business that scales to thousands of customers! 🚀

---

### 📜 License
This project is proprietary. All rights reserved.

### 🤝 Contributing  
Contributions welcome! Please read contributing guidelines first.

**Ready to automate your business? Let's get started! 🚀** # Force deployment
