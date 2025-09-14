'use client';

import { useState, useEffect } from 'react';

interface ActivityData {
  id: string;
  type: string;
  user: string;
  timestamp: Date;
  details: string;
}

export default function LiveActivityDashboard() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeNow: 89,
    todayLogins: 234,
    newSignups: 12
  });

  // Simulate real-time activity updates
  useEffect(() => {
    const generateActivity = (): ActivityData => {
      const types = ['login', 'signup', 'course_complete', 'module_start', 'quiz_submit'];
      const users = ['John D.', 'Sarah M.', 'Mike R.', 'Lisa K.', 'Tom W.', 'Emma S.'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        type,
        user: users[Math.floor(Math.random() * users.length)],
        timestamp: new Date(),
        details: getActivityDetails(type)
      };
    };

    const getActivityDetails = (type: string): string => {
      switch (type) {
        case 'login': return 'Logged into dashboard';
        case 'signup': return 'Created new account';
        case 'course_complete': return 'Completed "Advanced Sales Training"';
        case 'module_start': return 'Started "Customer Service Module"';
        case 'quiz_submit': return 'Submitted quiz with 95% score';
        default: return 'Activity recorded';
      }
    };

    // Add initial activities
    const initialActivities = Array.from({ length: 8 }, generateActivity);
    setActivities(initialActivities);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      
      // Update stats occasionally
      if (Math.random() > 0.7) {
        setStats(prev => ({
          ...prev,
          activeNow: prev.activeNow + (Math.random() > 0.5 ? 1 : -1),
          todayLogins: prev.todayLogins + 1
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 Tutora Live Activity Dashboard
          </h1>
          <p className="text-gray-600">Real-time user activity and engagement metrics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🟢</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeNow}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Today&apos;s Logins</p>
                <p className="text-2xl font-bold text-purple-600">{stats.todayLogins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">New Signups</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.newSignups}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                🔴 Live Activity Feed
              </h2>
              <div className="flex items-center text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live Updates
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{activity.user}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                          {activity.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500">
          <p>🎯 Tutora CEO Dashboard - Real-time Business Intelligence</p>
        </div>
      </div>
    </div>
  );
}