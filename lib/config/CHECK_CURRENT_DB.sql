-- Check current database state
SELECT '=== CURRENT TABLES ===' as info;

SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

SELECT '=== CURRENT ENUMS ===' as info;

SELECT t.typname as enum_name, e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'user_role'
ORDER BY e.enumsortorder;

SELECT '=== USERS TABLE DATA ===' as info;

SELECT id, email, role, company_id, created_at 
FROM users 
LIMIT 5;

SELECT '=== COMPANIES TABLE DATA ===' as info;

SELECT id, name, plan_type, created_at 
FROM companies 
LIMIT 5;

SELECT '=== TOTAL RECORDS ===' as info;

SELECT 
  'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 
  'companies' as table_name, COUNT(*) as record_count FROM companies
UNION ALL
SELECT 
  'modules' as table_name, COUNT(*) as record_count FROM modules
UNION ALL
SELECT 
  'assignments' as table_name, COUNT(*) as record_count FROM assignments; 