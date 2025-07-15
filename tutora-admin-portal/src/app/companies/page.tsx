'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Building2,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Mail,
  Calendar,
  Activity,
  Award,
  DollarSign
} from 'lucide-react'

interface Company {
  id: string
  name: string
  code: string
  industry: string
  employees: number
  activeUsers: number
  plan: 'Starter' | 'Professional' | 'Enterprise'
  status: 'active' | 'trial' | 'suspended' | 'expired'
  registrationDate: string
  lastActive: string
  monthlyRevenue: number
  completionRate: number
  contactEmail: string
  contactPerson: string
}

export default function CompaniesPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }

    // Load demo companies data
    setCompanies([
      {
        id: '1',
        name: 'TechCorp Solutions',
        code: 'TUT-2024-TCH001',
        industry: 'Technology',
        employees: 247,
        activeUsers: 189,
        plan: 'Enterprise',
        status: 'active',
        registrationDate: '2024-01-15',
        lastActive: '2 hours ago',
        monthlyRevenue: 1995,
        completionRate: 78,
        contactEmail: 'admin@techcorp.com',
        contactPerson: 'Sarah Johnson'
      },
      {
        id: '2',
        name: 'Innovation Labs Inc',
        code: 'TUT-2024-INL002',
        industry: 'Research & Development',
        employees: 156,
        activeUsers: 134,
        plan: 'Professional',
        status: 'active',
        registrationDate: '2024-02-03',
        lastActive: '1 day ago',
        monthlyRevenue: 789,
        completionRate: 85,
        contactEmail: 'learning@innovlabs.com',
        contactPerson: 'Michael Chen'
      },
      {
        id: '3',
        name: 'Green Energy Co',
        code: 'TUT-2024-GEC003',
        industry: 'Energy',
        employees: 89,
        activeUsers: 67,
        plan: 'Professional',
        status: 'trial',
        registrationDate: '2024-06-20',
        lastActive: '3 hours ago',
        monthlyRevenue: 0,
        completionRate: 45,
        contactEmail: 'hr@greenenergy.com',
        contactPerson: 'Emily Rodriguez'
      },
      {
        id: '4',
        name: 'Digital Marketing Pro',
        code: 'TUT-2024-DMP004',
        industry: 'Marketing',
        employees: 34,
        activeUsers: 28,
        plan: 'Starter',
        status: 'active',
        registrationDate: '2024-03-10',
        lastActive: '5 hours ago',
        monthlyRevenue: 299,
        completionRate: 92,
        contactEmail: 'admin@digipro.com',
        contactPerson: 'David Kim'
      },
      {
        id: '5',
        name: 'Healthcare Plus',
        code: 'TUT-2024-HCP005',
        industry: 'Healthcare',
        employees: 445,
        activeUsers: 267,
        plan: 'Enterprise',
        status: 'suspended',
        registrationDate: '2023-11-22',
        lastActive: '2 weeks ago',
        monthlyRevenue: 0,
        completionRate: 23,
        contactEmail: 'it@healthplus.com',
        contactPerson: 'Dr. Lisa Wang'
      }
    ])
  }, [router])

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = filterPlan === 'all' || company.plan === filterPlan
    const matchesStatus = filterStatus === 'all' || company.status === filterStatus
    return matchesSearch && matchesPlan && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'trial': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200'
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Enterprise': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Professional': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Starter': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const totalStats = {
    totalCompanies: companies.length,
    activeCompanies: companies.filter(c => c.status === 'active').length,
    totalRevenue: companies.reduce((sum, c) => sum + c.monthlyRevenue, 0),
    avgCompletionRate: Math.round(companies.reduce((sum, c) => sum + c.completionRate, 0) / companies.length)
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Companies</h1>
              <p className="text-slate-600 mt-2">Manage and monitor all registered companies</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Company</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Companies</p>
                <p className="text-2xl font-bold text-slate-900">{totalStats.totalCompanies}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Active Companies</p>
                <p className="text-2xl font-bold text-slate-900">{totalStats.activeCompanies}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-slate-900">${totalStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Avg. Completion</p>
                <p className="text-2xl font-bold text-slate-900">{totalStats.avgCompletionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="block px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Plans</option>
                  <option value="Starter">Starter</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="suspended">Suspended</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Employees / Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Completion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Revenue
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
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{company.name}</div>
                          <div className="text-sm text-slate-500">{company.code}</div>
                          <div className="text-xs text-slate-400">{company.industry}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span>{company.activeUsers} / {company.employees}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border ${getPlanColor(company.plan)}`}>
                        {company.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(company.status)}`}>
                        {company.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${company.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{company.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      ${company.monthlyRevenue.toLocaleString()}/mo
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {company.lastActive}
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCompanies.length}</span> of{' '}
            <span className="font-medium">{companies.length}</span> results
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