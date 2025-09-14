'use client'

import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Eye,
  Download,
  Target,
  Award,
  Calendar
} from 'lucide-react'

export default function AnalyticsDashboardPage() {
  const metrics = [
    {
      icon: TrendingUp,
      title: "Completion Rates",
      description: "Track module completion rates, identify bottlenecks, and optimize learning paths."
    },
    {
      icon: Target,
      title: "Quiz Performance", 
      description: "Detailed analytics on quiz scores, question difficulty, and knowledge gaps."
    },
    {
      icon: Clock,
      title: "Learning Time",
      description: "Monitor time spent on training, identify optimal learning durations."
    },
    {
      icon: Users,
      title: "Team Progress",
      description: "Compare team performance, identify top learners and those needing support."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Real-Time <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Analytics Dashboard</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Get actionable insights into your team's training progress with comprehensive analytics, real-time reporting, and data-driven recommendations to improve learning outcomes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/register"
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>View Analytics Demo</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-2xl">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Training Analytics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">94%</div>
                        <div className="text-sm text-gray-600">Completion Rate</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">87%</div>
                        <div className="text-sm text-gray-600">Avg Quiz Score</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Module 1: Onboarding</span>
                      <span className="text-green-600">100%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Module 2: Safety Training</span>
                      <span className="text-green-600">96%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Module 3: Product Knowledge</span>
                      <span className="text-yellow-600">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Track What Matters Most</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our analytics dashboard gives you complete visibility into your training programs with metrics that drive real business results.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <metric.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{metric.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <Eye className="h-12 w-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Real-Time Monitoring</h3>
                <p className="text-gray-600 mb-4">
                  Watch training progress unfold in real-time. See who's actively learning, where they're stuck, and when they complete modules.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Live progress tracking</li>
                  <li>• Instant completion notifications</li>
                  <li>• Real-time engagement metrics</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <Download className="h-12 w-12 text-green-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Export & Reporting</h3>
                <p className="text-gray-600 mb-4">
                  Generate comprehensive reports for stakeholders. Export data to Excel, PDF, or integrate with your existing BI tools.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• One-click report generation</li>
                  <li>• Multiple export formats</li>
                  <li>• Scheduled automated reports</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <Award className="h-12 w-12 text-purple-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-900">ROI Measurement</h3>
                <p className="text-gray-600 mb-4">
                  Measure the business impact of your training programs. Track productivity improvements and skill development over time.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Training ROI calculations</li>
                  <li>• Productivity correlation</li>
                  <li>• Cost-per-completion metrics</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">See Your Training Data Come to Life</h2>
            <p className="text-xl text-green-100 mb-8">
              Stop guessing about training effectiveness. Get the insights you need to make data-driven decisions.
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