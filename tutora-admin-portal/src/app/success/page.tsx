'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { CheckCircle, ArrowRight, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [plan, setPlan] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams) {
      setPlan(searchParams.get('plan'))
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Tutora!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your {plan ? `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan` : 'subscription'} is now active. 
              You have 14 days to explore all features risk-free.
            </p>
          </div>

          {/* What's Next */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What's next?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Invite Your Team</h3>
                <p className="text-sm text-gray-600">Add team members and start collaborating on training modules.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Create Your First Module</h3>
                <p className="text-sm text-gray-600">Upload a video or document and let AI create your first training module.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
                <p className="text-sm text-gray-600">Monitor team progress and engagement with detailed analytics.</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin/dashboard"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/demo/ai-module-builder"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <span>Try AI Module Builder</span>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Need help getting started? Our team is here to help!
            </p>
            <Link
              href="/support"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}