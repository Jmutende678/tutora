-- 🚀 TUTORA COMPLETE FINAL DATABASE SCHEMA
-- This is the ONLY script you need to run - it includes all fixes

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- COMPANIES TABLE (Multi-tenant foundation)
-- ========================================
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company_code VARCHAR(10) UNIQUE,
    domain VARCHAR(255),
    plan_type VARCHAR(20) DEFAULT 'starter',
    max_users INTEGER DEFAULT 10,
    max_ai_modules INTEGER DEFAULT 10,
    max_storage_gb INTEGER DEFAULT 5,
    status VARCHAR(20) DEFAULT 'active',
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    subscription_status VARCHAR(20) DEFAULT 'trialing',
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settings JSONB DEFAULT '{}',
    branding JSONB DEFAULT '{}'
);

-- ========================================
-- USERS TABLE (Multi-tenant users)
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'user',
    position VARCHAR(255),
    department VARCHAR(255),
    avatar_url TEXT,
    points INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true
);

-- ========================================
-- MODULES TABLE (Training content)
-- ========================================
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(20) DEFAULT 'beginner',
    estimated_minutes INTEGER DEFAULT 30,
    points_value INTEGER DEFAULT 100,
    content_type VARCHAR(20) DEFAULT 'video',
    content_url TEXT,
    thumbnail_url TEXT,
    is_ai_generated BOOLEAN DEFAULT false,
    ai_prompt TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- ========================================
-- MODULE_ASSIGNMENTS TABLE (User assignments)
-- ========================================
CREATE TABLE IF NOT EXISTS module_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'assigned',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    score INTEGER,
    time_spent_minutes INTEGER DEFAULT 0,
    UNIQUE(module_id, user_id)
);

-- ========================================
-- QUIZZES TABLE (Module assessments)
-- ========================================
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    passing_score INTEGER DEFAULT 70,
    time_limit_minutes INTEGER,
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- QUESTIONS TABLE (Quiz questions)
-- ========================================
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice',
    options JSONB,
    correct_answer TEXT,
    points INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- QUIZ_ATTEMPTS TABLE (User quiz attempts)
-- ========================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER,
    max_score INTEGER,
    passed BOOLEAN,
    time_taken_minutes INTEGER,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    answers JSONB DEFAULT '[]'
);

-- ========================================
-- CERTIFICATES TABLE (Achievement certificates)
-- ========================================
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active',
    metadata JSONB DEFAULT '{}'
);

-- ========================================
-- LEADERBOARDS TABLE (Competition system)
-- ========================================
CREATE TABLE IF NOT EXISTS leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    criteria VARCHAR(50) DEFAULT 'points',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- LEADERBOARD_ENTRIES TABLE (User rankings)
-- ========================================
CREATE TABLE IF NOT EXISTS leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leaderboard_id UUID REFERENCES leaderboards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0,
    rank INTEGER,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(leaderboard_id, user_id)
);

-- ========================================
-- NOTIFICATIONS TABLE (User notifications)
-- ========================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    priority VARCHAR(10) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ANALYTICS TABLE (Usage tracking)
-- ========================================
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id VARCHAR(255),
    user_agent TEXT
);

-- ========================================
-- SUPPORT_TICKETS TABLE (Customer support)
-- ========================================
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'open',
    category VARCHAR(50) DEFAULT 'general',
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TICKET_MESSAGES TABLE (Support conversations)
-- ========================================
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- SUBSCRIPTIONS TABLE (Billing management)
-- ========================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    plan_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- USAGE_TRACKING TABLE (Plan enforcement)
-- ========================================
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    tracking_date DATE NOT NULL,
    active_users INTEGER DEFAULT 0,
    ai_modules_created INTEGER DEFAULT 0,
    storage_used_gb DECIMAL(10,2) DEFAULT 0,
    modules_completed INTEGER DEFAULT 0,
    quizzes_taken INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, tracking_date)
);

