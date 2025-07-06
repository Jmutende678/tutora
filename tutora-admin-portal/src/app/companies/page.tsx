'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Building2, Users, DollarSign, Plus, Search, Filter } from 'lucide-react'

export default function CompaniesPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden -m-8 p-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
                Companies
              </h1>
              <p className="text-xl text-white/70">
                Manage all registered companies and their subscriptions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-tutora-blue to-tutora-purple rounded-2xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Company
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                type="text"
                placeholder="Search companies..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-tutora-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Company Cards */}
            {[
              { name: 'TechCorp Solutions', users: 187, plan: 'Enterprise', revenue: '$2,999', status: 'Active' },
              { name: 'StartupXYZ Inc', users: 45, plan: 'Professional', revenue: '$299', status: 'Active' },
              { name: 'BigCorp Industries', users: 312, plan: 'Enterprise', revenue: '$2,999', status: 'Active' },
              { name: 'SmallBiz Co', users: 23, plan: 'Starter', revenue: '$99', status: 'Trial' },
              { name: 'InnovateHub', users: 89, plan: 'Professional', revenue: '$299', status: 'Active' },
              { name: 'Future Tech Ltd', users: 156, plan: 'Enterprise', revenue: '$2,999', status: 'Active' },
            ].map((company, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-to-r from-tutora-blue to-tutora-purple rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        company.status === 'Active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {company.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-white/60" />
                      <span className="text-white/80 text-sm">{company.users} users</span>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      company.plan === 'Enterprise' 
                        ? 'bg-gradient-to-r from-orange-400 to-red-500' 
                        : company.plan === 'Professional'
                        ? 'bg-gradient-to-r from-purple-400 to-pink-500'
                        : 'bg-gradient-to-r from-blue-400 to-blue-500'
                    } text-white`}>
                      {company.plan}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-white/60" />
                      <span className="text-white/80 text-sm">Monthly Revenue</span>
                    </div>
                    <span className="text-white font-semibold">{company.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 