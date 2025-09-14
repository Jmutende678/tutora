'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Smartphone, Bell, Download, CheckCircle } from 'lucide-react'

export default function MobileAppComingSoon() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName: '',
          lastName: '',
          message: 'Interested in mobile app notifications',
          type: 'mobile_app_interest',
          subject: 'Mobile App Launch Notification Request'
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('There was an error. Please try again or email support@tutoralearn.com')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Smartphone className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Tutora Mobile App
              <span className="block text-3xl text-blue-600 mt-2">Coming Soon</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Take your learning on the go with the Tutora mobile app. Access your training modules, 
              track progress, and learn anywhere, anytime.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Offline Learning</h3>
              <p className="text-gray-600">Download modules for offline access and learn without an internet connection.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Notifications</h3>
              <p className="text-gray-600">Get personalized reminders and updates to stay on track with your learning goals.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Sync</h3>
              <p className="text-gray-600">Seamlessly sync your progress across all devices - desktop, tablet, and mobile.</p>
            </div>
          </div>

          {/* Notification Signup */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            {isSubmitted ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">You're on the list!</h2>
                <p className="text-gray-600">
                  We'll notify you as soon as the Tutora mobile app is available for download.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Be the first to know</h2>
                <p className="text-gray-600 mb-6">
                  Get notified when the Tutora mobile app launches on iOS and Android.
                </p>
                
                <form onSubmit={handleNotifyMe} className="flex gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? 'Submitting...' : 'Notify Me'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Timeline */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Development Timeline</h2>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-gray-900 mb-2">Q1 2025</h3>
                  <p className="text-gray-600">Beta testing with select customers</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-gray-900 mb-2">Q2 2025</h3>
                  <p className="text-gray-600">iOS App Store launch</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-gray-900 mb-2">Q2 2025</h3>
                  <p className="text-gray-600">Google Play Store launch</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-16 text-center">
            <p className="text-gray-600">
              Have questions about the mobile app?{' '}
              <a href="mailto:support@tutoralearn.com" className="text-blue-600 hover:underline">
                Contact our team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
