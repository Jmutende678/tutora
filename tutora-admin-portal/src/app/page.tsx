// COMPLETE DASHBOARD REBUILD - July 6th 8:25PM
'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Building2, 
  CreditCard, 
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight
} from 'lucide-react'

import DashboardLayout from '@/components/DashboardLayout'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 125630,
    totalCompanies: 1847,
    totalUsers: 23451,
    activeSubscriptions: 1634,
  })

  return (
    <DashboardLayout>
      {/* Clear indicator this is the new version */}
      <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg animate-bounce">
        🎉 DASHBOARD REBUILT - WORKING! 🎉
      </div>
      
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-300">
            Welcome to your Tutora Admin Portal
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+12.5%</span>
              <span className="text-gray-400 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Companies</p>
                <p className="text-2xl font-bold text-white">{stats.totalCompanies.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight className="h-4 w-4 text-blue-400 mr-1" />
              <span className="text-blue-400">+8.2%</span>
              <span className="text-gray-400 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight className="h-4 w-4 text-purple-400 mr-1" />
              <span className="text-purple-400">+15.3%</span>
              <span className="text-gray-400 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Active Subscriptions</p>
                <p className="text-2xl font-bold text-white">{stats.activeSubscriptions.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <CreditCard className="h-6 w-6 text-orange-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight className="h-4 w-4 text-orange-400 mr-1" />
              <span className="text-orange-400">+5.7%</span>
              <span className="text-gray-400 ml-1">from last month</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">New user registration</p>
                <p className="text-gray-400 text-sm">john.doe@techcorp.com</p>
              </div>
              <span className="text-gray-400 text-sm">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">Payment received</p>
                <p className="text-gray-400 text-sm">$299.00 - Professional Plan</p>
              </div>
              <span className="text-gray-400 text-sm">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">Course completion</p>
                <p className="text-gray-400 text-sm">React Fundamentals - 95% completion rate</p>
              </div>
              <span className="text-gray-400 text-sm">6 hours ago</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-left transition-colors">
              <Building2 className="h-6 w-6 text-blue-400 mb-2" />
              <p className="text-white font-medium">Add New Company</p>
              <p className="text-gray-400 text-sm">Create a new company account</p>
            </button>
            <button className="p-4 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-left transition-colors">
              <Users className="h-6 w-6 text-green-400 mb-2" />
              <p className="text-white font-medium">Manage Users</p>
              <p className="text-gray-400 text-sm">View and edit user accounts</p>
            </button>
            <button className="p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-left transition-colors">
              <TrendingUp className="h-6 w-6 text-purple-400 mb-2" />
              <p className="text-white font-medium">View Analytics</p>
              <p className="text-gray-400 text-sm">Check performance metrics</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 