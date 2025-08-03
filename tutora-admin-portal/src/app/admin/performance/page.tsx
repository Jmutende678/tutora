'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Award,
  Users,
  BookOpen,
  Clock,
  Star,
  Trophy,
  Medal,
  Crown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'

interface PerformanceMetrics {
  totalUsers: number
  activeUsers: number
  completionRate: number
  averageScore: number
  totalModules: number
  completedModules: number
  averageTimeSpent: number
  engagementRate: number
  satisfactionScore: number
  retentionRate: number
}

interface UserPerformance {
  id: string
  name: string
  email: string
  department: string
  role: string
  completedModules: number
  totalModules: number
  averageScore: number
  timeSpent: number
  lastActive: string
  streak: number
  points: number
  achievements: string[]
  trend: 'up' | 'down' | 'stable'
  performance: 'excellent' | 'good' | 'average' | 'needs_improvement'
}

interface DepartmentPerformance {
  name: string
  users: number
  completionRate: number
  averageScore: number
  engagement: number
  trend: 'up' | 'down' | 'stable'
}

export default function PerformancePage() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [userPerformance, setUserPerformance] = useState<UserPerformance[]>([])
  const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentPerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    const role = localStorage.getItem('admin_role')
    if (!isAuthenticated || role !== 'manager') {
      router.push('/admin/login')
      return
    }

    loadPerformanceData()
  }, [])

  const loadPerformanceData = async () => {
    try {
      setIsLoading(true)
      
      // Demo metrics
      const demoMetrics: PerformanceMetrics = {
        totalUsers: 156,
        activeUsers: 142,
        completionRate: 87,
        averageScore: 84,
        totalModules: 45,
        completedModules: 1234,
        averageTimeSpent: 23,
        engagementRate: 92,
        satisfactionScore: 4.6,
        retentionRate: 94
      }

      const demoUserPerformance: UserPerformance[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          department: 'Marketing',
          role: 'Manager',
          completedModules: 15,
          totalModules: 18,
          averageScore: 92,
          timeSpent: 28,
          lastActive: '2 hours ago',
          streak: 12,
          points: 1250,
          achievements: ['Top Performer', 'Module Master', 'Team Leader'],
          trend: 'up',
          performance: 'excellent'
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'michael.chen@company.com',
          department: 'Engineering',
          role: 'Developer',
          completedModules: 18,
          totalModules: 20,
          averageScore: 88,
          timeSpent: 25,
          lastActive: '1 day ago',
          streak: 8,
          points: 2100,
          achievements: ['Code Master', 'Fast Learner'],
          trend: 'stable',
          performance: 'good'
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@company.com',
          department: 'Sales',
          role: 'Representative',
          completedModules: 8,
          totalModules: 12,
          averageScore: 85,
          timeSpent: 18,
          lastActive: '3 hours ago',
          streak: 5,
          points: 850,
          achievements: ['Sales Champion'],
          trend: 'up',
          performance: 'good'
        }
      ]

      const demoDepartmentPerformance: DepartmentPerformance[] = [
        {
          name: 'Marketing',
          users: 45,
          completionRate: 92,
          averageScore: 87,
          engagement: 89,
          trend: 'up'
        },
        {
          name: 'Engineering',
          users: 38,
          completionRate: 95,
          averageScore: 91,
          engagement: 93,
          trend: 'stable'
        },
        {
          name: 'Sales',
          users: 28,
          completionRate: 88,
          averageScore: 84,
          engagement: 86,
          trend: 'up'
        },
        {
          name: 'HR',
          users: 15,
          completionRate: 85,
          averageScore: 82,
          engagement: 84,
          trend: 'down'
        }
      ]

      setMetrics(demoMetrics)
      setUserPerformance(demoUserPerformance)
      setDepartmentPerformance(demoDepartmentPerformance)
    } catch (error) {
      console.error('Error loading performance data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-50'
      case 'good': return 'text-blue-600 bg-blue-50'
      case 'average': return 'text-yellow-600 bg-yellow-50'
      case 'needs_improvement': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case 'down': return <ArrowDownRight className="h-4 w-4 text-red-500" />
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />
      default: return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      case 'stable': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
            <p className="text-gray-600 mt-2">Track team performance, engagement, and learning outcomes</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.activeUsers}</p>
                  <p className="text-sm text-gray-500">of {metrics.totalUsers} total</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.completionRate}%</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +5.2% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.averageScore}%</p>
                  <p className="text-sm text-blue-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +2.1% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.engagementRate}%</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +3.8% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Department Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Department Performance</h2>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Marketing">Marketing</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departmentPerformance.map((dept, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                  {getTrendIcon(dept.trend)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Users</span>
                    <span className="font-medium">{dept.users}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium">{dept.completionRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg Score</span>
                    <span className="font-medium">{dept.averageScore}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Engagement</span>
                    <span className="font-medium">{dept.engagement}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Performance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Individual Performance</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4 inline mr-1" />
                Filter
              </button>
              <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4 inline mr-1" />
                Export
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Progress</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Time Spent</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Streak</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Points</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userPerformance.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{user.department}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(user.completedModules / user.totalModules) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {user.completedModules}/{user.totalModules}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{user.averageScore}%</span>
                        {getTrendIcon(user.trend)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{user.timeSpent}h</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">{user.streak} days</span>
                        <Trophy className="w-4 h-4 text-yellow-500 ml-1" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{user.points}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(user.performance)}`}>
                        {user.performance.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 