'use client'

import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Smartphone, 
  Download, 
  Wifi, 
  Bell, 
  CheckCircle, 
  ArrowRight, 
  RefreshCw,
  Clock,
  Globe,
  Zap
} from 'lucide-react'

export default function MobileLearningPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Learn Anywhere, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Anytime</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Native iOS and Android apps with offline support, cross-device sync, and push notifications. Your team can learn on the go, even without internet connection.
                </p>
                <div className="flex space-x-4 mb-8">
                  <Image
                    src="/assets/images/appstore.svg"
                    alt="Download on App Store"
                    width={140}
                    height={45}
                    className="hover:opacity-80 transition-opacity"
                  />
                  <Image
                    src="/assets/images/playstore.svg"
                    alt="Get it on Google Play"
                    width={140}
                    height={45}
                    className="hover:opacity-80 transition-opacity"
                  />
                </div>
                <Link 
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
                >
                  <span>Start Mobile Learning</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
              <div className="relative">
                <Image
                  src="/assets/images/shutterstock_1901378431-scaled.jpg"
                  alt="Mobile learning on smartphone"
                  width={500}
                  height={600}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  📱 Available Offline
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Mobile-First Training Experience</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Designed specifically for mobile devices with intuitive touch interactions and optimized performance.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Download className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Offline Downloads</h3>
                <p className="text-gray-600">Download modules for offline learning. Perfect for commutes or areas with poor connectivity.</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <RefreshCw className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Cross-Device Sync</h3>
                <p className="text-gray-600">Start on your phone, continue on tablet. Progress syncs automatically across all devices.</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Bell className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Smart Notifications</h3>
                <p className="text-gray-600">Gentle reminders and achievement notifications keep learners engaged and motivated.</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-orange-100 to-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Touch Optimized</h3>
                <p className="text-gray-600">Intuitive touch gestures, swipe navigation, and mobile-optimized quiz interactions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* App Screenshots */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">See the App in Action</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="relative">
                <Image
                  src="/assets/images/tutapp Ai module screen.png"
                  alt="AI Module Builder Mobile Interface"
                  width={300}
                  height={600}
                  className="mx-auto rounded-3xl shadow-2xl"
                />
                <div className="text-center mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Module Creation</h3>
                  <p className="text-gray-600">Create and edit training modules directly from your mobile device.</p>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/assets/images/tutapp leaderboard screen.png"
                  alt="Leaderboard Mobile Interface"
                  width={300}
                  height={600}
                  className="mx-auto rounded-3xl shadow-2xl"
                />
                <div className="text-center mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Leaderboards</h3>
                  <p className="text-gray-600">Gamified learning with team competitions and achievement tracking.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">Download the App Today</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of learners who train on the go with our mobile app.
            </p>
            <div className="flex justify-center space-x-4">
              <Image
                src="/assets/images/appstore.svg"
                alt="Download on App Store"
                width={160}
                height={55}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              <Image
                src="/assets/images/playstore.svg"
                alt="Get it on Google Play"
                width={160}
                height={55}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 