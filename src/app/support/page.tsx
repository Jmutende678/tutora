'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  MessageCircle,
  Phone,
  Mail,
  FileText,
  HelpCircle,
  ChevronRight,
  Search,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

interface Ticket {
  id: string
  title: string
  status: 'open' | 'in-progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  category: string
  lastUpdate: string
  description: string
}

export default function SupportPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }

    // Load demo data
    setTickets([
      {
        id: 'TK-001',
        title: 'Unable to access analytics dashboard',
        status: 'open',
        priority: 'high',
        category: 'Technical',
        lastUpdate: '2 hours ago',
        description: 'Users reporting 404 errors when accessing analytics page.'
      },
      {
        id: 'TK-002',
        title: 'Billing integration issue',
        status: 'in-progress',
        priority: 'medium',
        category: 'Billing',
        lastUpdate: '1 day ago',
        description: 'Payment processing delays for subscription renewals.'
      },
      {
        id: 'TK-003',
        title: 'Feature request: Custom reports',
        status: 'resolved',
        priority: 'low',
        category: 'Feature Request',
        lastUpdate: '3 days ago',
        description: 'Client requesting ability to create custom report templates.'
      }
    ])
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'in-progress': return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      default: return 'bg-slate-50 text-slate-700 border-slate-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-100'
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      default: return 'bg-slate-50 text-slate-700 border-slate-100'
    }
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Support Center</h1>
          <p className="text-slate-600 mt-2">
            Get help and manage support requests
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-blue-500 transition-colors group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Live Chat</h3>
            <p className="text-slate-600 text-sm">Get instant help from our support team</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-purple-500 transition-colors group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-purple-500 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Phone Support</h3>
            <p className="text-slate-600 text-sm">Schedule a call with a support agent</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-emerald-500 transition-colors group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Documentation</h3>
            <p className="text-slate-600 text-sm">Browse our help articles and guides</p>
          </div>
        </div>

        {/* Support Tickets */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Support Tickets</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>New Ticket</span>
              </button>
            </div>
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Last Update
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {ticket.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>
                        <p className="font-medium text-slate-900">{ticket.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{ticket.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {ticket.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {ticket.lastUpdate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Resources */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Popular Articles</h3>
            <div className="space-y-4">
              {[
                'Getting Started Guide',
                'Account Management',
                'Billing & Subscriptions',
                'API Documentation'
              ].map((article, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center">
                    <HelpCircle className="h-5 w-5 text-slate-400 mr-3" />
                    <span className="text-sm text-slate-700">{article}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Support Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900">Resolution Rate</p>
                    <p className="text-xs text-slate-500">Last 30 days</p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-emerald-600">98%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900">Avg. Response Time</p>
                    <p className="text-xs text-slate-500">Last 30 days</p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-blue-600">2.5h</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900">Open Tickets</p>
                    <p className="text-xs text-slate-500">Current</p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-amber-600">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 