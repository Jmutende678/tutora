-- 🧹 CLEANUP FAKE DATA FOR PRODUCTION DEPLOYMENT
-- Run this in Supabase SQL Editor to remove all demo data

-- Delete all fake/demo data
DELETE FROM analytics WHERE company_id IN (
  SELECT id FROM companies WHERE company_code LIKE 'TUT-2024-DEMO%' OR company_code LIKE 'TUT-2024-TEST%'
);

DELETE FROM support_tickets WHERE company_id IN (
  SELECT id FROM companies WHERE company_code LIKE 'TUT-2024-DEMO%' OR company_code LIKE 'TUT-2024-TEST%'
);

DELETE FROM modules WHERE company_id IN (
  SELECT id FROM companies WHERE company_code LIKE 'TUT-2024-DEMO%' OR company_code LIKE 'TUT-2024-TEST%'
);

DELETE FROM users WHERE company_id IN (
  SELECT id FROM companies WHERE company_code LIKE 'TUT-2024-DEMO%' OR company_code LIKE 'TUT-2024-TEST%'
);

DELETE FROM companies WHERE company_code LIKE 'TUT-2024-DEMO%' OR company_code LIKE 'TUT-2024-TEST%';

-- Create ONE test company for demonstration purposes only
INSERT INTO companies (company_code, name, plan, max_users, admin_user_email, admin_user_name, billing_email) VALUES
('TUT-2024-LIVE01', 'Live Demo Company', 'premium', 200, 'demo@tutoralearn.com', 'Demo Admin', 'demo@tutoralearn.com');

-- Get the company ID for the demo company
DO $$
DECLARE
    demo_company_id UUID;
BEGIN
    SELECT id INTO demo_company_id FROM companies WHERE company_code = 'TUT-2024-LIVE01';
    
    -- Insert a demo user (this won't have auth.users entry - just for display)
    INSERT INTO users (id, company_id, email, name, role, is_active) VALUES
    (gen_random_uuid(), demo_company_id, 'demo@tutoralearn.com', 'Demo Admin', 'admin', true);
    
    -- Insert a sample training module
    INSERT INTO modules (company_id, title, description, content, created_by) VALUES
    (demo_company_id, 'Welcome to Tutora', 'Getting started with your training platform', 
     '{"type": "intro", "sections": [{"title": "Welcome", "content": "Welcome to Tutora training platform!"}]}',
     (SELECT id FROM users WHERE company_id = demo_company_id LIMIT 1));
END $$;

-- Success message
SELECT 'SUCCESS: Fake data cleaned up!' as message;
SELECT 'Created 1 live demo company for testing' as info;
SELECT 'Database is now production-ready' as status; 