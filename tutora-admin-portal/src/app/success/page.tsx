'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Copy, Download, Mail, Smartphone, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [companyCode, setCompanyCode] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const code = searchParams.get('code') || 'TUT-2024-DEMO123'
    const plan = searchParams.get('plan') || 'professional'
    setCompanyCode(code)
    setSelectedPlan(plan)
  }, [searchParams])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(companyCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const nextSteps = [
    {
      icon: Mail,
      title: 'Check Your Email',
      description: 'We\'ve sent detailed setup instructions and your admin credentials to your email address.',
      action: 'Open Email'
    },
    {
      icon: Smartphone,
      title: 'Download the App',
      description: 'Get the Tutora mobile app for iOS and Android to manage your team on the go.',
      action: 'Download App'
    },
    {
      icon: BookOpen,
      title: 'Create Your First Module',
      description: 'Start building your first training module with our AI-powered content creator.',
      action: 'Get Started'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Tutora!
          </h1>
          <p className="text-xl text-gray-600">
            Your {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} account has been created successfully.
          </p>
        </div>

        {/* Company Code */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Company Code</h2>
          <p className="text-gray-600 mb-4">
            Share this code with your team members to join your organization.
          </p>
          <div className="flex items-center space-x-3">
            <code className="flex-1 block bg-gray-100 px-4 py-2 rounded-lg font-mono text-lg">
              {companyCode}
            </code>
            <button
              onClick={handleCopyCode}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Copy className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 mt-2">
              Copied to clipboard!
            </p>
          )}
        </div>

        {/* Next Steps */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Next Steps</h2>
          {nextSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {step.description}
                    </p>
                    <button className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
                      {step.action}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Return to Dashboard */}
        <div className="text-center mt-12">
          <Link
            href="/admin/login"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            Go to Admin Login
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
} 