#!/bin/bash

# 🚀 Tutora Admin Portal - Automated Setup Script
# This script sets up a complete business automation system

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fancy banner
echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    🚀 TUTORA ADMIN PORTAL                     ║"
echo "║                                                               ║"
echo "║    Automated Business System for Learning Platforms          ║"
echo "║                                                               ║"
echo "║    • Stripe Payment Processing                                ║"
echo "║    • Automatic Company Creation                               ║"
echo "║    • Firebase User Management                                 ║"
echo "║    • Email Automation                                         ║"
echo "║    • Real-time Analytics Dashboard                            ║"
echo "║                                                               ║"
echo "║    Ready to scale to 10,000+ customers automatically! 🎯     ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${CYAN}🔧 Starting intelligent setup process...${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check for Homebrew
if ! command_exists brew; then
    print_error "Homebrew not found. Please install Homebrew first:"
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

print_success "Homebrew found ✓"

# Check and install Node.js
if ! command_exists node; then
    print_status "Installing Node.js..."
    brew install node
    print_success "Node.js installed ✓"
else
    NODE_VERSION=$(node --version)
    print_success "Node.js already installed: $NODE_VERSION ✓"
fi

# Check and install npm
if ! command_exists npm; then
    print_error "npm not found. Please ensure Node.js is properly installed."
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm found: v$NPM_VERSION ✓"

# Install dependencies
print_status "Installing project dependencies..."
npm install --verbose

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully ✓"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check if environment file exists
if [ ! -f ".env.local" ]; then
    print_warning "Environment file not found. Creating from template..."
    
    if [ -f "env.example" ]; then
        cp env.example .env.local
        print_success "Environment file created from template ✓"
    else
        print_warning "env.example not found. Creating basic environment file..."
        
        cat > .env.local << 'EOF'
# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Stripe Configuration (get from stripe.com dashboard)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Firebase Admin Configuration (get from Firebase console)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key-here\n-----END PRIVATE KEY-----"

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application Configuration
COMPANY_CODE_PREFIX=TUT
ADMIN_EMAIL=admin@yourdomain.com
APP_NAME="Tutora Admin Portal"
APP_DOMAIN=yourdomain.com

# Security
JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here
EOF
        print_success "Basic environment file created ✓"
    fi
    
    print_warning "⚠️  IMPORTANT: You need to configure your environment variables in .env.local"
    echo ""
    echo -e "${YELLOW}Required configurations:${NC}"
    echo "  1. 🔸 Stripe API keys (from stripe.com dashboard)"
    echo "  2. 🔸 Firebase credentials (from Firebase console)"  
    echo "  3. 🔸 Email SMTP settings (Gmail recommended)"
    echo "  4. 🔸 Custom domain and branding"
    echo ""
else
    print_success "Environment file found ✓"
fi

# Install Stripe CLI for webhook testing (optional)
if ! command_exists stripe; then
    print_status "Installing Stripe CLI for webhook testing..."
    brew install stripe/stripe-cli/stripe
    if [ $? -eq 0 ]; then
        print_success "Stripe CLI installed ✓"
        print_status "To test webhooks locally, run: stripe login && stripe listen --forward-to localhost:3000/api/webhooks/stripe"
    else
        print_warning "Stripe CLI installation failed (optional tool)"
    fi
else
    print_success "Stripe CLI already installed ✓"
fi

# Create scripts for easy management
cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Tutora Admin Portal..."
npm run dev
EOF

cat > build.sh << 'EOF'
#!/bin/bash
echo "🏗️ Building Tutora Admin Portal for production..."
npm run build
EOF

cat > deploy.sh << 'EOF'
#!/bin/bash
echo "🚀 Deploying Tutora Admin Portal..."
if command -v vercel >/dev/null 2>&1; then
    vercel --prod
else
    echo "Installing Vercel CLI..."
    npm install -g vercel
    vercel --prod
fi
EOF

chmod +x start.sh build.sh deploy.sh

print_success "Management scripts created ✓"

# Final setup summary
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    ✅ SETUP COMPLETE!                        ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}🎯 What's Ready:${NC}"
echo -e "  ${GREEN}✓${NC} Node.js and npm installed"
echo -e "  ${GREEN}✓${NC} All project dependencies installed"  
echo -e "  ${GREEN}✓${NC} Environment template created"
echo -e "  ${GREEN}✓${NC} Management scripts ready"
echo -e "  ${GREEN}✓${NC} Stripe CLI installed (for testing)"
echo ""

echo -e "${YELLOW}🔧 Next Steps:${NC}"
echo ""
echo -e "${PURPLE}1. Configure Environment Variables:${NC}"
echo -e "   ${CYAN}nano .env.local${NC}  # Edit with your API keys"
echo ""
echo -e "${PURPLE}2. Start Development Server:${NC}"
echo -e "   ${CYAN}./start.sh${NC}      # or: npm run dev"
echo ""
echo -e "${PURPLE}3. Visit Your Admin Portal:${NC}"
echo -e "   ${CYAN}http://localhost:3000${NC}"
echo ""

echo -e "${BLUE}🚀 Key Features You'll Have:${NC}"
echo ""
echo -e "  ${GREEN}💳 Automated Payments${NC} - Stripe handles all transactions"
echo -e "  ${GREEN}🏢 Company Creation${NC} - Automatic setup with unique codes"  
echo -e "  ${GREEN}📧 Email Automation${NC} - Welcome emails and notifications"
echo -e "  ${GREEN}📊 Analytics Dashboard${NC} - Real-time business metrics"
echo -e "  ${GREEN}👥 User Management${NC} - Automatic user provisioning"
echo -e "  ${GREEN}📱 Flutter Integration${NC} - Seamless mobile app connection"
echo ""

echo -e "${CYAN}💡 Pro Tips:${NC}"
echo -e "  • Use Stripe test mode first: ${YELLOW}sk_test_...${NC}"
echo -e "  • Set up Firebase project: ${YELLOW}console.firebase.google.com${NC}"
echo -e "  • Enable Gmail 2FA for SMTP: ${YELLOW}myaccount.google.com/apppasswords${NC}"
echo -e "  • Test webhooks locally: ${YELLOW}stripe listen --forward-to localhost:3000/api/webhooks/stripe${NC}"
echo ""

echo -e "${GREEN}🎉 Your automated business system is ready to scale!${NC}"
echo ""

# Optional: Open VS Code if available
if command_exists code; then
    read -p "Open project in VS Code? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        code .
        print_success "Project opened in VS Code ✓"
    fi
fi

print_success "Setup script completed successfully! 🚀"
echo ""
echo -e "${PURPLE}Ready to automate your learning platform business? Let's go! 🎯${NC}" 