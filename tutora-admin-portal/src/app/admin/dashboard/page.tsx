'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  DollarSign,
  BarChart3,
  Zap,
  Shield,
  MessageSquare,
  Upload,
  Target,
  Award
} from 'lucide-react'
import SupportTicketWidget from '@/components/SupportTicketWidget'
import { PlanEnforcement, PLAN_LIMITS, type PlanType, type UsageStats } from '@/lib/plan-enforcement'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalModules: number
  completedModules: number
  pendingTickets: number
  monthlyRevenue: number
  aiModulesCreated: number
  completionRate: number
  userGrowth: number
  moduleEngagement: number
}

interface Company {
  id: string
  name: string
  plan: PlanType
  status: 'active' | 'suspended' | 'cancelled'
  currentUsers: number
  createdAt: string
  lastActivity: string
  monthlyRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalModules: 0,
    completedModules: 0,
    pendingTickets: 0,
    monthlyRevenue: 0,
    aiModulesCreated: 0,
    completionRate: 0,
    userGrowth: 0,
    moduleEngagement: 0
  })

  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')

  // Sample usage stats for demonstration
  const sampleUsage: UsageStats = {
    currentUsers: 42,
    currentAIModules: 8,
    currentStorage: 3.2,
    lastResetDate: new Date().toISOString()
  }

  const planEnforcement = new PlanEnforcement('growth', sampleUsage)

  useEffect(() => {
    loadDashboardData()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [selectedTimeframe])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Simulate API calls - in production these would be real Firebase/Stripe calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock real-time data
      setStats({
        totalUsers: 1247,
        activeUsers: 892,
        totalModules: 156,
        completedModules: 1023,
        pendingTickets: 7,
        monthlyRevenue: 28450,
        aiModulesCreated: 23,
        completionRate: 87,
        userGrowth: 12.5,
        moduleEngagement: 94.2
      })

      setCompanies([
        {
          id: '1',
          name: 'TechFlow Solutions',
          plan: 'growth',
          status: 'active',
          currentUsers: 85,
          createdAt: '2024-01-15',
          lastActivity: new Date().toISOString(),
          monthlyRevenue: 2465
        },
        {
          id: '2', 
          name: 'InnovateCorpF',
          plan: 'enterprise',
          status: 'active',
          currentUsers: 320,
          createdAt: '2024-01-20',
          lastActivity: new Date(Date.now() - 3600000).toISOString(),
          monthlyRevenue: 25280
        },
        {
          id: '3',
          name: 'GrowthTech',
          plan: 'basic',
          status: 'active',
          currentUsers: 23,
          createdAt: '2024-01-25',
          lastActivity: new Date(Date.now() - 7200000).toISOString(),
          monthlyRevenue: 276
        }
      ])
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'suspended': return 'text-yellow-600 bg-yellow-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPlanColor = (plan: PlanType) => {
    switch (plan) {
      case 'basic': return 'text-blue-600 bg-blue-50'
      case 'growth': return 'text-purple-600 bg-purple-50'
      case 'enterprise': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Real-time overview of your Tutora platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+{formatPercentage(stats.userGrowth)} this week</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">{formatPercentage((stats.activeUsers / stats.totalUsers) * 100)} of total</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
                <p className="text-sm text-green-600 mt-1">+8.2% from last month</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">AI Modules Created</p>
                <p className="text-2xl font-bold text-gray-900">{stats.aiModulesCreated}</p>
                <p className="text-sm text-blue-600 mt-1">This month</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="text-sm font-medium">{formatPercentage(stats.completionRate)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{stats.completedModules} modules completed</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Score</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Module Engagement</span>
              <span className="text-sm font-medium">{formatPercentage(stats.moduleEngagement)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${stats.moduleEngagement}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Above industry average</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Health</h3>
            <div className="flex items-center space-x-3 mb-3">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{stats.pendingTickets} Pending</p>
                <p className="text-xs text-gray-500">Average response: 2.1 hours</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">98% Resolved</p>
                <p className="text-xs text-gray-500">Within SLA targets</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Enforcement Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Usage Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Users</span>
                <span className="text-sm font-medium">{sampleUsage.currentUsers} / {PLAN_LIMITS.growth.maxUsers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(sampleUsage.currentUsers / PLAN_LIMITS.growth.maxUsers) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">AI Modules (Monthly)</span>
                <span className="text-sm font-medium">{sampleUsage.currentAIModules} / {PLAN_LIMITS.growth.maxAIModules}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${(sampleUsage.currentAIModules / PLAN_LIMITS.growth.maxAIModules) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="text-sm font-medium">{sampleUsage.currentStorage}GB / {PLAN_LIMITS.growth.maxStorage}GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(sampleUsage.currentStorage / PLAN_LIMITS.growth.maxStorage) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Companies Overview & Support Tickets Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Active Companies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Active Companies</h3>
              <p className="text-sm text-gray-600">{companies.length} total companies</p>
            </div>
            <div className="divide-y divide-gray-200">
              {companies.map((company) => (
                <div key={company.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{company.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-md ${getPlanColor(company.plan)}`}>
                          {company.plan.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(company.status)}`}>
                          {company.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{company.currentUsers} users</span>
                        <span>{formatCurrency(company.monthlyRevenue)}/month</span>
                        <span>Created {new Date(company.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Last active {new Date(company.lastActivity).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Tickets */}
          <SupportTicketWidget 
            isAdmin={true}
            userEmail="admin@tutoralearn.com"
            userName="Admin User"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <Upload className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Bulk User Import</span>
            </button>

            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group">
              <BarChart3 className="h-5 w-5 text-gray-600 group-hover:text-green-600" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Export Analytics</span>
            </button>

            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group">
              <MessageSquare className="h-5 w-5 text-gray-600 group-hover:text-purple-600" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Broadcast Message</span>
            </button>

            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all group">
              <Shield className="h-5 w-5 text-gray-600 group-hover:text-orange-600" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">Security Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 