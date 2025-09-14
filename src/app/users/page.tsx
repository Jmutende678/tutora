'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  TrendingUp,
  Clock,
  Download,
  Upload,
  UserCheck,
  UserX,
  Star,
  Building2,
  Activity
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  phone: string
  department: string
  role: string
  company: string
  companyId: string
  joinDate: string
  lastActive: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  coursesCompleted: number
  coursesEnrolled: number
  averageScore: number
  totalLearningTime: number
  certificatesEarned: number
  avatar: string
  location: string
  manager: string
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCompany, setFilterCompany] = useState<string>('all')

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }

    // Load demo users data
    setUsers([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1 (555) 123-4567',
        department: 'Marketing',
        role: 'Marketing Manager',
        company: 'TechCorp Solutions',
        companyId: 'TUT-2024-TCH001',
        joinDate: '2024-01-15',
        lastActive: '2 hours ago',
        status: 'active',
        coursesCompleted: 12,
        coursesEnrolled: 15,
        averageScore: 89,
        totalLearningTime: 145,
        certificatesEarned: 5,
        avatar: 'SJ',
        location: 'San Francisco, CA',
        manager: 'David Wilson'
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@techcorp.com',
        phone: '+1 (555) 234-5678',
        department: 'Engineering',
        role: 'Senior Developer',
        company: 'TechCorp Solutions',
        companyId: 'TUT-2024-TCH001',
        joinDate: '2023-08-22',
        lastActive: '1 day ago',
        status: 'active',
        coursesCompleted: 18,
        coursesEnrolled: 20,
        averageScore: 94,
        totalLearningTime: 289,
        certificatesEarned: 8,
        avatar: 'MC',
        location: 'Austin, TX',
        manager: 'Lisa Park'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@innovlabs.com',
        phone: '+1 (555) 345-6789',
        department: 'Sales',
        role: 'Sales Representative',
        company: 'Innovation Labs Inc',
        companyId: 'TUT-2024-INL002',
        joinDate: '2024-03-10',
        lastActive: '3 days ago',
        status: 'inactive',
        coursesCompleted: 6,
        coursesEnrolled: 12,
        averageScore: 76,
        totalLearningTime: 82,
        certificatesEarned: 2,
        avatar: 'ER',
        location: 'New York, NY',
        manager: 'Robert Smith'
      },
      {
        id: '4',
        name: 'David Kim',
        email: 'david.kim@greenenergy.com',
        phone: '+1 (555) 456-7890',
        department: 'HR',
        role: 'HR Specialist',
        company: 'Green Energy Co',
        companyId: 'TUT-2024-GEC003',
        joinDate: '2024-06-01',
        lastActive: 'Never',
        status: 'pending',
        coursesCompleted: 0,
        coursesEnrolled: 5,
        averageScore: 0,
        totalLearningTime: 0,
        certificatesEarned: 0,
        avatar: 'DK',
        location: 'Seattle, WA',
        manager: 'Jennifer Lee'
      },
      {
        id: '5',
        name: 'Lisa Thompson',
        email: 'lisa.thompson@digipro.com',
        phone: '+1 (555) 567-8901',
        department: 'Marketing',
        role: 'Content Creator',
        company: 'Digital Marketing Pro',
        companyId: 'TUT-2024-DMP004',
        joinDate: '2023-12-05',
        lastActive: '5 hours ago',
        status: 'active',
        coursesCompleted: 14,
        coursesEnrolled: 16,
        averageScore: 92,
        totalLearningTime: 198,
        certificatesEarned: 6,
        avatar: 'LT',
        location: 'Los Angeles, CA',
        manager: 'Mark Johnson'
      },
      {
        id: '6',
        name: 'Alex Martinez',
        email: 'alex.martinez@healthplus.com',
        phone: '+1 (555) 678-9012',
        department: 'IT',
        role: 'System Administrator',
        company: 'Healthcare Plus',
        companyId: 'TUT-2024-HCP005',
        joinDate: '2023-09-15',
        lastActive: '2 weeks ago',
        status: 'suspended',
        coursesCompleted: 8,
        coursesEnrolled: 10,
        averageScore: 68,
        totalLearningTime: 124,
        certificatesEarned: 3,
        avatar: 'AM',
        location: 'Miami, FL',
        manager: 'Sandra Davis'
      }
    ])
  }, [router])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    const matchesCompany = filterCompany === 'all' || user.company === filterCompany
    return matchesSearch && matchesDepartment && matchesStatus && matchesCompany
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const uniqueDepartments = Array.from(new Set(users.map(user => user.department)))
  const uniqueCompanies = Array.from(new Set(users.map(user => user.company)))

  const totalStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    avgCompletionRate: Math.round(users.reduce((sum, u) => sum + (u.coursesCompleted / Math.max(u.coursesEnrolled, 1) * 100), 0) / users.length),
    totalCertificates: users.reduce((sum, u) => sum + u.certificatesEarned, 0)
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Users</h1>
              <p className="text-slate-600 mt-2">Manage all learners across your platform</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Import</span>
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{totalStats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Active Users</p>
                <p className="text-2xl font-bold text-slate-900">{totalStats.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Avg. Completion</p>
                <p className="text-2xl font-bold text-slate-900">{totalStats.avgCompletionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Certificates Earned</p>
                <p className="text-2xl font-bold text-slate-900">{totalStats.totalCertificates}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  className="block px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Companies</option>
                  {uniqueCompanies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>

                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="block px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Departments</option>
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Company / Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{user.avatar}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                          <div className="text-xs text-slate-400 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{user.company}</div>
                      <div className="text-sm text-slate-500">{user.department}</div>
                      <div className="text-xs text-slate-400">{user.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(user.coursesCompleted / Math.max(user.coursesEnrolled, 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {user.coursesCompleted}/{user.coursesEnrolled}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {user.totalLearningTime}h learning time
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-slate-900">{user.averageScore}%</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center">
                        <Award className="h-3 w-3 mr-1" />
                        {user.certificatesEarned} certificates
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 p-1">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-slate-400 hover:text-slate-600 p-1">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-slate-400 hover:text-slate-600 p-1">
                          <Mail className="h-4 w-4" />
                        </button>
                        <button className="text-slate-400 hover:text-slate-600 p-1">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
            <span className="font-medium">{users.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
              Previous
            </button>
            <button className="px-3 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 