'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { CheckCircle, ArrowRight, Zap, Shield, Users, BarChart3, Star, Crown, Info } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/EnhancedButton'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const plans = [
    {
      id: 'starter',
      name: "Starter",
      description: "Perfect for small teams getting started",
      monthlyPrice: 89,
      annualPrice: 75,
      baseUsers: 10,
      additionalUserPrice: 8,
      popular: false,
      recommendedFor: "Small teams (1-15 users)",
      features: [
        "Up to 10 team members included",
        "Additional users only $8/month",
        "10 AI-generated modules per month", 
        "Basic analytics & reporting",
        "Email support",
        "Mobile app access",
        "Basic quiz & assessment tools"
      ]
    },
    {
      id: 'growth',
      name: "Growth",
      description: "Complete training solution for growing teams",
      monthlyPrice: 299,
      annualPrice: 249,
      baseUsers: 25,
      additionalUserPrice: 12,
      popular: true,
      recommendedFor: "Growing teams (15-40 users)",
      features: [
        "Up to 25 team members included",
        "Additional users only $12/month",
        "Unlimited AI-generated modules",
        "Advanced analytics & insights",
        "Priority support",
        "Custom branding",
        "Advanced quiz & certification",
        "API access",
        "Custom learning paths",
        "Progress tracking & reporting"
      ]
    },
    {
      id: 'professional',
      name: "Professional",
      description: "Advanced platform for established organizations",
      monthlyPrice: 699,
      annualPrice: 599,
      baseUsers: 50,
      additionalUserPrice: 14,
      popular: false,
      recommendedFor: "Established teams (30-75 users)",
      features: [
        "Up to 50 team members included",
        "Additional users only $14/month",
        "Unlimited AI-generated modules",
        "Advanced AI features & customization",
        "Priority support",
        "Custom branding & white-label options",
        "SSO integration",
        "Advanced security features",
        "API access",
        "Custom integrations",
        "Advanced analytics & reporting"
      ]
    }
  ]

  const enterprisePlan = {
    id: 'enterprise',
    name: "Enterprise",
    description: "Full-scale solution for large organizations",
    monthlyPrice: 1999,
    annualPrice: 1699,
    baseUsers: 100,
    additionalUserPrice: 20,
    recommendedFor: "Large organizations (75+ users)",
    features: [
      "Up to 100 team members included",
      "Additional users only $20/month",
      "Unlimited AI-generated modules",
      "Advanced AI features & customization",
      "White-label solution",
      "24/7 dedicated support",
      "Custom integrations",
      "Advanced security features",
      "SLA guarantees",
      "Custom deployment options",
      "Dedicated account manager"
    ]
  }

  const handleStartTrial = async (planId: string) => {
    setIsLoading(planId)
    
    try {
      // For enterprise, redirect to contact page
      if (planId === 'enterprise') {
        window.location.href = '/enterprise-contact'
        return
      }
      
      const plan = plans.find(p => p.id === planId)
      if (!plan) {
        throw new Error('Plan not found')
      }
      
      // Create checkout session with base plan pricing
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          billingCycle,
          basePrice: billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice,
          successUrl: `${window.location.origin}/success?plan=${planId}`,
          cancelUrl: window.location.href
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
      
    } catch (error) {
      console.error('Error starting trial:', error)
      alert('There was an error starting your trial. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Bundle pricing that scales with your team. No hidden fees, predictable costs, with low-cost user overflows when you grow.
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingCycle === 'annual' ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>Annual</span>
            </div>
          </div>

          {/* Main Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-8 ${
                  plan.popular
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-6">
                    <p className="font-medium">{plan.baseUsers} users included</p>
                    <p>Additional users: ${plan.additionalUserPrice}/{billingCycle === 'annual' ? 'year' : 'month'}</p>
                  </div>

                  <button
                    onClick={() => handleStartTrial(plan.id)}
                    disabled={isLoading === plan.id}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {isLoading === plan.id ? 'Loading...' : 'Get Started'}
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Enterprise Section - Separate Premium Design */}
          <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/api/placeholder/1200/400')] opacity-10"></div>
            <div className="relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium">Enterprise Solution</span>
                </div>
                <h2 className="text-4xl font-bold mb-4">{enterprisePlan.name}</h2>
                <p className="text-xl text-blue-100 mb-8">{enterprisePlan.description}</p>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="text-left">
                    <div className="mb-8">
                      <span className="text-5xl font-bold">
                        ${billingCycle === 'annual' ? enterprisePlan.annualPrice : enterprisePlan.monthlyPrice}
                      </span>
                      <span className="text-2xl text-blue-200">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                      <p className="text-blue-200 mt-2">
                        {enterprisePlan.baseUsers} users included • Additional: ${enterprisePlan.additionalUserPrice}/user
                      </p>
                    </div>

                    <div className="space-y-3 mb-8">
                      {enterprisePlan.features.slice(0, 6).map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-blue-100">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center md:text-left">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
                      <h3 className="text-2xl font-bold mb-4">Ready for Enterprise?</h3>
                      <p className="text-blue-100 mb-6">
                        Get a custom quote tailored to your organization's needs with volume discounts and dedicated support.
                      </p>
                      
                      <div className="space-y-6">
                        <button
                          onClick={() => handleStartTrial(enterprisePlan.id)}
                          disabled={isLoading === enterprisePlan.id}
                          className="w-full bg-white text-purple-900 py-4 px-6 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
                        >
                          {isLoading === enterprisePlan.id ? 'Loading...' : 'Start Enterprise Trial'}
                        </button>
                        
                        <Link href="/enterprise-contact">
                          <button className="w-full border-2 border-white/30 text-white py-4 px-6 rounded-xl font-medium hover:bg-white/10 transition-colors">
                            Contact Sales
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-16 text-center">
            <div className="bg-blue-50 rounded-2xl p-8">
              <Info className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Bundle pricing includes base users • Additional users billed at low monthly rates
              </h3>
              <p className="text-gray-600">
                All plans include mobile app access, SSL security, 99.9% uptime SLA, and full platform features. No setup fees or hidden costs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 