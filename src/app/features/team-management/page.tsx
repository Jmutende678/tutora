'use client'

import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings, 
  CheckCircle, 
  ArrowRight, 
  Crown,
  FileText,
  Calendar,
  Bell
} from 'lucide-react'

export default function TeamManagementPage() {
  const features = [
    {
      icon: UserPlus,
      title: "Easy User Onboarding",
      description: "Add team members individually or in bulk. Automated welcome emails and instant access setup."
    },
    {
      icon: Shield,
      title: "Role-Based Permissions", 
      description: "Set custom roles and permissions. Control who can create, edit, or view specific training content."
    },
    {
      icon: Settings,
      title: "Group Management",
      description: "Organize teams by department, location, or role. Assign training based on group membership."
    },
    {
      icon: Calendar,
      title: "Assignment Scheduling",
      description: "Schedule training assignments with deadlines. Automated reminders keep everyone on track."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-20">
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Powerful <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Team Management</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Organize, assign, and track training across your entire organization. From individual learners to enterprise-wide deployments, manage it all from one central dashboard.
                </p>
                <Link 
                  href="/register"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
                >
                  <span>Start Managing Teams</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
              <div className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Team Overview</h3>
                    <Crown className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-gray-900">Sales Team</div>
                          <div className="text-sm text-gray-600">12 members</div>
                        </div>
                      </div>
                      <div className="text-green-600 font-semibold">95%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Team Control</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to manage training across teams of any size, from startups to enterprise organizations.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">Take Control of Your Team Training</h2>
            <p className="text-xl text-purple-100 mb-8">
              Stop juggling spreadsheets and email chains. Manage your entire team training from one powerful dashboard.
            </p>
            <Link
              href="/register"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
} 