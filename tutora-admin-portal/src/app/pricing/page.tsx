'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { CheckCircle, ArrowRight, Zap, Shield, Users, BarChart3, Star, Crown, Calculator, Info, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/EnhancedButton'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [userCount, setUserCount] = useState<number>(25) // Default to 25 users

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
      savings: "25% cheaper than TalentLMS equivalent",
      features: [
        "Up to 10 team members included",
        "Additional users only $8/month",
        "10 AI-generated modules per month", 
        "Basic analytics & reporting",
        "Email support",
        "Mobile app access",
        "Basic quiz & assessment tools"
      ],
      limitations: [
        "Limited to 10 AI modules per month",
        "Basic support only"
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
      savings: "Includes AI features that cost $70/month extra elsewhere",
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
      ],
      limitations: []
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
      savings: "Competitive with TalentLMS Pro + all add-ons",
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
      ],
      limitations: []
    },
    {
      id: 'enterprise',
      name: "Enterprise",
      description: "Full-scale solution for large organizations",
      monthlyPrice: 1999,
      annualPrice: 1699,
      baseUsers: 100,
      additionalUserPrice: 20,
      popular: false,
      recommendedFor: "Large organizations (75+ users)",
      savings: "Custom contracts available for 200+ users",
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
      ],
      limitations: []
    }
  ]

  const handleStartTrial = async (planId: string) => {
    setIsLoading(planId)
    
    try {
      const plan = plans.find(p => p.id === planId)
      if (!plan) throw new Error('Plan not found')
      
      // Calculate total price including additional users
      let totalUsers = userCount
      let totalPrice = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice
      
      if (userCount > plan.baseUsers) {
        const additionalUsers = userCount - plan.baseUsers
        totalPrice += (additionalUsers * plan.additionalUserPrice)
      }

      // Create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          billingCycle,
          userCount: totalUsers,
          successUrl: `${window.location.origin}/success?plan=${planId}`,
          cancelUrl: `${window.location.origin}/pricing`,
          metadata: {
            userCount: totalUsers.toString(),
            totalPrice: totalPrice.toString(),
            baseUsers: plan.baseUsers.toString(),
            additionalUsers: Math.max(0, totalUsers - plan.baseUsers).toString()
          }
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

  const calculatePrice = (plan: any) => {
    const basePrice = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice
    
    if (userCount <= plan.baseUsers) {
      return basePrice
    }
    
    const additionalUsers = userCount - plan.baseUsers
    return basePrice + (additionalUsers * plan.additionalUserPrice)
  }

  const getAdditionalUsersCost = (plan: any) => {
    if (userCount <= plan.baseUsers) return 0
    return (userCount - plan.baseUsers) * plan.additionalUserPrice
  }

  // Simple plan recommendation based on user count and value
  const getRecommendedPlan = () => {
    if (userCount <= 15) return 'starter'
    if (userCount <= 100) return 'professional'
    return 'enterprise'
  }

  const isRecommended = (planId: string) => {
    return getRecommendedPlan() === planId
  }

  // Calculate cost per user per day for value messaging
  const getCostPerUserPerDay = (plan: any) => {
    const monthlyPrice = calculatePrice(plan)
    const dailyCost = monthlyPrice / 30
    return dailyCost.toFixed(2)
  }

  // Validate and constrain user input
  const handleUserCountChange = (value: string) => {
    const num = parseInt(value) || 1
    const constrainedNum = Math.max(1, Math.min(10000, num))
    setUserCount(constrainedNum)
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
              Fair, Transparent Pricing
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Bundle pricing that scales with your team. No hidden fees, predictable costs, with low-cost user overflows when you grow.
            </p>
            
            {/* User Count Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                How many team members will use Tutora?
              </label>
              <div className="flex items-center justify-center space-x-4">
                <Users className="h-5 w-5 text-slate-500" />
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={userCount}
                  onChange={(e) => handleUserCountChange(e.target.value)}
                  className="w-32 px-4 py-3 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <span className="text-slate-600 font-medium">team members</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Include everyone who will access training materials
              </p>
            </div>
            
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
                  Save up to 18%
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Cost Breakdown */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-16">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Calculator className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">Your Cost Breakdown</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const totalPrice = calculatePrice(plan)
                const additionalCost = getAdditionalUsersCost(plan)
                const isRecommendedPlan = isRecommended(plan.id)
                const dailyCost = getCostPerUserPerDay(plan)
                
                return (
                  <div key={plan.id} className={`bg-white rounded-xl p-6 ${isRecommendedPlan ? 'ring-2 ring-green-400 shadow-lg' : 'shadow'}`}>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        ${totalPrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500 mb-3">
                        ${plan.baseUsers} users included + ${userCount > plan.baseUsers ? (userCount - plan.baseUsers) + ' additional' : '0 additional'}
                      </div>
                      <div className="text-xs text-slate-400">
                        Just ${(calculatePrice(plan) / userCount).toFixed(2)} per user per month
                      </div>
                      {isRecommendedPlan && (
                        <div className="mt-3 inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          <TrendingUp className="h-3 w-3" />
                          <span>Best value for {userCount} users</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="text-center mt-6">
              <div className="inline-flex items-center space-x-2 bg-white text-slate-700 px-4 py-2 rounded-lg text-sm shadow">
                <Info className="h-4 w-4" />
                <span>Bundle pricing includes base users • Additional users billed at low monthly rates</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => {
              const totalPrice = calculatePrice(plan)
              const additionalCost = getAdditionalUsersCost(plan)
              const isRecommendedPlan = isRecommended(plan.id)
              const annualSavings = 0 // No longer applicable for per-user pricing
              
              return (
                <div 
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                    plan.popular 
                      ? 'border-blue-500 ring-2 ring-blue-100' 
                      : isRecommendedPlan
                        ? 'border-green-400 ring-2 ring-green-100'
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

                  {isRecommendedPlan && !plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="inline-flex items-center space-x-1 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        <Star className="h-4 w-4" />
                        <span>Recommended for you</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                      <div className="text-sm text-blue-600 font-medium mb-6">
                        {plan.recommendedFor}
                      </div>
                      
                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-2">
                          ${plan.baseUsers} users included{userCount > plan.baseUsers ? ` + ${userCount - plan.baseUsers} additional users` : ''}
                        </div>
                        <div className="flex items-baseline justify-center space-x-2">
                          <span className="text-4xl font-bold text-gray-900">${totalPrice.toLocaleString()}</span>
                          <span className="text-gray-600">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                        </div>
                        {billingCycle === 'annual' && (
                          <div className="text-sm text-green-600 font-medium mt-2">
                            Save 15-17% with annual billing
                          </div>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => handleStartTrial(plan.id)}
                        isLoading={isLoading === plan.id}
                        loadingText="Processing..."
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                        fullWidth
                        hasGlow={plan.popular}
                        variant={plan.popular ? 'primary' : isRecommendedPlan ? 'success' : 'secondary'}
                      >
                        Start Free Trial
                      </Button>
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
              )
            })}
          </div>

          {/* Value Proposition */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Why Tutora Delivers Value
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">ROI in 30 Days</h3>
                <p className="text-gray-600">Reduce training time by 70% with AI-powered content creation. Get your team productive faster.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Measurable Results</h3>
                <p className="text-gray-600">Track completion rates, quiz scores, and skill improvements with detailed analytics.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enterprise Grade</h3>
                <p className="text-gray-600">SOC2 compliance, GDPR ready, and enterprise-grade security for your peace of mind.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-16">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Training?</h2>
            <p className="text-xl opacity-90 mb-6">
              Start your 14-day free trial. No credit card required.
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