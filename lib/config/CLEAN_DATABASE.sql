-- 🧹 COMPLETE DATABASE CLEANUP
-- This script will delete everything and give you a fresh start

-- ========================================
-- STEP 1: DROP ALL TABLES
-- ========================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS quiz_responses CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- ========================================
-- STEP 2: DROP ALL ENUM TYPES
-- ========================================

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS plan_type CASCADE;
DROP TYPE IF EXISTS module_type CASCADE;
DROP TYPE IF EXISTS interaction_type CASCADE;
DROP TYPE IF EXISTS assignment_status CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;

-- ========================================
-- STEP 3: DROP ALL FUNCTIONS
-- ========================================

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS track_analytics_event(UUID, UUID, VARCHAR, JSONB) CASCADE;
DROP FUNCTION IF EXISTS can_access_module(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS get_user_company_id(UUID) CASCADE;

-- ========================================
-- STEP 4: DROP ALL TRIGGERS
-- ========================================

-- Triggers are automatically dropped when tables are dropped, but let's be explicit
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_modules_updated_at ON modules;
DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
DROP TRIGGER IF EXISTS update_assignments_updated_at ON assignments;
DROP TRIGGER IF EXISTS update_lesson_progress_updated_at ON lesson_progress;
DROP TRIGGER IF EXISTS update_quiz_questions_updated_at ON quiz_questions;
DROP TRIGGER IF EXISTS update_quiz_responses_updated_at ON quiz_responses;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON support_tickets;

-- ========================================
-- STEP 5: DROP ALL POLICIES
-- ========================================

-- Policies are automatically dropped when tables are dropped, but let's be explicit
DROP POLICY IF EXISTS "Superadmin can manage all companies" ON companies;
DROP POLICY IF EXISTS "Company owners can view their own company" ON companies;
DROP POLICY IF EXISTS "Company owners can update their own company" ON companies;
DROP POLICY IF EXISTS "Superadmin can manage all users" ON users;
DROP POLICY IF EXISTS "Users can view company members" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Company owners can manage company users" ON users;
DROP POLICY IF EXISTS "Superadmin can manage all modules" ON modules;
DROP POLICY IF EXISTS "Company members can view company modules" ON modules;
DROP POLICY IF EXISTS "Company owners and managers can create modules" ON modules;
DROP POLICY IF EXISTS "Module creators can update their modules" ON modules;
DROP POLICY IF EXISTS "Company members can view company lessons" ON lessons;
DROP POLICY IF EXISTS "Module creators can manage lessons" ON lessons;
DROP POLICY IF EXISTS "Users can view their own assignments" ON assignments;
DROP POLICY IF EXISTS "Managers can view team assignments" ON assignments;
DROP POLICY IF EXISTS "Company owners and managers can create assignments" ON assignments;
DROP POLICY IF EXISTS "Users can view their own progress" ON lesson_progress;
DROP POLICY IF EXISTS "Managers can view team progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON lesson_progress;
DROP POLICY IF EXISTS "Company members can view company quiz questions" ON quiz_questions;
DROP POLICY IF EXISTS "Users can view their own quiz responses" ON quiz_responses;
DROP POLICY IF EXISTS "Users can create their own quiz responses" ON quiz_responses;
DROP POLICY IF EXISTS "Company members can view company analytics" ON analytics_events;
DROP POLICY IF EXISTS "System can create analytics events" ON analytics_events;
DROP POLICY IF EXISTS "Users can view their own tickets" ON support_tickets;
DROP POLICY IF EXISTS "Company owners can view company tickets" ON support_tickets;
DROP POLICY IF EXISTS "Users can create support tickets" ON support_tickets;

-- ========================================
-- STEP 6: DROP ALL INDEXES
-- ========================================

-- Indexes are automatically dropped when tables are dropped, but let's be explicit
DROP INDEX IF EXISTS idx_users_company_id;
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_manager_id;
DROP INDEX IF EXISTS idx_modules_company_id;
DROP INDEX IF EXISTS idx_modules_created_by;
DROP INDEX IF EXISTS idx_modules_type;
DROP INDEX IF EXISTS idx_modules_published;
DROP INDEX IF EXISTS idx_lessons_module_id;
DROP INDEX IF EXISTS idx_lessons_order;
DROP INDEX IF EXISTS idx_assignments_user_id;
DROP INDEX IF EXISTS idx_assignments_module_id;
DROP INDEX IF EXISTS idx_assignments_status;
DROP INDEX IF EXISTS idx_assignments_due_date;
DROP INDEX IF EXISTS idx_lesson_progress_user_id;
DROP INDEX IF EXISTS idx_lesson_progress_assignment_id;
DROP INDEX IF EXISTS idx_lesson_progress_completed;
DROP INDEX IF EXISTS idx_quiz_questions_lesson_id;
DROP INDEX IF EXISTS idx_quiz_responses_user_id;
DROP INDEX IF EXISTS idx_quiz_responses_assignment_id;
DROP INDEX IF EXISTS idx_analytics_company_id;
DROP INDEX IF EXISTS idx_analytics_user_id;
DROP INDEX IF EXISTS idx_analytics_event_type;
DROP INDEX IF EXISTS idx_analytics_created_at;
DROP INDEX IF EXISTS idx_support_company_id;
DROP INDEX IF EXISTS idx_support_user_id;
DROP INDEX IF EXISTS idx_support_status;

-- ========================================
-- STEP 7: VERIFY CLEANUP
-- ========================================

-- Check what's left
SELECT '=== REMAINING TABLES ===' as info;

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

SELECT '=== REMAINING TYPES ===' as info;

SELECT typname 
FROM pg_type 
WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND typtype = 'e'
ORDER BY typname;

SELECT '=== REMAINING FUNCTIONS ===' as info;

SELECT proname 
FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;

-- Success message
SELECT '🧹 DATABASE COMPLETELY CLEANED! Ready for fresh schema.' as status; 