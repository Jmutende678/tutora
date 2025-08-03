#!/bin/bash

# 🚀 TUTORA ADMIN PORTAL DEPLOYMENT SCRIPT
# This script deploys the admin portal to Vercel

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}🔧 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the tutora-admin-portal directory"
    exit 1
fi

print_status "Starting admin portal deployment..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning "No .env.local file found. Creating one from template..."
    cat > .env.local << EOF
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

# 🤖 OPENAI CONFIGURATION (Optional - for AI features)
# OPENAI_API_KEY=sk-proj-your-openai-api-key-here
EOF
    print_success "Created .env.local file with default configuration"
    print_warning "Please update the configuration with your actual values before deploying"
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build the application
print_status "Building the application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    print_error "Build failed. Please fix the errors and try again."
    exit 1
fi

print_success "Build completed successfully!"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."

# Check if already linked to a Vercel project
if [ ! -f ".vercel/project.json" ]; then
    print_status "Linking to Vercel project..."
    vercel link --yes
fi

# Deploy
vercel --prod --yes

if [ $? -eq 0 ]; then
    print_success "🎉 Admin portal deployed successfully!"
    
    # Get deployment URL
    DEPLOY_URL=$(vercel ls | grep "tutora-admin-portal" | head -1 | awk '{print $2}')
    
    if [ ! -z "$DEPLOY_URL" ]; then
        print_success "🌐 Admin Portal URL: $DEPLOY_URL"
        print_success "📊 Dashboard: $DEPLOY_URL/admin/dashboard"
        print_success "👥 User Management: $DEPLOY_URL/admin/users"
        print_success "📚 Module Management: $DEPLOY_URL/admin/modules"
    fi
    
    print_status "Next steps:"
    echo "1. Update environment variables in Vercel dashboard"
    echo "2. Configure Stripe webhooks"
    echo "3. Set up email service"
    echo "4. Test all features"
    echo "5. Configure custom domain (optional)"
    
else
    print_error "Deployment failed. Please check the error messages above."
    exit 1
fi

print_success "Admin portal deployment completed! 🚀"
