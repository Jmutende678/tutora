-- 🚀 FIX ENUM CONSTRAINT ISSUE
-- This script fixes the user_role enum to include 'super_admin'

-- First, let's check what the current enum values are
SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role');

-- Drop the existing enum constraint and recreate it with the correct values
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Create the new constraint with all role values
ALTER TABLE users ADD CONSTRAINT users_role_check 
    CHECK (role IN ('user', 'manager', 'admin', 'super_admin'));

-- Update any existing 'super_admin' values that might have been inserted
UPDATE users SET role = 'admin' WHERE role = 'super_admin' AND role NOT IN ('user', 'manager', 'admin', 'super_admin');

-- Now insert the sample data
INSERT INTO companies (name, plan_type, max_users, max_ai_modules, max_storage_gb) 
VALUES ('Demo Company', 'growth', 25, 50, 10)
ON CONFLICT DO NOTHING;

-- Insert sample user with correct role
INSERT INTO users (email, name, company_id, role, position, points, streak_days)
SELECT 'demo@tutora.com', 'Demo User', c.id, 'admin', 'Manager', 500, 7
FROM companies c 
WHERE c.name = 'Demo Company'
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Enum constraint fixed successfully! Database is now ready.' as status; 