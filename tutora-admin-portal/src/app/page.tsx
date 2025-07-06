// Cache buster - Force update: 2025-07-06-19:47
'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Building2, 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  Zap,
  Target,
  Award,
  Rocket,
  Star,
  Clock,
  Calendar,
  Filter
} from 'lucide-react'

import DashboardLayout from '@/components/DashboardLayout'
import StatsCard from '@/components/StatsCard'
import Chart from '@/components/Chart'

export default function Dashboard() {

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCompanies: 0,
    totalUsers: 0,
    activeSubscriptions: 0,
    monthlyGrowth: 0,
    revenueGrowth: 0,
  })

  const [recentActivity, setRecentActivity] = useState<Array<{
    id: number
    type: string
    company: string
    amount: number
    time: string
    plan: string
  }>>([])

  const [topPerformers, setTopPerformers] = useState<Array<{
    id: number
    company: string
    progress: number
    users: number
    plan: string
  }>>([])

  // Auth logic removed for cache busting

  useEffect(() => {
    // Simulate fetching dashboard data with animation
    const fetchDashboardData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)) // Loading effect
      
      const mockStats = {
        totalRevenue: 125630,
        totalCompanies: 1847,
        totalUsers: 23451,
        activeSubscriptions: 1634,
        monthlyGrowth: 12.5,
        revenueGrowth: 8.2,
      }
      
      setStats(mockStats)
      
      // Mock recent activity with more details
      setRecentActivity([
        { id: 1, type: 'payment', company: 'TechCorp Solutions', amount: 299, time: '2 minutes ago', plan: 'Professional' },
        { id: 2, type: 'signup', company: 'StartupXYZ Inc', amount: 99, time: '5 minutes ago', plan: 'Starter' },
        { id: 3, type: 'upgrade', company: 'BigCorp Industries', amount: 999, time: '10 minutes ago', plan: 'Enterprise' },
        { id: 4, type: 'payment', company: 'SmallBiz Co', amount: 299, time: '15 minutes ago', plan: 'Professional' },
        { id: 5, type: 'trial', company: 'InnovateHub', amount: 0, time: '18 minutes ago', plan: 'Trial' },
      ])

      // Mock top performing companies
      setTopPerformers([
        { id: 1, company: 'TechCorp Solutions', progress: 94, users: 187, plan: 'Enterprise' },
        { id: 2, company: 'StartupXYZ Inc', progress: 87, users: 45, plan: 'Professional' },
        { id: 3, company: 'BigCorp Industries', progress: 82, users: 312, plan: 'Enterprise' },
        { id: 4, company: 'SmallBiz Co', progress: 76, users: 23, plan: 'Starter' },
      ])
    }

    fetchDashboardData()
  }, [])

  const chartData = [
    { name: 'Jan', revenue: 4000, users: 240, companies: 12 },
    { name: 'Feb', revenue: 5200, users: 380, companies: 18 },
    { name: 'Mar', revenue: 6800, users: 520, companies: 25 },
    { name: 'Apr', revenue: 8900, users: 680, companies: 34 },
    { name: 'May', revenue: 11200, users: 840, companies: 42 },
    { name: 'Jun', revenue: 13500, users: 1020, companies: 51 },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment': return '💰'
      case 'signup': return '🎉'
      case 'upgrade': return '⬆️'
      case 'trial': return '🚀'
      default: return '📊'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'payment': return 'from-green-400 to-emerald-500'
      case 'signup': return 'from-blue-400 to-blue-500'
      case 'upgrade': return 'from-purple-400 to-purple-500'
      case 'trial': return 'from-orange-400 to-yellow-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'Enterprise': return 'bg-gradient-to-r from-orange-400 to-red-500'
      case 'Professional': return 'bg-gradient-to-r from-purple-400 to-pink-500'
      case 'Starter': return 'bg-gradient-to-r from-blue-400 to-blue-500'
      case 'Trial': return 'bg-gradient-to-r from-gray-400 to-gray-500'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500'
    }
  }

  // Loading and auth checks removed for cache busting

  return (
    <DashboardLayout>
      {/* TEST: Visible indicator that new deployment is working */}
      <div className="fixed top-4 right-4 z-50 bg-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg animate-pulse">
        🚀 MAIN PAGE UPDATED - JULY 6th 7:50PM 🚀
      </div>
      
      <div className="min-h-screen relative overflow-hidden p-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-40 h-60 w-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 space-y-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="animate-slide-up">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
                Welcome back! 👋
              </h1>
              <p className="text-xl text-white/70 max-w-2xl">
                Here's what's happening with your Tutora platform. Your teams are making incredible progress!
              </p>
            </div>
            <div className="flex items-center space-x-6 animate-fade-in animation-delay-300">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="h-4 w-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <div className="absolute inset-0 h-4 w-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-lg font-medium text-white/90">Live Dashboard</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filter
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-tutora-blue to-tutora-purple rounded-2xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="animate-slide-up animation-delay-100">
              <StatsCard
                title="Total Revenue"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                icon={<DollarSign className="h-6 w-6" />}
                trend={stats.revenueGrowth}
                trendIcon={<ArrowUpRight className="h-4 w-4" />}
                trendColor="text-green-400"
                gradientFrom="from-green-400"
                gradientTo="to-emerald-600"
                description="This month"
              />
            </div>
            <div className="animate-slide-up animation-delay-200">
              <StatsCard
                title="Active Companies"
                value={stats.totalCompanies.toLocaleString()}
                icon={<Building2 className="h-6 w-6" />}
                trend={stats.monthlyGrowth}
                trendIcon={<ArrowUpRight className="h-4 w-4" />}
                trendColor="text-blue-400"
                gradientFrom="from-tutora-blue"
                gradientTo="to-tutora-purple"
                description="Growing fast"
              />
            </div>
            <div className="animate-slide-up animation-delay-300">
              <StatsCard
                title="Total Users"
                value={stats.totalUsers.toLocaleString()}
                icon={<Users className="h-6 w-6" />}
                trend={15.3}
                trendIcon={<ArrowUpRight className="h-4 w-4" />}
                trendColor="text-purple-400"
                gradientFrom="from-tutora-purple"
                gradientTo="to-tutora-pink"
                description="Learning together"
              />
            </div>
            <div className="animate-slide-up animation-delay-400">
              <StatsCard
                title="Active Subscriptions"
                value={stats.activeSubscriptions.toLocaleString()}
                icon={<CreditCard className="h-6 w-6" />}
                trend={-2.1}
                trendIcon={<ArrowDownRight className="h-4 w-4" />}
                trendColor="text-orange-400"
                gradientFrom="from-tutora-orange"
                gradientTo="to-red-500"
                description="Slight dip"
              />
            </div>
          </div>

          {/* Charts and Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 animate-slide-up animation-delay-500">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-102 shadow-glass">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                      <div className="p-3 bg-gradient-to-r from-tutora-blue to-tutora-purple rounded-2xl shadow-lg mr-4">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      Revenue Overview
                    </h3>
                    <p className="text-white/70">Monthly performance metrics and growth trends</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                      ↗️ +8.2%
                    </div>
                  </div>
                </div>
                <Chart data={chartData} />
              </div>
            </div>

            {/* Top Performers */}
            <div className="animate-slide-up animation-delay-600">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 shadow-glass h-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                      <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-lg mr-3">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      Top Performers 🏆
                    </h3>
                    <p className="text-white/70 text-sm">Companies with highest engagement</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <div 
                      key={performer.id} 
                      className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-200 group border border-white/10"
                      style={{ animationDelay: `${600 + index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors duration-200">
                            {performer.company}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 ${getPlanBadgeColor(performer.plan)} text-white text-xs rounded-lg font-medium`}>
                              {performer.plan}
                            </span>
                            <span className="text-white/60 text-xs">{performer.users} users</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000"
                              style={{ width: `${performer.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-bold text-sm">{performer.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="animate-slide-up animation-delay-700">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 shadow-glass">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                    <div className="p-3 bg-gradient-to-r from-tutora-green to-tutora-light-green rounded-2xl shadow-lg mr-4">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    Live Activity Feed
                  </h3>
                  <p className="text-white/70">Real-time transactions and user activity</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200 text-sm">
                    View All
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="flex items-center justify-between p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl hover:from-white/10 hover:to-white/15 transition-all duration-300 group border border-white/10 hover:scale-105"
                    style={{ animationDelay: `${700 + index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-r ${getActivityColor(activity.type)} flex items-center justify-center shadow-lg text-lg group-hover:scale-110 transition-transform duration-300`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm group-hover:text-blue-300 transition-colors duration-200">
                          {activity.company}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 ${getPlanBadgeColor(activity.plan)} text-white text-xs rounded-lg font-medium`}>
                            {activity.plan}
                          </span>
                          <span className="text-white/60 text-xs flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    {activity.amount > 0 && (
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">${activity.amount}</p>
                        <p className="text-green-400 text-xs font-semibold">Revenue</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center px-6 py-3 bg-gradient-to-r from-tutora-blue to-tutora-purple text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                    <Rocket className="h-5 w-5 mr-2" />
                    Add New Company
                  </button>
                  <button className="flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <Users className="h-5 w-5 mr-2" />
                    Manage Users
                  </button>
                  <button className="flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <BookOpen className="h-5 w-5 mr-2" />
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 