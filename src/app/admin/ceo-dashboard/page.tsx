'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRealtimeStats, getRecentActivities } from '@/lib/supabase';

interface ActivityData {
  id: string;
  type: string;
  user: string;
  timestamp: Date;
  details: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  todayLogins: number;
  newSignups: number;
}

export default function CEODashboard() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    todayLogins: 0,
    newSignups: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('tutora_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Set up real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, activitiesData] = await Promise.all([
        getRealtimeStats(),
        getRecentActivities(15)
      ]);

      setStats(statsData);
      setActivities(activitiesData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tutora_admin_token');
    router.push('/admin/login');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return '🔐';
      case 'signup': return '✨';
      case 'course_complete': return '🎓';
      case 'module_start': return '📚';
      case 'quiz_submit': return '✅';
      default: return '📊';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login': return 'bg-blue-100 text-blue-800';
      case 'signup': return 'bg-green-100 text-green-800';
      case 'course_complete': return 'bg-purple-100 text-purple-800';
      case 'module_start': return 'bg-yellow-100 text-yellow-800';
      case 'quiz_submit': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Tutora
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-semibold text-gray-900">CEO Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {formatTime(lastUpdate)}
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 Live Business Intelligence
          </h2>
          <p className="text-gray-600">Real-time insights into your Tutora platform performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">↗ Growing</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Now</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">🟢</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">Live users online</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today&apos;s Logins</p>
                <p className="text-3xl font-bold text-purple-600">{stats.todayLogins}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">📈</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-purple-600 text-sm font-medium">Daily engagement</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Signups</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.newSignups}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-yellow-600 text-sm font-medium">Today&apos;s growth</span>
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  🔴 Live Activity Stream
                </h3>
                <div className="flex items-center text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Real-time Updates
                </div>
              </div>
              <button
                onClick={loadDashboardData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <span className="text-4xl mb-4 block">📊</span>
                <p>No recent activity to display</p>
                <p className="text-sm mt-2">Activity will appear here as users interact with the platform</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {activities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                      index === 0 ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {activity.user}
                            </p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                              {activity.type.replace('_', ' ')}
                            </span>
                            {index === 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{activity.details}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm text-gray-500">
                          {formatTime(activity.timestamp)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {activity.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">🎯 Quick Actions</h4>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">View All Users</div>
                <div className="text-sm text-gray-600">Manage user accounts and permissions</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Training Modules</div>
                <div className="text-sm text-gray-600">Create and manage training content</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Analytics Report</div>
                <div className="text-sm text-gray-600">Generate detailed performance reports</div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">💰 Revenue Insights</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Monthly Revenue</span>
                  <span className="font-semibold text-green-600">$24,750</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Growth Rate</span>
                  <span className="font-semibold text-blue-600">+12.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">🎓 Training Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Modules Created</span>
                <span className="font-semibold text-gray-900">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="font-semibold text-green-600">87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Score</span>
                <span className="font-semibold text-blue-600">92%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            🎯 Tutora CEO Dashboard - Real-time Business Intelligence
          </p>
          <p className="text-xs mt-1">
            Data updates every 30 seconds • Connected to Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
