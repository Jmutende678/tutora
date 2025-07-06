'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Users, Building2, Mail, Plus, Search, Filter } from 'lucide-react'

export default function UsersPage() {
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
                Users
              </h1>
              <p className="text-xl text-white/70">
                Manage all platform users and their progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-tutora-blue to-tutora-purple rounded-2xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add User
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-tutora-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-white/80 font-semibold">User</th>
                    <th className="text-left py-3 px-4 text-white/80 font-semibold">Company</th>
                    <th className="text-left py-3 px-4 text-white/80 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 text-white/80 font-semibold">Progress</th>
                    <th className="text-left py-3 px-4 text-white/80 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'John Smith', email: 'john@techcorp.com', company: 'TechCorp Solutions', role: 'Admin', progress: 95, status: 'Active' },
                    { name: 'Sarah Johnson', email: 'sarah@startup.com', company: 'StartupXYZ Inc', role: 'Manager', progress: 78, status: 'Active' },
                    { name: 'Mike Davis', email: 'mike@bigcorp.com', company: 'BigCorp Industries', role: 'User', progress: 65, status: 'Active' },
                    { name: 'Emily Wilson', email: 'emily@smallbiz.com', company: 'SmallBiz Co', role: 'Admin', progress: 42, status: 'Inactive' },
                    { name: 'David Brown', email: 'david@innovate.com', company: 'InnovateHub', role: 'User', progress: 88, status: 'Active' },
                  ].map((user, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gradient-to-r from-tutora-blue to-tutora-purple rounded-xl flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{user.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-white/60 text-sm">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-white/60" />
                          <span className="text-white/80">{user.company}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          user.role === 'Admin' 
                            ? 'bg-gradient-to-r from-orange-400 to-red-500' 
                            : user.role === 'Manager'
                            ? 'bg-gradient-to-r from-purple-400 to-pink-500'
                            : 'bg-gradient-to-r from-blue-400 to-blue-500'
                        } text-white`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                              style={{ width: `${user.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-white text-sm font-medium">{user.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          user.status === 'Active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 