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
      {/* Force styling with inline styles */}
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #1e293b 0%, #7c3aed 50%, #1e293b 100%) !important;
          color: white !important;
        }
        
        .premium-card {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 24px !important;
        }
        
        .premium-card:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: scale(1.02) !important;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3) !important;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #3b82f6 100%) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        
        .icon-gradient {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
          border-radius: 16px !important;
          padding: 16px !important;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3) !important;
        }
        
        .stats-gradient-green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
        }
        
        .stats-gradient-blue {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
        }
        
        .stats-gradient-purple {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
        }
        
        .stats-gradient-orange {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
        }
        
        .floating-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: float 10s infinite linear;
        }
        
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {/* Premium Success Indicator */}
      <div 
        className="fixed top-4 right-4 z-50"
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '16px',
          fontWeight: 'bold',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          animation: 'pulse 2s infinite'
        }}
      >
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5" style={{ animation: 'spin 2s linear infinite' }} />
          <span>✨ PREMIUM DASHBOARD LIVE ✨</span>
          <Sparkles className="h-5 w-5" style={{ animation: 'spin 2s linear infinite reverse' }} />
        </div>
      </div>
      
      <div 
        className="relative min-h-screen overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #581c87 25%, #7c2d12 50%, #581c87 75%, #0f172a 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 10s ease infinite'
        }}
      >
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-10 left-10 w-72 h-72 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
              animation: 'pulse 4s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute top-32 right-20 w-96 h-96 rounded-full opacity-15"
            style={{
              background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
              animation: 'pulse 6s ease-in-out infinite reverse'
            }}
          />
          <div 
            className="absolute bottom-20 left-32 w-80 h-80 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, #10b981 0%, transparent 70%)',
              animation: 'pulse 5s ease-in-out infinite'
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="floating-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 4}s`
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
                  <div className="icon-gradient">
                    <Rocket className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 
                      className="text-6xl font-black mb-2 gradient-text"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      Welcome Back! 👋
                    </h1>
                    <p 
                      className="text-2xl font-medium"
                      style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                      Your learning empire is thriving. Here's what's happening today.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div 
                  className="flex items-center space-x-3 px-6 py-3 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: '#10b981',
                      boxShadow: '0 0 10px #10b981',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                  <span className="text-white font-semibold">Live Dashboard</span>
                </div>
                <button 
                  className="p-3 rounded-2xl text-white transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)'
                  }}
                >
                  <Bell className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Revenue Card */}
            <div 
              className="premium-card p-8 transition-all duration-500 cursor-pointer group"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="p-4 rounded-2xl stats-gradient-green"
                    style={{ boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)' }}
                  >
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2" style={{ color: '#10b981' }}>
                    <ArrowUpRight className="h-5 w-5" />
                    <span className="text-lg font-bold">+{stats.monthlyGrowth}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p 
                    className="text-sm font-medium uppercase tracking-wider"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Total Revenue
                  </p>
                  <p className="text-4xl font-black text-white">${stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm font-semibold" style={{ color: '#10b981' }}>+$127K this month</p>
                </div>
              </div>
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                style={{ background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}
              />
            </div>

            {/* Companies Card */}
            <div 
              className="premium-card p-8 transition-all duration-500 cursor-pointer group"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="p-4 rounded-2xl stats-gradient-blue"
                    style={{ boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)' }}
                  >
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2" style={{ color: '#3b82f6' }}>
                    <ArrowUpRight className="h-5 w-5" />
                    <span className="text-lg font-bold">+12%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p 
                    className="text-sm font-medium uppercase tracking-wider"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Active Companies
                  </p>
                  <p className="text-4xl font-black text-white">{stats.totalCompanies.toLocaleString()}</p>
                  <p className="text-sm font-semibold" style={{ color: '#3b82f6' }}>+156 new this month</p>
                </div>
              </div>
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)' }}
              />
            </div>

            {/* Users Card */}
            <div 
              className="premium-card p-8 transition-all duration-500 cursor-pointer group"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="p-4 rounded-2xl stats-gradient-purple"
                    style={{ boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)' }}
                  >
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2" style={{ color: '#8b5cf6' }}>
                    <ArrowUpRight className="h-5 w-5" />
                    <span className="text-lg font-bold">+18%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p 
                    className="text-sm font-medium uppercase tracking-wider"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Learning Champions
                  </p>
                  <p className="text-4xl font-black text-white">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm font-semibold" style={{ color: '#8b5cf6' }}>+2.1K active today</p>
                </div>
              </div>
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                style={{ background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)' }}
              />
            </div>

            {/* Satisfaction Card */}
            <div 
              className="premium-card p-8 transition-all duration-500 cursor-pointer group"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="p-4 rounded-2xl stats-gradient-orange"
                    style={{ boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)' }}
                  >
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2" style={{ color: '#f59e0b' }}>
                    <Star className="h-5 w-5" style={{ fill: '#f59e0b' }} />
                    <span className="text-lg font-bold">{stats.satisfaction}/5</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p 
                    className="text-sm font-medium uppercase tracking-wider"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Satisfaction Score
                  </p>
                  <p className="text-4xl font-black text-white">{stats.conversionRate}%</p>
                  <p className="text-sm font-semibold" style={{ color: '#f59e0b' }}>Conversion Rate</p>
                </div>
              </div>
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                style={{ background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)' }}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div 
            className="premium-card p-8"
            style={{ marginBottom: '2rem' }}
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="icon-gradient">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Quick Actions</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Streamline your workflow</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                className="p-6 rounded-2xl text-left transition-all duration-300 hover:scale-105 group"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div 
                  className="p-3 rounded-2xl w-fit mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Add Company</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Onboard new organizations</p>
              </button>
              
              <button 
                className="p-6 rounded-2xl text-left transition-all duration-300 hover:scale-105 group"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div 
                  className="p-3 rounded-2xl w-fit mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Analytics</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Deep dive into metrics</p>
              </button>
              
              <button 
                className="p-6 rounded-2xl text-left transition-all duration-300 hover:scale-105 group"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div 
                  className="p-3 rounded-2xl w-fit mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)'
                  }}
                >
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Global View</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Worldwide platform insights</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </DashboardLayout>
  )
} 