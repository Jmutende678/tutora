'use client'

import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Download,
  Play,
  FileText,
  Users
} from 'lucide-react'

export default function ContentLibraryPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Pre-Built <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Content Library</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Access hundreds of professionally crafted training modules, templates, and courses. Get started instantly with industry-specific content or customize to fit your needs.
              </p>
              <Link 
                href="/register"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
              >
                <span>Browse Content Library</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Content Categories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready-to-Use Training Content</h2>
              <p className="text-xl text-gray-600">
                Professional courses and templates across every industry and department.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200">
                <Users className="h-12 w-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-900">HR & Compliance</h3>
                <p className="text-gray-600 mb-4">Complete onboarding programs, harassment prevention, safety training, and compliance modules.</p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Employee onboarding (5 modules)</li>
                  <li>• Workplace safety training</li>
                  <li>• Anti-harassment policies</li>
                  <li>• Data privacy & GDPR</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200">
                <Star className="h-12 w-12 text-green-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Sales & Customer Service</h3>
                <p className="text-gray-600 mb-4">Sales enablement, customer service excellence, product knowledge, and communication skills.</p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Sales fundamentals course</li>
                  <li>• Customer service excellence</li>
                  <li>• Objection handling techniques</li>
                  <li>• Product demonstration skills</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200">
                <BookOpen className="h-12 w-12 text-purple-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Leadership & Management</h3>
                <p className="text-gray-600 mb-4">Executive training, team management, conflict resolution, and strategic thinking courses.</p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• New manager training</li>
                  <li>• Conflict resolution</li>
                  <li>• Performance management</li>
                  <li>• Strategic planning</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Library Features */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Smart Content Discovery</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Find exactly what you need with powerful search, intelligent filtering, and AI-powered recommendations based on your industry and team size.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Search className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Advanced Search</h4>
                      <p className="text-gray-600">Search by topic, industry, duration, or skill level to find the perfect content.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Filter className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Smart Filters</h4>
                      <p className="text-gray-600">Filter by department, experience level, content type, and estimated completion time.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Star className="h-6 w-6 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Curated Collections</h4>
                      <p className="text-gray-600">Expert-curated learning paths and course bundles for common training scenarios.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Popular Templates</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Play className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Employee Onboarding</span>
                    </div>
                    <span className="text-sm text-gray-600">4.9★</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Safety Training</span>
                    </div>
                    <span className="text-sm text-gray-600">4.8★</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Customer Service</span>
                    </div>
                    <span className="text-sm text-gray-600">4.9★</span>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Link href="/register" className="text-blue-600 font-semibold hover:text-blue-700">
                    View All Templates →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">Start Training Today</h2>
            <p className="text-xl text-indigo-100 mb-8">
              Access our entire content library with your free trial. No setup required, deploy instantly.
            </p>
            <Link
              href="/register"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>Browse Content Library</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
} 