-- ========================================
-- CREATE INDEXES
-- ========================================
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_modules_company_id ON modules(company_id);
CREATE INDEX IF NOT EXISTS idx_module_assignments_user_id ON module_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_module_assignments_module_id ON module_assignments(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_company_id ON analytics(company_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_support_tickets_company_id ON support_tickets(company_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entries_leaderboard_id ON leaderboard_entries(leaderboard_id);

-- ========================================
-- CREATE FUNCTIONS
-- ========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Auto-generate company codes
CREATE OR REPLACE FUNCTION generate_company_code()
RETURNS TRIGGER AS $$
DECLARE
    new_code VARCHAR(10);
    counter INTEGER := 0;
BEGIN
    LOOP
        new_code := 'TUT' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
        counter := counter + 1;
        
        EXIT WHEN NOT EXISTS (SELECT 1 FROM companies WHERE company_code = new_code);
        EXIT WHEN counter > 100; -- Prevent infinite loop
    END LOOP;
    
    NEW.company_code := new_code;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Auto-generate certificate numbers
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.certificate_number := 'CERT-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                             LPAD(NEW.id::TEXT, 8, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Update leaderboard rankings
CREATE OR REPLACE FUNCTION update_leaderboard_rankings()
RETURNS TRIGGER AS $$
BEGIN
    -- Update rankings for the affected leaderboard
    UPDATE leaderboard_entries 
    SET rank = subquery.rank
    FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY score DESC) as rank
        FROM leaderboard_entries 
        WHERE leaderboard_id = NEW.leaderboard_id
    ) subquery
    WHERE leaderboard_entries.id = subquery.id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ========================================
-- CREATE TRIGGERS
-- ========================================
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_modules_updated_at ON modules;
DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON support_tickets;
DROP TRIGGER IF EXISTS generate_company_code_trigger ON companies;
DROP TRIGGER IF EXISTS generate_certificate_number_trigger ON certificates;
DROP TRIGGER IF EXISTS update_leaderboard_rankings_trigger ON leaderboard_entries;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER generate_company_code_trigger BEFORE INSERT ON companies
    FOR EACH ROW WHEN (NEW.company_code IS NULL)
    EXECUTE FUNCTION generate_company_code();

CREATE TRIGGER generate_certificate_number_trigger BEFORE INSERT ON certificates
    FOR EACH ROW WHEN (NEW.certificate_number IS NULL)
    EXECUTE FUNCTION generate_certificate_number();

CREATE TRIGGER update_leaderboard_rankings_trigger 
    AFTER INSERT OR UPDATE ON leaderboard_entries
    FOR EACH ROW EXECUTE FUNCTION update_leaderboard_rankings();

-- ========================================
-- ENABLE ROW LEVEL SECURITY
-- ========================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- ========================================
-- DROP EXISTING POLICIES AND CREATE NEW ONES
-- ========================================
DROP POLICY IF EXISTS "Super admins can access all companies" ON companies;
DROP POLICY IF EXISTS "Users can access their own company users" ON users;
DROP POLICY IF EXISTS "Users can access their company modules" ON modules;
DROP POLICY IF EXISTS "Users can access their own assignments" ON module_assignments;
DROP POLICY IF EXISTS "Users can access their own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can access their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can access their company analytics" ON analytics;
DROP POLICY IF EXISTS "Users can access their company support tickets" ON support_tickets;

-- Create policies
CREATE POLICY "Super admins can access all companies" ON companies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'super_admin'
        )
    );

CREATE POLICY "Users can access their own company users" ON users
    FOR ALL USING (
        company_id = (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can access their company modules" ON modules
    FOR ALL USING (
        company_id = (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can access their own assignments" ON module_assignments
    FOR ALL USING (
        user_id = auth.uid() OR
        module_id IN (
            SELECT id FROM modules 
            WHERE company_id = (
                SELECT company_id FROM users WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can access their own quiz attempts" ON quiz_attempts
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can access their own notifications" ON notifications
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can access their company analytics" ON analytics
    FOR ALL USING (
        company_id = (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can access their company support tickets" ON support_tickets
    FOR ALL USING (
        company_id = (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

-- ========================================
-- CREATE SAMPLE DATA
-- ========================================

-- Insert sample company
INSERT INTO companies (name, plan_type, max_users, max_ai_modules, max_storage_gb) 
VALUES ('Demo Company', 'growth', 25, 50, 10)
ON CONFLICT DO NOTHING;

-- Insert sample user
INSERT INTO users (email, name, company_id, role, position, points, streak_days)
SELECT 'demo@tutora.com', 'Demo User', c.id, 'admin', 'Manager', 500, 7
FROM companies c 
WHERE c.name = 'Demo Company'
ON CONFLICT DO NOTHING;

-- Success message
SELECT '🎉 COMPLETE! Database schema deployed successfully! All tables, triggers, and policies are now ready.' as status; 