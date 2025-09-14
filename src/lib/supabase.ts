import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  full_name: string;
  company_id: string;
  created_at: string;
  last_login: string;
  status: 'active' | 'inactive';
}

export interface Company {
  id: string;
  name: string;
  plan: 'starter' | 'professional' | 'enterprise';
  created_at: string;
  user_count: number;
  module_count: number;
}

export interface Activity {
  id: string;
  user_id: string;
  activity_type: 'login' | 'signup' | 'course_complete' | 'module_start' | 'quiz_submit';
  details: string;
  created_at: string;
  user_name: string;
  company_id: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  company_id: string;
  created_at: string;
  completion_rate: number;
  total_enrollments: number;
}

// API Functions
export async function getRealtimeStats() {
  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get active users (logged in within last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_login', twentyFourHoursAgo);

    // Get today's logins
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count: todayLogins } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('activity_type', 'login')
      .gte('created_at', todayStart.toISOString());

    // Get new signups today
    const { count: newSignups } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString());

    return {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      todayLogins: todayLogins || 0,
      newSignups: newSignups || 0
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return demo data if Supabase isn't configured
    return {
      totalUsers: 1247,
      activeUsers: 89,
      todayLogins: 234,
      newSignups: 12
    };
  }
}

export async function getRecentActivities(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        users!inner(full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data?.map(activity => ({
      id: activity.id,
      type: activity.activity_type,
      user: activity.users.full_name,
      details: activity.details,
      timestamp: new Date(activity.created_at)
    })) || [];
  } catch (error) {
    console.error('Error fetching activities:', error);
    // Return demo data if Supabase isn't configured
    return generateDemoActivities(limit);
  }
}

export async function trackActivity(userId: string, activityType: string, details: string) {
  try {
    const { error } = await supabase
      .from('activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        details: details,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error tracking activity:', error);
    return false;
  }
}

// Demo data generator for when Supabase isn't configured
function generateDemoActivities(limit: number) {
  const types = ['login', 'signup', 'course_complete', 'module_start', 'quiz_submit'];
  const users = ['John D.', 'Sarah M.', 'Mike R.', 'Lisa K.', 'Tom W.', 'Emma S.'];
  
  return Array.from({ length: limit }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      id: `demo_${i}`,
      type,
      user: users[Math.floor(Math.random() * users.length)],
      details: getDemoActivityDetails(type),
      timestamp: new Date(Date.now() - Math.random() * 3600000) // Random time within last hour
    };
  });
}

function getDemoActivityDetails(type: string): string {
  switch (type) {
    case 'login': return 'Logged into dashboard';
    case 'signup': return 'Created new account';
    case 'course_complete': return 'Completed "Advanced Sales Training"';
    case 'module_start': return 'Started "Customer Service Module"';
    case 'quiz_submit': return 'Submitted quiz with 95% score';
    default: return 'Activity recorded';
  }
}
