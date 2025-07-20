'use client'

import { useState, useEffect } from 'react'
import { X, Brain, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function TrialPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Check if popup was already dismissed this session
    const dismissed = sessionStorage.getItem('trial-popup-dismissed')
    if (dismissed) return

    // Show popup after 90 seconds (90,000ms) - Phase 1 timing
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 90000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem('trial-popup-dismissed', 'true')
    }, 300)
  }

  const handleCTA = () => {
    // Track analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'popup_cta_clicked', {
        event_category: 'engagement',
        event_label: 'trial_popup'
      })
    }
    
    // Close popup and redirect
    sessionStorage.setItem('trial-popup-dismissed', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
      isClosing ? 'opacity-0' : 'opacity-100'
    }`}>
      <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close popup"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="text-center mb-4">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Your team deserves better training.
            </h3>
            <p className="text-slate-600">
              Want to see how easy we make it?
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* CTA Button */}
          <div className="space-y-4">
            <Link
              href="/demo/ai-module-builder"
              onClick={handleCTA}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center"
            >
              Give me a preview
            </Link>
            <div className="text-center">
              <p className="text-xs text-slate-500">
                *No credit card required
              </p>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="px-6 pb-6">
          <div className="text-center border-t border-gray-100 pt-4">
            <p className="text-xs text-slate-500">
              ✓ 14-day free trial • ✓ No credit card required • ✓ Setup in 5 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 