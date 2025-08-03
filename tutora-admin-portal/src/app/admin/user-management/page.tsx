'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Users,
  UserPlus,
  Group,
  Users2,
  Plus,
  Search,
  Eye,
  Edit,
  UserX,
  Mail,
  Building2,
  Calendar,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'owner' | 'manager' | 'employee' | 'admin'
  department: string
  group: string
  status: 'active' | 'inactive' | 'pending'
  position: string
  progress: number
  points: number
  performance: {
    score: number
    trend: 'up' | 'down' | 'stable'
  }
}

interface Group {
  id: string
  name: string
  description: string
  leader: string
  members: number
  maxMembers: number
  department: string
  status: 'active' | 'inactive'
  performance: {
    averageScore: number
    completionRate: number
    engagement: number
  }
}

export default function UserManagementPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedRole, setSelectedRole] = useState('all')
  const [activeTab, setActiveTab] = useState<'users' | 'groups'>('users')

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    const role = localStorage.getItem('admin_role')
    if (!isAuthenticated || role !== 'manager') {
      router.push('/admin/login')
      return
    }

    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      const demoUsers: User[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          role: 'manager',
          department: 'Marketing',
          group: 'Digital Marketing',
          status: 'active',
          position: 'Marketing Manager',
          progress: 80,
          points: 1250,
          performance: { score: 92, trend: 'up' }
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'michael.chen@company.com',
          role: 'employee',
          department: 'Engineering',
          group: 'Frontend Team',
          status: 'active',
          position: 'Senior Developer',
          progress: 90,
          points: 2100,
          performance: { score: 88, trend: 'stable' }
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@company.com',
          role: 'employee',
          department: 'Sales',
          group: 'Enterprise Sales',
          status: 'active',
          position: 'Sales Rep',
          progress: 67,
          points: 850,
          performance: { score: 85, trend: 'up' }
        }
      ]

      const demoGroups: Group[] = [
        {
          id: '1',
          name: 'Digital Marketing',
          description: 'Digital marketing strategies and campaigns',
          leader: 'Sarah Johnson',
          members: 12,
          maxMembers: 15,
          department: 'Marketing',
          status: 'active',
          performance: { averageScore: 87, completionRate: 92, engagement: 89 }
        },
        {
          id: '2',
          name: 'Frontend Team',
          description: 'Frontend development and UI/UX',
          leader: 'Michael Chen',
          members: 8,
          maxMembers: 10,
          department: 'Engineering',
          status: 'active',
          performance: { averageScore: 91, completionRate: 95, engagement: 93 }
        },
        {
          id: '3',
          name: 'Enterprise Sales',
          description: 'Enterprise client sales and relationships',
          leader: 'David Kim',
          members: 6,
          maxMembers: 8,
          department: 'Sales',
          status: 'active',
          performance: { averageScore: 84, completionRate: 88, engagement: 86 }
        }
      ]

      setUsers(demoUsers)
      setGroups(demoGroups)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment
    const matchesRole = selectedRole === 'all' || user.role === selectedRole

    return matchesSearch && matchesDepartment && matchesRole
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800'
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'admin': return 'bg-red-100 text-red-800'
      case 'employee': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
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
            <h1 className="text-3xl font-bold text-gray-900">Team & Group Management</h1>
            <p className="text-gray-600 mt-2">Manage users, groups, and teams across your organization</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <UserPlus className="w-5 h-5" />
              Add User
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Group className="w-5 h-5" />
              Create Group
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'groups'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Group className="w-4 h-4 inline mr-2" />
              Groups ({groups.length})
            </button>
          </nav>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Departments</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                </select>
                
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="owner">Owner</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>

            {/* Users Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(user => (
                <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.position}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      {user.department} • {user.group}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">{user.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                        style={{ width: `${user.progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Performance</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium text-blue-600">{user.performance.score}</span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Points</span>
                      <span className="text-sm font-medium text-gray-900">{user.points}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex justify-between space-x-2">
                      <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                        <Eye className="w-4 h-4 inline mr-1" />
                        View
                      </button>
                      <button className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                        <Edit className="w-4 h-4 inline mr-1" />
                        Edit
                      </button>
                      <button className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                        <UserX className="w-4 h-4 inline mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map(group => (
                <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{group.name}</h3>
                      <p className="text-sm text-gray-600">{group.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      group.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {group.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {group.members}/{group.maxMembers} members
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      {group.department}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-blue-600">{group.performance.averageScore}%</div>
                        <div className="text-xs text-gray-600">Avg Score</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-green-600">{group.performance.completionRate}%</div>
                        <div className="text-xs text-gray-600">Completion</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-purple-600">{group.performance.engagement}%</div>
                        <div className="text-xs text-gray-600">Engagement</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex justify-between space-x-2">
                      <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                        <Eye className="w-4 h-4 inline mr-1" />
                        View
                      </button>
                      <button className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                        <Edit className="w-4 h-4 inline mr-1" />
                        Edit
                      </button>
                      <button className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                        <UserPlus className="w-4 h-4 inline mr-1" />
                        Add Member
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 