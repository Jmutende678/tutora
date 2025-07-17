# 📊 Google Analytics & Search Console Setup Guide

## Step 1: Google Analytics 4 Setup

### 1.1 Create Analytics Account
1. Go to https://analytics.google.com/
2. Click "Start measuring"
3. Create account name: "Tutora"
4. Choose "Web" property
5. Enter website details:
   - Website name: "Tutora AI Training Platform"
   - Website URL: https://tutora-g6d5ktgta-johns-projects-eb6ca0cb.vercel.app
   - Industry: "Professional Services"
   - Reporting time zone: Your timezone

### 1.2 Install Tracking Code
Add this to `tutora-admin-portal/src/app/layout.tsx` in the `<head>` section:

```jsx
{/* Google Analytics */}
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

### 1.3 Key Events to Track
Set up these custom events for your SaaS:
- **sign_up**: Free trial registrations
- **purchase**: Subscription purchases  
- **demo_request**: Demo form submissions
- **pricing_view**: Pricing page visits
- **feature_view**: Features page engagement

## Step 2: Google Search Console Setup

### 2.1 Add Property
1. Go to https://search.google.com/search-console/
2. Click "Add property"
3. Choose "URL prefix"
4. Enter: https://tutora-g6d5ktgta-johns-projects-eb6ca0cb.vercel.app
5. Verify ownership using HTML file method or DNS record

### 2.2 Submit Sitemap
1. In Search Console, go to "Sitemaps"
2. Submit: https://tutora-g6d5ktgta-johns-projects-eb6ca0cb.vercel.app/sitemap.xml
3. Submit: https://tutora-g6d5ktgta-johns-projects-eb6ca0cb.vercel.app/sitemap-0.xml

### 2.3 Request Indexing for Key Pages
Manually request indexing for:
- Homepage: /
- Features: /features  
- Solutions: /solutions
- About: /about
- Pricing: /pricing
- Demo: /demo/ai-module-builder

## Step 3: Analytics Goals & KPIs

### Track These Metrics:
- **Organic Traffic Growth**: Target 50% month-over-month
- **Keyword Rankings**: Track "AI employee training", "training module builder"  
- **Conversion Rate**: Free trial signups from organic traffic
- **Page Performance**: Time on page, bounce rate for key pages
- **Technical SEO**: Core Web Vitals, page speed

### Set Up Conversion Goals:
1. **Free Trial Goal**: /success page visit
2. **Demo Request Goal**: /demo/ai-module-builder completion
3. **Pricing Engagement**: Time on /pricing > 2 minutes
4. **Contact Form**: /contact form submission

## Step 4: Weekly Reporting Dashboard

Create reports to track:
- Organic traffic vs paid traffic
- Top performing keywords
- Page speed metrics
- Mobile vs desktop performance
- Geographic traffic distribution

**Expected Timeline**: 2-4 weeks to see initial SEO data, 3-6 months for significant organic growth. 