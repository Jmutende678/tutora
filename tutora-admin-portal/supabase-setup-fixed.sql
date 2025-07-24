-- 🚀 TUTORA SUPABASE DATABASE SETUP (FIXED VERSION)
-- Copy and paste this entire script into Supabase SQL Editor

-- Drop existing tables if they exist (cleanup)
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Companies table
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  plan TEXT CHECK (plan IN ('basic', 'premium', 'enterprise')) NOT NULL DEFAULT 'basic',
  max_users INTEGER NOT NULL DEFAULT 50,
  current_users INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  admin_user_email TEXT NOT NULL,
  admin_user_name TEXT NOT NULL,
  billing_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends auth.users but doesn't modify it)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'manager', 'user')) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modules table
CREATE TABLE modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_companies_code ON companies(company_code);
CREATE INDEX idx_companies_active ON companies(is_active);
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_modules_company ON modules(company_id);
CREATE INDEX idx_modules_active ON modules(is_active);
CREATE INDEX idx_tickets_company ON support_tickets(company_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_analytics_company ON analytics(company_id);
CREATE INDEX idx_analytics_user ON analytics(user_id);

-- Enable Row Level Security on all custom tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Companies: Service role can manage all companies (for registration)
CREATE POLICY "Service role can manage companies" ON companies
  FOR ALL USING (auth.role() = 'service_role');

-- Companies: Users can see their own company  
CREATE POLICY "Users can view own company" ON companies
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM users WHERE company_id = companies.id
    )
  );

-- Users: Service role can manage all users
CREATE POLICY "Service role can manage users" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Users: Users can see users in their company
CREATE POLICY "Users can view company users" ON users
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Users: Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid());

-- Modules: Service role can manage all modules
CREATE POLICY "Service role can manage modules" ON modules
  FOR ALL USING (auth.role() = 'service_role');

-- Modules: Users can see modules in their company
CREATE POLICY "Users can view company modules" ON modules
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Support tickets: Service role can manage all tickets
CREATE POLICY "Service role can manage tickets" ON support_tickets
  FOR ALL USING (auth.role() = 'service_role');

-- Support tickets: Users can see their company's tickets
CREATE POLICY "Users can view company tickets" ON support_tickets
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Support tickets: Users can create tickets
CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    ) AND user_id = auth.uid()
  );

-- Analytics: Service role can manage all analytics
CREATE POLICY "Service role can manage analytics" ON analytics
  FOR ALL USING (auth.role() = 'service_role');

-- Analytics: Users can see their company's analytics
CREATE POLICY "Users can view company analytics" ON analytics
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert demo data for testing
INSERT INTO companies (company_code, name, plan, max_users, admin_user_email, admin_user_name, billing_email) VALUES
('TUT-2024-DEMO01', 'Demo Company 1', 'basic', 50, 'admin@demo1.com', 'Demo Admin', 'billing@demo1.com'),
('TUT-2024-DEMO02', 'Demo Company 2', 'premium', 200, 'admin@demo2.com', 'Premium Admin', 'billing@demo2.com'),
('TUT-2024-TEST01', 'Test Company', 'enterprise', 1000, 'test@tutoralearn.com', 'Test Admin', 'billing@test.com');

-- Success message
SELECT 'SUCCESS: Tutora database setup completed!' as message;
SELECT 'Created 5 tables: companies, users, modules, support_tickets, analytics' as info;
SELECT 'Added 3 demo companies for testing' as demo_data;
SELECT 'Security policies configured' as security; 