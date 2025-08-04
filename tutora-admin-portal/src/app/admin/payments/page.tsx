'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  CreditCard,
  DollarSign,
  Users,
  Calendar,
  Eye,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Building2,
  Plus,
  Minus,
  RefreshCw,
  UserPlus,
  UserMinus,
  TrendingUp,
  Shield
} from 'lucide-react'

interface CompanyPlan {
  id: string
  name: string
  plan_type: 'free' | 'starter' | 'professional' | 'enterprise'
  max_users: number
  current_users: number
  price_per_user: number
  monthly_fee: number
  next_billing_date: string
  status: 'active' | 'past_due' | 'cancelled'
}

interface UpcomingPayment {
  id: string
  amount: number
  due_date: string
  description: string
  status: 'upcoming' | 'overdue'
  type: 'monthly' | 'overage' | 'upgrade'
}

interface UserOverage {
  user_id: string
  user_name: string
  user_email: string
  added_date: string
  monthly_cost: number
}

export default function ManagerPaymentsPage() {
  const router = useRouter()
  const [companyPlan, setCompanyPlan] = useState<CompanyPlan | null>(null)
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([])
  const [userOverages, setUserOverages] = useState<UserOverage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showRemoveUserModal, setShowRemoveUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserOverage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state for adding user
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    position: '',
    department: ''
  })

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    const role = localStorage.getItem('admin_role')
    if (!isAuthenticated || role !== 'manager') {
      router.push('/admin/login')
      return
    }

    loadCompanyData()
  }, [])

  const loadCompanyData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Demo data - in production this would come from Supabase
      const demoCompanyPlan: CompanyPlan = {
        id: 'company-1',
        name: 'Acme Corporation',
        plan_type: 'professional',
        max_users: 25,
        current_users: 28,
        price_per_user: 15,
        monthly_fee: 299,
        next_billing_date: '2024-01-15',
        status: 'active'
      }

      const demoUpcomingPayments: UpcomingPayment[] = [
        {
          id: 'payment-1',
          amount: 299,
          due_date: '2024-01-15',
          description: 'Monthly Professional Plan',
          status: 'upcoming',
          type: 'monthly'
        },
        {
          id: 'payment-2',
          amount: 45,
          due_date: '2024-01-15',
          description: '3 Additional Users (15 × 3)',
          status: 'upcoming',
          type: 'overage'
        }
      ]

      const demoUserOverages: UserOverage[] = [
        {
          user_id: 'user-26',
          user_name: 'John Smith',
          user_email: 'john.smith@acme.com',
          added_date: '2024-01-02',
          monthly_cost: 15
        },
        {
          user_id: 'user-27',
          user_name: 'Sarah Johnson',
          user_email: 'sarah.johnson@acme.com',
          added_date: '2024-01-05',
          monthly_cost: 15
        },
        {
          user_id: 'user-28',
          user_name: 'Mike Davis',
          user_email: 'mike.davis@acme.com',
          added_date: '2024-01-08',
          monthly_cost: 15
        }
      ]

      setCompanyPlan(demoCompanyPlan)
      setUpcomingPayments(demoUpcomingPayments)
      setUserOverages(demoUserOverages)

    } catch (err) {
      console.error('Error loading company data:', err)
      setError('Failed to load company data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddUser = async () => {
    try {
      setError(null)
      setSuccess(null)

      if (!newUser.name || !newUser.email) {
        setError('Please fill in all required fields')
        return
      }

      if (!companyPlan) {
        setError('Company plan not loaded')
        return
      }

      // Check if adding user would exceed plan limit
      const newUserCount = companyPlan.current_users + 1
      const overageUsers = Math.max(0, newUserCount - companyPlan.max_users)

      // In production, this would:
      // 1. Add user to Supabase
      // 2. Update company user count
      // 3. Create overage charge if needed
      // 4. Update Stripe subscription

      setSuccess(`User ${newUser.name} added successfully!`)
      setShowAddUserModal(false)
      setNewUser({ name: '', email: '', position: '', department: '' })
      
      // Reload data to reflect changes
      await loadCompanyData()

    } catch (err) {
      console.error('Error adding user:', err)
      setError('Failed to add user')
    }
  }

  const handleRemoveUser = async (user: UserOverage) => {
    try {
      setError(null)
      setSuccess(null)

      if (!confirm(`Are you sure you want to remove ${user.user_name}?`)) {
        return
      }

      // In production, this would:
      // 1. Remove user from Supabase
      // 2. Update company user count
      // 3. Adjust overage charges
      // 4. Update Stripe subscription

      setSuccess(`User ${user.user_name} removed successfully!`)
      setShowRemoveUserModal(false)
      setSelectedUser(null)
      
      // Reload data to reflect changes
      await loadCompanyData()

    } catch (err) {
      console.error('Error removing user:', err)
      setError('Failed to remove user')
    }
  }

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'enterprise': return 'text-purple-600 bg-purple-100'
      case 'professional': return 'text-blue-600 bg-blue-100'
      case 'starter': return 'text-green-600 bg-green-100'
      case 'free': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'past_due': return 'text-red-600 bg-red-100'
      case 'cancelled': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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

  if (!companyPlan) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Not Found</h2>
            <p className="text-gray-600">Unable to load company information.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const totalUpcomingAmount = upcomingPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const overageUsers = Math.max(0, companyPlan.current_users - companyPlan.max_users)
  const overageCost = overageUsers * companyPlan.price_per_user

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
            <p className="text-gray-600">Manage your company's billing and user limits</p>
          </div>
          <button
            onClick={loadCompanyData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Company Plan Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{companyPlan.name}</h2>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(companyPlan.plan_type)}`}>
                  {companyPlan.plan_type.charAt(0).toUpperCase() + companyPlan.plan_type.slice(1)} Plan
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(companyPlan.status)}`}>
                  {companyPlan.status.replace('_', ' ').charAt(0).toUpperCase() + companyPlan.status.replace('_', ' ').slice(1)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(companyPlan.monthly_fee)}</p>
              <p className="text-sm text-gray-600">Monthly Plan Fee</p>
            </div>
          </div>

          {/* User Limits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Users</p>
                  <p className="text-2xl font-bold text-gray-900">{companyPlan.current_users}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Plan Limit</p>
                  <p className="text-2xl font-bold text-gray-900">{companyPlan.max_users}</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overage Users</p>
                  <p className="text-2xl font-bold text-red-600">{overageUsers}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* User Management Actions */}
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </button>
            {userOverages.length > 0 && (
              <button
                onClick={() => setShowRemoveUserModal(true)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Remove User
              </button>
            )}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Payments</h2>
          <div className="space-y-4">
            {upcomingPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{payment.description}</p>
                    <p className="text-sm text-gray-600">Due: {formatDate(payment.due_date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <p className="text-lg font-semibold text-gray-900">Total Due</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalUpcomingAmount)}</p>
            </div>
          </div>
        </div>

        {/* Overage Users */}
        {userOverages.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Additional Users</h2>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(overageCost)}</p>
                <p className="text-sm text-gray-600">Monthly Overage Cost</p>
              </div>
            </div>
            <div className="space-y-3">
              {userOverages.map((user) => (
                <div key={user.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{user.user_name}</p>
                    <p className="text-sm text-gray-600">{user.user_email}</p>
                    <p className="text-xs text-gray-500">Added: {formatDate(user.added_date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(user.monthly_cost)}</p>
                    <p className="text-xs text-gray-600">per month</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  value={newUser.position}
                  onChange={(e) => setNewUser({...newUser, position: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter job position"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter department"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove User Modal */}
      {showRemoveUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Remove User</h3>
            <div className="space-y-4">
              {userOverages.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedUser(user)}
                >
                  <div>
                    <p className="font-medium text-gray-900">{user.user_name}</p>
                    <p className="text-sm text-gray-600">{user.user_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(user.monthly_cost)}</p>
                    <p className="text-xs text-gray-600">per month</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowRemoveUserModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedUser && handleRemoveUser(selectedUser)}
                disabled={!selectedUser}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove Selected User
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
} 