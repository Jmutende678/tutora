import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  ChevronRight,
  Star,
  BarChart3,
  PieChart,
  Trophy,
  Zap,
  Shield,
  Globe
} from 'lucide-react'
import StatsCard from '@/components/StatsCard'

export default function DashboardPage() {
  const stats = {
    totalUsers: 12847,
    totalCompanies: 284,
    totalRevenue: 94250,
    monthlyGrowth: 12.5,
    activeSubscriptions: 2156
  }

  const recentActivity = [
    { 
      icon: Trophy, 
      text: "New company 'TechCorp' registered", 
      time: "2 hours ago", 
      color: "yellow" 
    },
    { 
      icon: Star, 
      text: "User completed 'Advanced React' course", 
      time: "4 hours ago", 
      color: "blue" 
    },
    { 
      icon: Zap, 
      text: "Payment of $2,500 received", 
      time: "6 hours ago", 
      color: "green" 
    },
    { 
      icon: Shield, 
      text: "Security audit completed", 
      time: "1 day ago", 
      color: "purple" 
    },
    { 
      icon: Globe, 
      text: "New region expansion approved", 
      time: "2 days ago", 
      color: "orange" 
    }
  ]

  const chartData = [
    { name: 'Jan', revenue: 4000, users: 240 },
    { name: 'Feb', revenue: 3000, users: 180 },
    { name: 'Mar', revenue: 2000, users: 120 },
    { name: 'Apr', revenue: 2780, users: 167 },
    { name: 'May', revenue: 1890, users: 113 },
    { name: 'Jun', revenue: 2390, users: 143 },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to Tutora Admin
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your learning platform with powerful insights
          </p>
        </div>
        <div 
          className="px-6 py-3 rounded-2xl font-semibold text-white shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}
        >
          ✅ PREMIUM DASHBOARD LIVE
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="h-8 w-8" />}
          gradientFrom="from-blue-500"
          gradientTo="to-blue-600"
        />
        <StatsCard
          title="Active Companies"
          value={stats.totalCompanies.toLocaleString()}
          icon={<Building2 className="h-8 w-8" />}
          gradientFrom="from-purple-500"
          gradientTo="to-purple-600"
        />
        <StatsCard
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-8 w-8" />}
          gradientFrom="from-green-500"
          gradientTo="to-green-600"
        />
        <StatsCard
          title="Growth Rate"
          value={`+${stats.monthlyGrowth}%`}
          icon={<TrendingUp className="h-8 w-8" />}
          gradientFrom="from-orange-500"
          gradientTo="to-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div 
          className="p-6 rounded-3xl border"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Revenue Overview</h3>
            <div className="flex items-center space-x-2">
              <div 
                className="p-2 rounded-xl"
                style={{
                  background: 'rgba(16, 185, 129, 0.2)'
                }}
              >
                <BarChart3 className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <p className="text-white font-semibold">Revenue Chart</p>
              <p className="text-gray-400 text-sm">Interactive chart coming soon</p>
            </div>
          </div>
        </div>

        {/* User Engagement */}
        <div 
          className="p-6 rounded-3xl border"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">User Engagement</h3>
            <div className="flex items-center space-x-2">
              <div 
                className="p-2 rounded-xl"
                style={{
                  background: 'rgba(139, 92, 246, 0.2)'
                }}
              >
                <PieChart className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Active Users</span>
              <span className="text-white font-semibold">{stats.totalUsers.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Course Completions</span>
              <span className="text-white font-semibold">{stats.activeSubscriptions.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Certificates Issued</span>
              <span className="text-white font-semibold">{stats.totalCompanies.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div 
        className="p-6 rounded-3xl border"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
          <button 
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-2"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => {
            const IconComponent = activity.icon
            return (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                <div 
                  className="p-2 rounded-xl"
                  style={{
                    background: `rgba(${
                      activity.color === 'yellow' ? '251, 191, 36' :
                      activity.color === 'blue' ? '59, 130, 246' :
                      activity.color === 'green' ? '16, 185, 129' :
                      activity.color === 'purple' ? '139, 92, 246' :
                      '249, 115, 22'
                    }, 0.2)`
                  }}
                >
                  <IconComponent className={`h-5 w-5 ${
                    activity.color === 'yellow' ? 'text-yellow-400' :
                    activity.color === 'blue' ? 'text-blue-400' :
                    activity.color === 'green' ? 'text-green-400' :
                    activity.color === 'purple' ? 'text-purple-400' :
                    'text-orange-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.text}</p>
                  <p className="text-gray-400 text-sm">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 