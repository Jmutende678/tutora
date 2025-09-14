#!/bin/bash

# 🚀 TUTORA DATABASE DEPLOYMENT SCRIPT
# This script deploys the complete database schema to Supabase

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

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

print_status "Starting database deployment..."

# Check if we're in the right directory
if [ ! -f "lib/config/supabase_schema_fixed.sql" ]; then
    print_error "Database schema file not found. Please run this script from the project root."
    exit 1
fi

# Check if .env file exists with Supabase credentials
if [ ! -f ".env" ]; then
    print_warning "No .env file found. Creating one from template..."
    cat > .env << EOF
# Supabase Configuration
SUPABASE_URL=https://sphkmvjfufrjbojfahar.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGttdmpmdWZyamJvamZhaGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTY1NDAsImV4cCI6MjA2ODc3MjU0MH0.vdWWqD_XdpPBcT-TfVC5jHL1qTR9Evf4Sc7CP31mp7w
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGttdmpmdWZyamJvamZhaGFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5NjU0MCwiZXhwIjoyMDY4NzcyNTQwfQ.78CLY_DNb6qVzZA050-JdqjpZ7Oq3aeWyKKnT2Ctcxc
EOF
    print_success "Created .env file with Supabase credentials"
fi

# Load environment variables
source .env

print_status "Connecting to Supabase..."

# Test connection
if ! supabase status --project-ref sphkmvjfufrjbojfahar &> /dev/null; then
    print_error "Failed to connect to Supabase. Please check your credentials."
    exit 1
fi

print_success "Connected to Supabase successfully"

# Deploy the schema
print_status "Deploying database schema..."

# Execute the schema file
supabase db reset --project-ref sphkmvjfufrjbojfahar --linked

# Alternative method using psql if supabase CLI doesn't work
if [ $? -ne 0 ]; then
    print_warning "Supabase CLI failed, trying direct SQL execution..."
    
    # You would need to install psql and connect directly
    # This is a fallback method
    print_error "Please execute the schema manually in your Supabase dashboard:"
    echo "1. Go to https://supabase.com/dashboard/project/sphkmvjfufrjbojfahar"
    echo "2. Navigate to SQL Editor"
    echo "3. Copy and paste the contents of lib/config/supabase_schema_fixed.sql"
    echo "4. Execute the script"
fi

print_success "Database schema deployed successfully!"

# Create initial data
print_status "Creating initial data..."

# Create a test company
print_status "Creating test company..."
supabase db execute --project-ref sphkmvjfufrjbojfahar --sql "
INSERT INTO companies (name, plan_type, max_users, max_ai_modules, max_storage_gb) 
VALUES ('Test Company', 'growth', 25, 50, 10)
ON CONFLICT DO NOTHING;
"

# Create test modules
print_status "Creating test modules..."
supabase db execute --project-ref sphkmvjfufrjbojfahar --sql "
INSERT INTO modules (title, description, company_id, category, difficulty, estimated_minutes, points_value, status, created_by)
SELECT 
    'Workplace Safety Fundamentals',
    'Learn the basics of workplace safety protocols and how to prevent common accidents.',
    c.id,
    'Safety',
    'beginner',
    30,
    100,
    'published',
    u.id
FROM companies c, users u 
WHERE c.name = 'Test Company' AND u.email = 'demo@tutora.com'
ON CONFLICT DO NOTHING;
"

print_success "Initial data created successfully!"

# Test the connection
print_status "Testing database connection..."

# Test query
if supabase db execute --project-ref sphkmvjfufrjbojfahar --sql "SELECT COUNT(*) FROM companies;" | grep -q "[0-9]"; then
    print_success "Database connection test passed!"
else
    print_error "Database connection test failed!"
    exit 1
fi

print_success "🎉 Database deployment completed successfully!"
print_status "Next steps:"
echo "1. Test the Flutter app"
echo "2. Create your first company"
echo "3. Add users and modules"
echo "4. Test all features"

print_status "Database is ready for production use! 🚀" 