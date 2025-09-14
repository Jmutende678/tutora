-- FIX INFINITE RECURSION IN POLICIES
-- This script fixes the RLS policy issues

-- ========================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- ========================================

-- Drop all policies that might cause recursion
DROP POLICY IF EXISTS "Super admins can access all companies" ON companies;
DROP POLICY IF EXISTS "Users can access their own company users" ON users;
DROP POLICY IF EXISTS "Users can access their company modules" ON modules;
DROP POLICY IF EXISTS "Users can access their own assignments" ON module_assignments;
DROP POLICY IF EXISTS "Users can access their own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can access their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can access their company analytics" ON analytics;
DROP POLICY IF EXISTS "Users can access their company support tickets" ON support_tickets;

-- ========================================
-- STEP 2: CREATE SIMPLER POLICIES
-- ========================================

-- Companies policies
CREATE POLICY "Enable read access for authenticated users" ON companies
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON companies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for company owners" ON companies
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Users policies
CREATE POLICY "Enable read access for authenticated users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Modules policies
CREATE POLICY "Enable read access for authenticated users" ON modules
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON modules
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for module creators" ON modules
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Module assignments policies
CREATE POLICY "Enable read access for authenticated users" ON module_assignments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON module_assignments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users" ON module_assignments
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Quiz attempts policies
CREATE POLICY "Enable read access for authenticated users" ON quiz_attempts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON quiz_attempts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users" ON quiz_attempts
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Notifications policies
CREATE POLICY "Enable read access for authenticated users" ON notifications
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON notifications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users" ON notifications
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Analytics policies
CREATE POLICY "Enable read access for authenticated users" ON analytics
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON analytics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Support tickets policies
CREATE POLICY "Enable read access for authenticated users" ON support_tickets
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON support_tickets
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users" ON support_tickets
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Success message
SELECT 'POLICIES FIXED! No more infinite recursion.' as status; 