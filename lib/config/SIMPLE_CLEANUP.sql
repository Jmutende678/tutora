-- 🧹 SIMPLE CLEANUP
-- Just drop everything with CASCADE

-- Drop all tables with CASCADE (this will handle everything)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Grant permissions back
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Success message
SELECT '🧹 DATABASE COMPLETELY CLEANED! Ready for fresh schema.' as status; 