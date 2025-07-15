'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { CheckCircle, ArrowRight, Zap, Shield, Users, BarChart3, Star, Crown } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const plans = [
    {
      id: 'starter',
      name: "Starter",
      description: "Perfect for small teams just getting started",
      monthlyPrice: 12,
      annualPrice: 10,
      popular: false,
      features: [
        "Up to 25 team members",
        "5 AI-generated modules per month",
        "Basic analytics & reporting",
        "Email support",
        "Mobile app access",
        "Basic quiz & assessment tools"
      ],
      limitations: [
        "Limited to 5 modules per month",
        "Basic support only"
      ]
    },
    {
      id: 'professional',
      name: "Professional",
      description: "Ideal for growing organizations",
      monthlyPrice: 29,
      annualPrice: 24,
      popular: true,
      features: [
        "Up to 100 team members",
        "Unlimited AI-generated modules",
        "Advanced analytics & insights",
        "Priority support",
        "Custom branding",
        "Advanced quiz & certification",
        "API access",
        "Custom learning paths",
        "Progress tracking & reporting"
      ],
      limitations: []
    },
    {
      id: 'enterprise',
      name: "Enterprise",
      description: "For large organizations with specific needs",
      monthlyPrice: 79,
      annualPrice: 65,
      popular: false,
      features: [
        "Unlimited team members",
        "Unlimited AI-generated modules",
        "Advanced AI features & customization",
        "White-label solution",
        "24/7 dedicated support",
        "Custom integrations",
        "Advanced security features",
        "SLA guarantees",
        "Custom deployment options",
        "Dedicated account manager"
      ],
      limitations: []
    }
  ]

  const handleStartTrial = async (planId: string) => {
    setIsLoading(planId)
    
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          billingCycle,
          successUrl: `${window.location.origin}/success?plan=${planId}`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      })

      const data = await response.json()
      
      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        console.error('Failed to create checkout session:', data.error)
        alert('Failed to start checkout. Please try again.')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  const getPrice = (plan: any) => {
    return billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice
  }

  const getSavings = (plan: any) => {
    if (billingCycle === 'annual') {
      const monthlyCost = plan.monthlyPrice * 12
      const annualCost = plan.annualPrice * 12
      const savings = monthlyCost - annualCost
      return Math.round((savings / monthlyCost) * 100)
    }
    return 0
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              <span>14-day free trial • No credit card required</span>
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Transform your team training with AI-powered modules. Choose the plan that fits your organization's needs.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-500'}`}>
                Annual
              </span>
              {billingCycle === 'annual' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Save up to 20%
                </span>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-blue-500 ring-2 ring-blue-100' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      <Crown className="h-4 w-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-gray-900">${getPrice(plan)}</span>
                      <span className="text-gray-600 ml-2">/user/month</span>
                      {billingCycle === 'annual' && (
                        <div className="text-sm text-green-600 font-medium mt-1">
                          Save {getSavings(plan)}% annually
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleStartTrial(plan.id)}
                      disabled={isLoading === plan.id}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      } ${isLoading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLoading === plan.id ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>Start Free Trial</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Why Choose Tutora?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Creation</h3>
                <p className="text-gray-600">Turn any video or document into interactive training modules in minutes, not hours.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
                <p className="text-gray-600">Track progress, completion rates, and engagement with detailed insights.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
                <p className="text-gray-600">SOC2 compliant with bank-grade security and SSO integration.</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">How does the free trial work?</h3>
                <p className="text-gray-600">Get full access to all features for 14 days. No credit card required to start.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards, PayPal, and can arrange invoicing for enterprise customers.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is there a setup fee?</h3>
                <p className="text-gray-600">No setup fees. Pay only for active users on a monthly or annual basis.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-16">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Training?</h2>
            <p className="text-xl opacity-90 mb-6">
              Join thousands of companies already using Tutora to train their teams more effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleStartTrial('professional')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Start Free Trial
              </button>
              <Link
                href="/demo/ai-module-builder"
                className="bg-blue-500 bg-opacity-20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition-all"
              >
                Try Demo
              </Link>
            </div>
          </div>

          {/* Demo Bypass Link */}
          <div className="text-center mb-8">
            <Link 
              href="/demo/ai-module-builder"
              className="inline-flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span>🚀</span>
              <span>Skip to Demo (No signup required)</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 