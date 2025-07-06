'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { CreditCard, DollarSign, TrendingUp, Search, Filter } from 'lucide-react'

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden -m-8 p-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
                Payments
              </h1>
              <p className="text-xl text-white/70">
                Track all payments and subscription revenue
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <CreditCard className="h-6 w-6 mr-3" />
              Recent Payments
            </h3>
            <div className="space-y-4">
              {[
                { company: 'TechCorp Solutions', amount: '$2,999', date: '2 hours ago', status: 'Completed' },
                { company: 'StartupXYZ Inc', amount: '$299', date: '1 day ago', status: 'Completed' },
                { company: 'BigCorp Industries', amount: '$2,999', date: '2 days ago', status: 'Completed' },
                { company: 'SmallBiz Co', amount: '$99', date: '3 days ago', status: 'Failed' },
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <div className="text-white font-semibold">{payment.company}</div>
                    <div className="text-white/60 text-sm">{payment.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">{payment.amount}</div>
                    <div className={`text-sm ${payment.status === 'Completed' ? 'text-green-400' : 'text-red-400'}`}>
                      {payment.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 