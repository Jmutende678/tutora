// PROFESSIONAL DASHBOARD - Premium Design System
'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Building2, 
  CreditCard, 
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Sparkles,
  Zap,
  Target,
  Award,
  Calendar,
  Bell,
  ChevronRight,
  BarChart3,
  PieChart,
  Globe,
  Shield,
  Rocket,
  Star
} from 'lucide-react'

import DashboardLayout from '@/components/DashboardLayout'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 2847630,
    totalCompanies: 1847,
    totalUsers: 43251,
    activeSubscriptions: 2134,
    monthlyGrowth: 24.5,
    conversionRate: 3.2,
    satisfaction: 4.8
  })

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const recentActivity = [
    { id: 1, type: 'signup', company: 'TechCorp Solutions', user: 'Sarah Johnson', time: '2 min ago', avatar: 'SJ', color: 'from-blue-500 to-cyan-500' },
    { id: 2, type: 'payment', company: 'StartupXYZ', amount: '$2,999', time: '5 min ago', avatar: 'SX', color: 'from-green-500 to-emerald-500' },
    { id: 3, type: 'completion', company: 'InnovateHub', course: 'React Mastery', time: '12 min ago', avatar: 'IH', color: 'from-purple-500 to-pink-500' },
    { id: 4, type: 'upgrade', company: 'BigCorp Industries', plan: 'Enterprise', time: '18 min ago', avatar: 'BC', color: 'from-orange-500 to-red-500' }
  ]

  const topCompanies = [
    { name: 'TechCorp Solutions', progress: 94, users: 287, revenue: '$45,230', growth: '+12%', color: 'from-blue-500 to-cyan-500' },
    { name: 'StartupXYZ Inc', progress: 89, users: 156, revenue: '$32,100', growth: '+18%', color: 'from-purple-500 to-pink-500' },
    { name: 'InnovateHub', progress: 87, users: 198, revenue: '$38,750', growth: '+8%', color: 'from-green-500 to-emerald-500' },
    { name: 'BigCorp Industries', progress: 82, users: 412, revenue: '$67,890', growth: '+15%', color: 'from-orange-500 to-red-500' }
  ]

  return (
    <DashboardLayout>
      {/* Premium Success Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl shadow-green-500/30 animate-pulse border border-white/20 backdrop-blur-xl">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 animate-spin" />
            <span>✨ PREMIUM DASHBOARD LIVE ✨</span>
            <Sparkles className="h-5 w-5 animate-spin" />
          </div>
        </div>
      </div>
      
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent)] animate-pulse animation-delay-1000"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(119,255,198,0.2),transparent)] animate-pulse animation-delay-2000"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 20}s`
              }}
            />
          ))}
        </div>

        <div className={`relative z-10 p-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Hero Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl shadow-blue-500/30">
                    <Rocket className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
                      Welcome Back! 👋
                    </h1>
                    <p className="text-xl text-gray-300 font-medium">
                      Your learning empire is thriving. Here's what's happening today.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/20">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  <span className="text-white font-semibold">Live Dashboard</span>
                </div>
                <button className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
                  <Bell className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-2xl shadow-green-500/30">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2 text-green-400">
                    <ArrowUpRight className="h-5 w-5" />
                    <span className="text-lg font-bold">+{stats.monthlyGrowth}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Revenue</p>
                  <p className="text-4xl font-black text-white">${stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-green-400 text-sm font-semibold">+$127K this month</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl shadow-2xl shadow-blue-500/30">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2 text-blue-400">
                    <ArrowUpRight className="h-5 w-5" />
                    <span className="text-lg font-bold">+12%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Active Companies</p>
                  <p className="text-4xl font-black text-white">{stats.totalCompanies.toLocaleString()}</p>
                  <p className="text-blue-400 text-sm font-semibold">+156 new this month</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-2xl shadow-purple-500/30">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2 text-purple-400">
                    <ArrowUpRight className="h-5 w-5" />
                    <span className="text-lg font-bold">+18%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Learning Champions</p>
                  <p className="text-4xl font-black text-white">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-purple-400 text-sm font-semibold">+2.1K active today</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-2xl shadow-orange-500/30">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2 text-orange-400">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-lg font-bold">{stats.satisfaction}/5</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Satisfaction Score</p>
                  <p className="text-4xl font-black text-white">{stats.conversionRate}%</p>
                  <p className="text-orange-400 text-sm font-semibold">Conversion Rate</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Live Activity Feed */}
            <div className="lg:col-span-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-2xl shadow-green-500/30">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Live Activity</h3>
                    <p className="text-gray-400">Real-time platform events</p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${activity.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {activity.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-semibold">{activity.company}</p>
                        {activity.type === 'payment' && <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold">PAYMENT</span>}
                        {activity.type === 'signup' && <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-semibold">NEW USER</span>}
                        {activity.type === 'completion' && <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-semibold">COMPLETED</span>}
                        {activity.type === 'upgrade' && <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-semibold">UPGRADE</span>}
                      </div>
                      <p className="text-gray-400 text-sm">
                        {activity.user && `${activity.user} joined • `}
                        {activity.amount && `${activity.amount} received • `}
                        {activity.course && `${activity.course} completed • `}
                        {activity.plan && `Upgraded to ${activity.plan} • `}
                        {activity.time}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl shadow-2xl shadow-yellow-500/30">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Top Performers</h3>
                  <p className="text-gray-400 text-sm">This month's champions</p>
                </div>
              </div>
              <div className="space-y-4">
                {topCompanies.map((company, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{company.name}</p>
                          <p className="text-gray-400 text-xs">{company.users} users</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-sm">{company.revenue}</p>
                        <p className="text-green-400 text-xs font-semibold">{company.growth}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${company.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${company.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-bold text-sm">{company.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl shadow-blue-500/30">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Quick Actions</h3>
                <p className="text-gray-400">Streamline your workflow</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="group p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl text-left hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 hover:scale-105 border border-blue-500/30">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl w-fit mb-4 shadow-2xl shadow-blue-500/30">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Add Company</h4>
                <p className="text-gray-400 text-sm">Onboard new organizations</p>
              </button>
              <button className="group p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl text-left hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 hover:scale-105 border border-green-500/30">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl w-fit mb-4 shadow-2xl shadow-green-500/30">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Analytics</h4>
                <p className="text-gray-400 text-sm">Deep dive into metrics</p>
              </button>
              <button className="group p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl text-left hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-105 border border-purple-500/30">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl w-fit mb-4 shadow-2xl shadow-purple-500/30">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Global View</h4>
                <p className="text-gray-400 text-sm">Worldwide platform insights</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </DashboardLayout>
  )
} 