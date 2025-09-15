import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Successful | Welcome to Tutora',
  description: 'Your subscription has been activated! Welcome to Tutora - start creating AI-powered training modules today.',
}

'use client'

import React, { useEffect, useState } from 'react'
import { Navigation } from '@/components/Navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Zap, BookOpen, Users, BarChart3 } from 'lucide-react'

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState('')

  useEffect(() => {
    // Get session ID from URL
    const urlParams = new URLSearchParams(window.location.search)
    const sessionIdParam = urlParams.get('session_id')
    if (sessionIdParam) {
      setSessionId(sessionIdParam)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <CheckCircle className="w-4 h-4" />
            <span>Payment Successful</span>
          </div>
          
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to Tutora! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your subscription has been activated successfully. You're now ready to transform your team's training with AI-powered modules.
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-10 border border-gray-200 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What's Next?</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-left">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Start Creating</h3>
                </div>
                <p className="text-gray-600">
                  Jump right into our AI Module Builder and create your first training module in minutes. Upload a video or document and watch our AI transform it into engaging content.
                </p>
                <Link 
                  href="/demo/ai-module-builder"
                  className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Try AI Module Builder <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="text-left">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Explore Content</h3>
                </div>
                <p className="text-gray-600">
                  Browse our premium content library with 300+ professionally crafted training modules across multiple industries. Find content that fits your needs.
                </p>
                <Link 
                  href="/features/content-library"
                  className="inline-flex items-center mt-4 text-purple-600 hover:text-purple-800 font-medium"
                >
                  Browse Content Library <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-left">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Invite Your Team</h3>
                </div>
                <p className="text-gray-600">
                  Add team members to your account and start collaborative training. Assign modules, track progress, and see how your team is learning.
                </p>
                <Link 
                  href="/admin/team-management"
                  className="inline-flex items-center mt-4 text-green-600 hover:text-green-800 font-medium"
                >
                  Manage Team <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="text-left">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Track Progress</h3>
                </div>
                <p className="text-gray-600">
                  Monitor your team's learning progress with detailed analytics. See completion rates, quiz scores, and identify areas for improvement.
                </p>
                <Link 
                  href="/admin/analytics"
                  className="inline-flex items-center mt-4 text-orange-600 hover:text-orange-800 font-medium"
                >
                  View Analytics <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Need Help Getting Started?</h2>
            <p className="text-blue-100 mb-6">
              Our support team is here to help you make the most of Tutora. Get personalized onboarding and training.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <span>Contact Support</span>
              </Link>
              <a
                href="mailto:support@tutoralearn.com?subject=New Customer - Getting Started&body=Hi! I just subscribed to Tutora and would like help getting started."
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <span>Email Us</span>
              </a>
            </div>
          </div>

          {sessionId && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Session ID: {sessionId}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}