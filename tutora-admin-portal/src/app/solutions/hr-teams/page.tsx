'use client'

import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { 
  Users, 
  Shield, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  UserPlus,
  FileCheck,
  Award,
  TrendingUp
} from 'lucide-react'

export default function HRTeamsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Streamline <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">HR Training</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Transform your HR processes with automated onboarding, compliance training, and employee development programs that scale with your organization.
              </p>
              <Link 
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <UserPlus className="h-12 w-12 text-blue-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Automated Onboarding</h3>
                <p className="text-gray-600">Reduce onboarding time from weeks to days with automated training sequences.</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Compliance Tracking</h3>
                <p className="text-gray-600">Ensure 100% compliance with automated tracking and renewal reminders.</p>
              </div>
              <div className="text-center">
                <FileCheck className="h-12 w-12 text-purple-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Policy Training</h3>
                <p className="text-gray-600">Keep everyone updated on policies with instant deployment capabilities.</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Development Tracking</h3>
                <p className="text-gray-600">Track employee skill development and career progression paths.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16">Perfect for HR Teams</h2>
            <div className="space-y-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Employee Onboarding</h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Create consistent, engaging onboarding experiences that get new hires productive faster.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Welcome videos and company culture training</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Role-specific training modules</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Automated document collection</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <h4 className="font-semibold mb-4">Onboarding Progress</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Welcome & Culture</span>
                      <span className="text-green-600 font-semibold">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Safety Training</span>
                      <span className="text-green-600 font-semibold">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Role-Specific Training</span>
                      <span className="text-blue-600 font-semibold">75%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your HR Processes?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join HR teams who've reduced onboarding time by 60% and improved compliance by 95%.
            </p>
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
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