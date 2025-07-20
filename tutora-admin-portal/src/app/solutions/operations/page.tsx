'use client'

import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { 
  Settings, 
  Target, 
  BarChart3, 
  CheckCircle, 
  ArrowRight, 
  Cog,
  FileText,
  Users,
  Shield
} from 'lucide-react'

export default function OperationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Standardize <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Operations</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Create consistent operational procedures across all locations. Ensure quality standards, safety protocols, and process efficiency through comprehensive training.
              </p>
              <Link 
                href="/register"
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
              >
                <span>Standardize Operations</span>
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
                <Cog className="h-12 w-12 text-green-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Process Standardization</h3>
                <p className="text-gray-600">Ensure every team member follows the same proven procedures.</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Safety Training</h3>
                <p className="text-gray-600">Comprehensive safety protocols to protect your workforce.</p>
              </div>
              <div className="text-center">
                <Target className="h-12 w-12 text-purple-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Quality Control</h3>
                <p className="text-gray-600">Maintain consistent quality standards across all operations.</p>
              </div>
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-orange-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Performance Metrics</h3>
                <p className="text-gray-600">Track operational efficiency and identify improvement areas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">Optimize Your Operations</h2>
            <p className="text-xl text-green-100 mb-8">
              Join operations teams who've improved efficiency by 40% and reduced errors by 70%.
            </p>
            <Link
              href="/register"
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
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