-- Website Activity Tracking Table
-- This table stores all website visitor activity including form submissions, page views, and interactions

CREATE TABLE IF NOT EXISTS website_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(100) NOT NULL, -- 'contact_form_submission', 'registration_form_submission', 'page_view', 'ai_module_generation_started', etc.
    user_email VARCHAR(255),
    user_name VARCHAR(255),
    company VARCHAR(255),
    phone VARCHAR(255),
    inquiry_type VARCHAR(100),
    subject VARCHAR(255),
    message TEXT,
    lead_score JSONB DEFAULT '{}'::jsonb, -- { score: number, category: 'hot'|'warm'|'cold', reasons: string[] }
    data JSONB DEFAULT '{}'::jsonb, -- Additional form data (team_size, industry, urgency, etc.)
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source VARCHAR(255), -- Page URL or source
    metadata JSONB DEFAULT '{}'::jsonb, -- IP address, user agent, referrer, location, device info
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_website_activity_type ON website_activity(type);
CREATE INDEX IF NOT EXISTS idx_website_activity_timestamp ON website_activity(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_website_activity_user_email ON website_activity(user_email);
CREATE INDEX IF NOT EXISTS idx_website_activity_lead_score ON website_activity USING GIN(lead_score);
CREATE INDEX IF NOT EXISTS idx_website_activity_data ON website_activity USING GIN(data);

-- Row Level Security (allow public access for website tracking)
ALTER TABLE website_activity ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for website activity tracking
CREATE POLICY "Allow public website activity inserts" ON website_activity
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read all website activity (for admin dashboard)
CREATE POLICY "Allow authenticated users to read website activity" ON website_activity
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to read all website activity
CREATE POLICY "Allow service role to read website activity" ON website_activity
    FOR ALL USING (auth.role() = 'service_role');
