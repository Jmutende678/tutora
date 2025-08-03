'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Download,
  Eye,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Star,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  RefreshCw
} from 'lucide-react'

interface Payment {
  id: string
  customerName: string
  customerEmail: string
  company: string
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  paymentMethod: string
  date: string
  description: string
  invoiceNumber: string
  subscriptionId?: string
}

interface Subscription {
  id: string
  customerName: string
  customerEmail: string
  company: string
  plan: string
  amount: number
  currency: string
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  startDate: string
  endDate: string
  nextBillingDate: string
  users: number
  modules: number
}

interface RevenueMetrics {
  totalRevenue: number
  monthlyRecurringRevenue: number
  annualRecurringRevenue: number
  averageRevenuePerUser: number
  totalCustomers: number
  activeSubscriptions: number
  churnRate: number
  growthRate: number
}

export default function PaymentsPage() {
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    const role = localStorage.getItem('admin_role')
    if (!isAuthenticated || role !== 'manager') {
      router.push('/admin/login')
      return
    }

    loadPaymentData()
  }, [])

  const loadPaymentData = async () => {
    try {
      setIsLoading(true)
      
      // Demo revenue metrics
      const demoMetrics: RevenueMetrics = {
        totalRevenue: 125000,
        monthlyRecurringRevenue: 8500,
        annualRecurringRevenue: 102000,
        averageRevenuePerUser: 850,
        totalCustomers: 147,
        activeSubscriptions: 142,
        churnRate: 3.4,
        growthRate: 12.5
      }

      const demoPayments: Payment[] = [
        {
          id: 'pay_1',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah@acmecorp.com',
          company: 'Acme Corp',
          amount: 299,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'card_visa',
          date: '2024-01-15',
          description: 'Professional Plan - Monthly',
          invoiceNumber: 'INV-2024-001',
          subscriptionId: 'sub_1'
        },
        {
          id: 'pay_2',
          customerName: 'Michael Chen',
          customerEmail: 'michael@techstart.com',
          company: 'TechStart Inc',
          amount: 599,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'card_mastercard',
          date: '2024-01-14',
          description: 'Enterprise Plan - Annual',
          invoiceNumber: 'INV-2024-002',
          subscriptionId: 'sub_2'
        },
        {
          id: 'pay_3',
          customerName: 'Emily Rodriguez',
          customerEmail: 'emily@innovate.com',
          company: 'Innovate Solutions',
          amount: 199,
          currency: 'USD',
          status: 'pending',
          paymentMethod: 'card_amex',
          date: '2024-01-13',
          description: 'Starter Plan - Monthly',
          invoiceNumber: 'INV-2024-003',
          subscriptionId: 'sub_3'
        }
      ]

      const demoSubscriptions: Subscription[] = [
        {
          id: 'sub_1',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah@acmecorp.com',
          company: 'Acme Corp',
          plan: 'Professional',
          amount: 299,
          currency: 'USD',
          status: 'active',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          nextBillingDate: '2024-02-01',
          users: 25,
          modules: 50
        },
        {
          id: 'sub_2',
          customerName: 'Michael Chen',
          customerEmail: 'michael@techstart.com',
          company: 'TechStart Inc',
          plan: 'Enterprise',
          amount: 599,
          currency: 'USD',
          status: 'active',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          nextBillingDate: '2024-02-01',
          users: 50,
          modules: 100
        },
        {
          id: 'sub_3',
          customerName: 'Emily Rodriguez',
          customerEmail: 'emily@innovate.com',
          company: 'Innovate Solutions',
          plan: 'Starter',
          amount: 199,
          currency: 'USD',
          status: 'trialing',
          startDate: '2024-01-13',
          endDate: '2024-02-13',
          nextBillingDate: '2024-02-13',
          users: 10,
          modules: 20
        }
      ]

      setMetrics(demoMetrics)
      setPayments(demoPayments)
      setSubscriptions(demoSubscriptions)
    } catch (error) {
      console.error('Error loading payment data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'past_due': return 'bg-orange-100 text-orange-800'
      case 'trialing': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
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
            <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
            <p className="text-gray-600 mt-2">Manage subscriptions, payments, and revenue analytics</p>
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

        {/* Revenue Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{metrics.growthRate}% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">MRR</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.monthlyRecurringRevenue)}</p>
                  <p className="text-sm text-blue-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +8.2% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.activeSubscriptions}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{metrics.activeSubscriptions - 135} new this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.churnRate}%</p>
                  <p className="text-sm text-red-600 flex items-center">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    +0.2% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Active Subscriptions</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{subscription.customerName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionStatusColor(subscription.status)}`}>
                    {subscription.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">{subscription.company}</div>
                  <div className="text-sm text-gray-600">{subscription.customerEmail}</div>
                  <div className="font-medium text-gray-900">{subscription.plan} Plan</div>
                  <div className="text-lg font-bold text-gray-900">{formatCurrency(subscription.amount)}</div>
                </div>
                
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Users</span>
                    <span className="font-medium">{subscription.users}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Modules</span>
                    <span className="font-medium">{subscription.modules}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Next Billing</span>
                    <span className="font-medium">{new Date(subscription.nextBillingDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                    <Eye className="w-4 h-4 inline mr-1" />
                    View
                  </button>
                  <button className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                    <RefreshCw className="w-4 h-4 inline mr-1" />
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Payments</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search payments..."
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{payment.customerName}</div>
                        <div className="text-sm text-gray-500">{payment.customerEmail}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{payment.company}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{formatCurrency(payment.amount, payment.currency)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{payment.description}</span>
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