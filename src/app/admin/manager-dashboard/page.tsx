'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Brain,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Clock,
  Target,
  Zap,
  Activity,
  UserCheck,
  GraduationCap
} from 'lucide-react'

interface Employee {
  id: string
  name: string
  email: string
  department: string
  completedModules: number
  totalModules: number
  lastActive: string
  progress: number
  status: 'active' | 'inactive' | 'pending'
}

interface AIModule {
  id: string
  title: string
  description: string
  category: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  enrollments: number
  rating: number
  status: 'published' | 'draft' | 'archived'
}

export default function ManagerDashboard() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [modules, setModules] = useState<AIModule[]>([])

  useEffect(() => {
    // Check authentication and role
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    const role = localStorage.getItem('admin_role')
    if (!isAuthenticated || role !== 'manager') {
      router.push('/admin/login')
      return
    }

    // Load demo data
    setEmployees([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        department: 'Marketing',
        completedModules: 8,
        totalModules: 12,
        lastActive: '2 hours ago',
        progress: 67,
        status: 'active'
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        department: 'Engineering',
        completedModules: 15,
        totalModules: 18,
        lastActive: '1 day ago',
        progress: 83,
        status: 'active'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@company.com',
        department: 'Sales',
        completedModules: 4,
        totalModules: 10,
        lastActive: '3 days ago',
        progress: 40,
        status: 'inactive'
      },
      {
        id: '4',
        name: 'David Kim',
        email: 'david.kim@company.com',
        department: 'HR',
        completedModules: 0,
        totalModules: 8,
        lastActive: 'Never',
        progress: 0,
        status: 'pending'
      }
    ])

    setModules([
      {
        id: '1',
        title: 'Customer Service Excellence',
        description: 'Master the art of exceptional customer service',
        category: 'Customer Relations',
        duration: '3 hours',
        difficulty: 'Beginner',
        enrollments: 156,
        rating: 4.8,
        status: 'published'
      },
      {
        id: '2',
        title: 'Advanced Sales Techniques',
        description: 'Cutting-edge strategies for closing deals',
        category: 'Sales',
        duration: '5 hours',
        difficulty: 'Advanced',
        enrollments: 89,
        rating: 4.9,
        status: 'published'
      },
      {
        id: '3',
        title: 'Digital Marketing Fundamentals',
        description: 'Essential skills for modern marketing',
        category: 'Marketing',
        duration: '4 hours',
        difficulty: 'Intermediate',
        enrollments: 203,
        rating: 4.7,
        status: 'published'
      }
    ])
  }, [router])

  const stats = [
    {
      title: 'Team Members',
      value: '24',
      change: '+3',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Learners',
      value: '18',
      change: '+2',
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Course Completion',
      value: '78%',
      change: '+5%',
      icon: GraduationCap,
      color: 'bg-purple-500'
    },
    {
      title: 'Team Performance',
      value: '92%',
      change: '+3%',
      icon: Target,
      color: 'bg-orange-500'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Manager Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Welcome back! Here's your team's learning progress overview.
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Team Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Team Performance</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-900">{employee.name}</h3>
                        <p className="text-xs text-slate-500">{employee.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">{employee.progress}%</p>
                        <p className="text-xs text-slate-500">{employee.completedModules}/{employee.totalModules} modules</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Analytics */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Learning Analytics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Active Sessions</p>
                      <p className="text-2xl font-bold text-slate-900">18</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">+4</p>
                    <p className="text-xs text-slate-500">vs yesterday</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Avg. Session Time</p>
                      <p className="text-2xl font-bold text-slate-900">45m</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">+8m</p>
                    <p className="text-xs text-slate-500">vs last week</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Certifications</p>
                      <p className="text-2xl font-bold text-slate-900">12</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">+3</p>
                    <p className="text-xs text-slate-500">this month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Management */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Course Management</h2>
                  <p className="text-sm text-slate-600">Manage and monitor learning modules</p>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Course</span>
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <div key={module.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">{module.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{module.description}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(module.difficulty)}`}>
                          {module.difficulty}
                        </span>
                        <span className="text-xs text-slate-500">{module.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                    <span>{module.enrollments} enrolled</span>
                    <div className="flex items-center space-x-1">
                      <span>⭐</span>
                      <span>{module.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button className="flex-1 border border-slate-300 text-slate-700 px-3 py-2 rounded-md text-sm hover:bg-slate-50 transition-colors flex items-center justify-center space-x-1">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-8 w-8" />
              <h3 className="text-lg font-semibold">Team Management</h3>
            </div>
            <p className="text-blue-100 mb-4">Manage team members and roles</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
              Manage Team
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="h-8 w-8" />
              <h3 className="text-lg font-semibold">Progress Reports</h3>
            </div>
            <p className="text-purple-100 mb-4">View detailed learning analytics</p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
              View Reports
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="h-8 w-8" />
              <h3 className="text-lg font-semibold">Quick Setup</h3>
            </div>
            <p className="text-green-100 mb-4">Configure learning paths</p>
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 