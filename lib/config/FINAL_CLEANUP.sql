-- 🧹 FINAL DATABASE CLEANUP
-- This script uses correct system table column names

-- ========================================
-- STEP 1: DROP ALL POLICIES FIRST
-- ========================================

-- Drop all policies from all tables
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
    END LOOP;
END $$;

-- ========================================
-- STEP 2: DROP ALL TRIGGERS
-- ========================================

-- Drop all triggers from all tables
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT 
            n.nspname as schemaname,
            c.relname as tablename,
            t.tgname as triggername
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public'
    ) 
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS "' || r.triggername || '" ON ' || r.schemaname || '.' || r.tablename;
    END LOOP;
END $$;

-- ========================================
-- STEP 3: DROP ALL TABLES WITH CASCADE
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
-- STEP 4: DROP ALL ENUM TYPES
-- ========================================

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS plan_type CASCADE;
DROP TYPE IF EXISTS module_type CASCADE;
DROP TYPE IF EXISTS interaction_type CASCADE;
DROP TYPE IF EXISTS assignment_status CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;

-- ========================================
-- STEP 5: DROP ALL FUNCTIONS
-- ========================================

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS track_analytics_event(UUID, UUID, VARCHAR, JSONB) CASCADE;
DROP FUNCTION IF EXISTS can_access_module(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS get_user_company_id(UUID) CASCADE;
DROP FUNCTION IF EXISTS generate_company_code() CASCADE;
DROP FUNCTION IF EXISTS generate_certificate_number() CASCADE;
DROP FUNCTION IF EXISTS update_leaderboard_rankings() CASCADE;

-- ========================================
-- STEP 6: DROP ALL INDEXES
-- ========================================

-- Drop all indexes (they should be dropped with tables, but let's be sure)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT indexname FROM pg_indexes WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP INDEX IF EXISTS "' || r.indexname || '" CASCADE';
    END LOOP;
END $$;

-- ========================================
-- STEP 7: VERIFY COMPLETE CLEANUP
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

SELECT '=== REMAINING POLICIES ===' as info;

SELECT policyname, tablename 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Success message
SELECT '🧹 DATABASE COMPLETELY CLEANED! Ready for fresh schema.' as status; 