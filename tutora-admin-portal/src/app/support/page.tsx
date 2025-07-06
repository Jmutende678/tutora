'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { HelpCircle, Mail, Phone, MessageSquare } from 'lucide-react'

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen relative overflow-hidden p-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative z-10 space-y-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
                Support
              </h1>
              <p className="text-xl text-white/70">
                Get help and contact our support team
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 bg-gradient-to-r from-tutora-blue to-tutora-purple rounded-xl flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Email Support</h3>
                  <p className="text-white/60 text-sm">Get help via email</p>
                </div>
              </div>
              <p className="text-white/80 mb-4">Send us an email and we'll respond within 24 hours.</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-tutora-blue to-tutora-purple rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300">
                Contact Support
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 bg-gradient-to-r from-tutora-green to-tutora-light-green rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Live Chat</h3>
                  <p className="text-white/60 text-sm">Chat with our team</p>
                </div>
              </div>
              <p className="text-white/80 mb-4">Start a live chat session for immediate assistance.</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-tutora-green to-tutora-light-green rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300">
                Start Chat
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 bg-gradient-to-r from-tutora-pink to-tutora-orange rounded-xl flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Phone Support</h3>
                  <p className="text-white/60 text-sm">Call us directly</p>
                </div>
              </div>
              <p className="text-white/80 mb-4">Call our support hotline for urgent issues.</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-tutora-pink to-tutora-orange rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300">
                Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 