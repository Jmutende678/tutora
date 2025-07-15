'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  Clock,
  Target,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  GraduationCap,
  UserCheck,
  Zap,
  Eye
} from 'lucide-react'

interface MetricCard {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: any
  description: string
}

interface ChartData {
  month: string
  completions: number
  enrollments: number
  revenue: number
  activeUsers: number
}

interface DepartmentData {
  name: string
  completion: number
  avgScore: number
  totalHours: number
  certificates: number
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('6m')
  const [selectedMetric, setSelectedMetric] = useState('completions')

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }
  }, [router])

  const metrics: MetricCard[] = [
    {
      title: 'Total Revenue',
      value: '$127,650',
      change: '+23.5%',
      changeType: 'positive',
      icon: TrendingUp,
      description: 'vs last quarter'
    },
    {
      title: 'Active Learners',
      value: '3,247',
      change: '+12.3%',
      changeType: 'positive',
      icon: Users,
      description: 'this month'
    },
    {
      title: 'Course Completions',
      value: '8,951',
      change: '+8.7%',
      changeType: 'positive',
      icon: BookOpen,
      description: 'this month'
    },
    {
      title: 'Avg. Score',
      value: '87.2%',
      change: '-2.1%',
      changeType: 'negative',
      icon: Target,
      description: 'vs last month'
    },
    {
      title: 'Engagement Rate',
      value: '78.4%',
      change: '+5.2%',
      changeType: 'positive',
      icon: Activity,
      description: 'daily active users'
    },
    {
      title: 'Certificates Issued',
      value: '1,234',
      change: '+15.6%',
      changeType: 'positive',
      icon: Award,
      description: 'this quarter'
    }
  ]

  const chartData: ChartData[] = [
    { month: 'Jan', completions: 2400, enrollments: 2800, revenue: 18500, activeUsers: 1200 },
    { month: 'Feb', completions: 1398, enrollments: 1800, revenue: 15600, activeUsers: 1100 },
    { month: 'Mar', completions: 9800, enrollments: 11000, revenue: 45200, activeUsers: 2300 },
    { month: 'Apr', completions: 3908, enrollments: 4500, revenue: 28900, activeUsers: 1900 },
    { month: 'May', completions: 4800, enrollments: 5200, revenue: 34700, activeUsers: 2100 },
    { month: 'Jun', completions: 3800, enrollments: 4200, revenue: 31200, activeUsers: 2000 }
  ]

  const departmentData: DepartmentData[] = [
    { name: 'Engineering', completion: 94, avgScore: 89, totalHours: 2450, certificates: 156 },
    { name: 'Marketing', completion: 87, avgScore: 85, totalHours: 1890, certificates: 123 },
    { name: 'Sales', completion: 82, avgScore: 82, totalHours: 1650, certificates: 98 },
    { name: 'HR', completion: 91, avgScore: 88, totalHours: 1320, certificates: 87 },
    { name: 'Finance', completion: 78, avgScore: 81, totalHours: 980, certificates: 65 },
    { name: 'Operations', completion: 85, avgScore: 84, totalHours: 1240, certificates: 78 }
  ]

  const topPerformers = [
    { name: 'Michael Chen', company: 'TechCorp Solutions', score: 98, courses: 24, hours: 145 },
    { name: 'Sarah Johnson', company: 'Innovation Labs', score: 96, courses: 22, hours: 138 },
    { name: 'Emily Rodriguez', company: 'Green Energy Co', score: 94, courses: 20, hours: 132 },
    { name: 'David Kim', company: 'Digital Marketing Pro', score: 93, courses: 19, hours: 128 },
    { name: 'Lisa Thompson', company: 'Healthcare Plus', score: 92, courses: 18, hours: 125 }
  ]

  const getChangeIcon = (changeType: string) => {
    if (changeType === 'positive') return <ArrowUpRight className="h-4 w-4 text-green-600" />
    if (changeType === 'negative') return <ArrowDownRight className="h-4 w-4 text-red-600" />
    return null
  }

  const getChangeColor = (changeType: string) => {
    if (changeType === 'positive') return 'text-green-600'
    if (changeType === 'negative') return 'text-red-600'
    return 'text-slate-600'
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
              <p className="text-slate-600 mt-2">Track performance and insights across your learning platform</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="block px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="3m">Last 3 months</option>
                <option value="6m">Last 6 months</option>
                <option value="1y">Last year</option>
              </select>
              <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <metric.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className={`flex items-center space-x-1 ${getChangeColor(metric.changeType)}`}>
                  {getChangeIcon(metric.changeType)}
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-600">{metric.title}</h3>
                <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
                <p className="text-xs text-slate-500">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Learning Trends</h2>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="block px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="completions">Course Completions</option>
                  <option value="enrollments">New Enrollments</option>
                  <option value="revenue">Revenue</option>
                  <option value="activeUsers">Active Users</option>
                </select>
              </div>
            </div>
            <div className="p-6">
              {/* Simple Chart Visualization */}
              <div className="space-y-4">
                {chartData.map((item, index) => {
                  const value = selectedMetric === 'completions' ? item.completions :
                               selectedMetric === 'enrollments' ? item.enrollments :
                               selectedMetric === 'revenue' ? item.revenue :
                               item.activeUsers;
                  const maxValue = Math.max(...chartData.map(d => 
                    selectedMetric === 'completions' ? d.completions :
                    selectedMetric === 'enrollments' ? d.enrollments :
                    selectedMetric === 'revenue' ? d.revenue :
                    d.activeUsers
                  ));
                  const width = (value / maxValue) * 100;
                  
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-8 text-sm text-slate-600 font-medium">{item.month}</div>
                      <div className="flex-1 bg-slate-100 rounded-full h-4 relative">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${width}%` }}
                        >
                          <span className="text-white text-xs font-medium">
                            {selectedMetric === 'revenue' ? `$${(value / 1000).toFixed(1)}k` : value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Department Performance</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {departmentData.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-900">{dept.name}</h3>
                        <p className="text-xs text-slate-500">{dept.totalHours}h total learning</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">{dept.completion}%</div>
                      <div className="text-xs text-slate-500">completion rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Top Performers</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {performer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        {index < 3 && (
                          <div className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-yellow-900 text-xs font-bold">{index + 1}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-900">{performer.name}</h3>
                        <p className="text-xs text-slate-500">{performer.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">{performer.score}%</div>
                      <div className="text-xs text-slate-500">{performer.courses} courses</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Insights */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Learning Insights</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">Peak Learning Hours</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Most activity occurs between 10 AM - 2 PM, with Tuesday being the most active day.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">Popular Content</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      "Customer Service Excellence" and "Digital Marketing" are the most completed courses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">Completion Patterns</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Courses under 30 minutes have 89% completion rate vs 64% for longer courses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Activity className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">Engagement Drop-off</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      15% of users drop off after the first module. Consider improving onboarding.
                    </p>
                  </div>
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
              <h3 className="text-lg font-semibold">Custom Reports</h3>
            </div>
            <p className="text-blue-100 mb-4">Generate detailed analytics reports for stakeholders</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
              Create Report
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <UserCheck className="h-8 w-8" />
              <h3 className="text-lg font-semibold">User Insights</h3>
            </div>
            <p className="text-green-100 mb-4">Deep dive into individual learner performance</p>
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
              View Details
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="h-8 w-8" />
              <h3 className="text-lg font-semibold">Automated Insights</h3>
            </div>
            <p className="text-purple-100 mb-4">AI-powered recommendations for optimization</p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
              Get Insights
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 