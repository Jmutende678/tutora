'use client'

import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { 
  TrendingUp, 
  Target, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Award,
  BookOpen,
  MessageSquare,
  BarChart3
} from 'lucide-react'

export default function SalesTeamsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Accelerate <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Sales Success</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Boost sales performance with product knowledge training, objection handling, and sales methodology courses that drive revenue growth.
              </p>
              <Link 
                href="/register"
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
              >
                <span>Boost Sales Performance</span>
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
                <BookOpen className="h-12 w-12 text-orange-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Product Knowledge</h3>
                <p className="text-gray-600">Deep product training that builds confidence and expertise.</p>
              </div>
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-red-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Objection Handling</h3>
                <p className="text-gray-600">Master techniques to overcome common sales objections.</p>
              </div>
              <div className="text-center">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Sales Methodology</h3>
                <p className="text-gray-600">Proven frameworks that increase close rates and deal size.</p>
              </div>
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Performance Tracking</h3>
                <p className="text-gray-600">Monitor training completion and sales performance correlation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">Drive Revenue Growth</h2>
            <p className="text-xl text-orange-100 mb-8">
              Join sales teams who've increased close rates by 35% and average deal size by 25%.
            </p>
            <Link
              href="/register"
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
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