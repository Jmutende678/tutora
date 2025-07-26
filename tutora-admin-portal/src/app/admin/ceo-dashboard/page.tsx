'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  DollarSign,
  TrendingUp,
  Building2,
  Users,
  BarChart3,
  Activity,
  Globe,
  Clock,
  Award,
  Zap,
  Brain,
  Target
} from 'lucide-react'
import Chart from '@/components/Chart'

interface BusinessMetrics {
  revenue: number
  growth: number
  companies: number
  users: number
  retention: number
  satisfaction: number
}

interface RevenueData {
  name: string
  revenue: number
  users: number
  companies: number
}

export default function CEODashboard() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    revenue: 0,
    growth: 0,
    companies: 0,
    users: 0,
    retention: 0,
    satisfaction: 0
  })

  const [revenueData, setRevenueData] = useState<RevenueData[]>([])

  useEffect(() => {
    // Check authentication and role
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    const role = localStorage.getItem('admin_role')
    if (!isAuthenticated || role !== 'ceo') {
      router.push('/admin/login')
      return
    }

    // Load demo data
    setMetrics({
      revenue: 1250000,
      growth: 28,
      companies: 156,
      users: 3420,
      retention: 92,
      satisfaction: 4.8
    })

    setRevenueData([
      { name: 'Jan', revenue: 980000, users: 2800, companies: 120 },
      { name: 'Feb', revenue: 1050000, users: 3000, companies: 135 },
      { name: 'Mar', revenue: 1150000, users: 3200, companies: 142 },
      { name: 'Apr', revenue: 1250000, users: 3420, companies: 156 }
    ])
  }, [router])

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${(metrics.revenue / 1000).toFixed(1)}K`,
      change: `+${metrics.growth}%`,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Companies',
      value: metrics.companies.toString(),
      change: '+12%',
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Users',
      value: metrics.users.toLocaleString(),
      change: '+15%',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'User Retention',
      value: `${metrics.retention}%`,
      change: '+5%',
      icon: Target,
      color: 'bg-orange-500'
    }
  ]

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">CEO Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Welcome back! Here's your business performance overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <span className="ml-2 text-sm font-medium text-green-600">{stat.change}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-slate-900 rounded-xl shadow-xl border border-slate-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Revenue & Growth</h2>
              <p className="text-slate-400">Monthly performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">
                Monthly
              </button>
              <button className="text-slate-400 px-4 py-2 rounded-lg hover:bg-slate-800">
                Quarterly
              </button>
              <button className="text-slate-400 px-4 py-2 rounded-lg hover:bg-slate-800">
                Yearly
              </button>
            </div>
          </div>
          <Chart data={revenueData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Business Health */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Business Health</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Customer Satisfaction</p>
                      <p className="text-2xl font-bold text-slate-900">{metrics.satisfaction}/5.0</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">+0.3</p>
                    <p className="text-xs text-slate-500">vs last month</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Global Reach</p>
                      <p className="text-2xl font-bold text-slate-900">28</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">+3</p>
                    <p className="text-xs text-slate-500">new countries</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Avg. Contract Duration</p>
                      <p className="text-2xl font-bold text-slate-900">18 months</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">+2 months</p>
                    <p className="text-xs text-slate-500">vs last year</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Opportunities */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Growth Opportunities</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-medium text-blue-900">AI Integration</h3>
                    </div>
                    <span className="text-blue-600 font-medium">+45% growth potential</span>
                  </div>
                  <p className="text-sm text-blue-700">Expand AI-powered learning features to attract enterprise clients</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-medium text-purple-900">Market Expansion</h3>
                    </div>
                    <span className="text-purple-600 font-medium">5 target markets</span>
                  </div>
                  <p className="text-sm text-purple-700">Enter new geographic markets with localized content</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-medium text-green-900">Enterprise Solutions</h3>
                    </div>
                    <span className="text-green-600 font-medium">+60% revenue potential</span>
                  </div>
                  <p className="text-sm text-green-700">Develop custom enterprise learning solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="h-8 w-8" />
              <h3 className="text-lg font-semibold">Financial Reports</h3>
            </div>
            <p className="text-blue-100 mb-4">View detailed financial analytics</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
              View Reports
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Building2 className="h-8 w-8" />
              <h3 className="text-lg font-semibold">Company Overview</h3>
            </div>
            <p className="text-purple-100 mb-4">Monitor company performance</p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
              View Details
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="h-8 w-8" />
              <h3 className="text-lg font-semibold">Strategic Planning</h3>
            </div>
            <p className="text-green-100 mb-4">Update business strategies</p>
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
              Start Planning
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 