'use client'

import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { 
  Globe, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Wifi,
  Smartphone,
  MessageCircle,
  Calendar
} from 'lucide-react'

export default function RemoteTeamsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Connect <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Remote Teams</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Keep distributed teams aligned and productive with mobile-first training, offline support, and real-time collaboration tools designed for remote work.
              </p>
              <Link 
                href="/register"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
              >
                <span>Connect Your Team</span>
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
                <Smartphone className="h-12 w-12 text-purple-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Mobile Access</h3>
                <p className="text-gray-600">Learn from anywhere on any device with offline capabilities.</p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
                <p className="text-gray-600">Foster connection through shared learning and team challenges.</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Flexible Scheduling</h3>
                <p className="text-gray-600">Accommodate different time zones with self-paced learning.</p>
              </div>
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-orange-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Communication Hub</h3>
                <p className="text-gray-600">Centralized discussions and announcements for the entire team.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">Unite Your Remote Team</h2>
            <p className="text-xl text-purple-100 mb-8">
              Join remote teams who've increased engagement by 85% and productivity by 50%.
            </p>
            <Link
              href="/register"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
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