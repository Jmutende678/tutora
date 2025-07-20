'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  CheckCircle,
  Brain,
  BarChart3,
  Shield,
  Users,
  Play,
  Star,
  Check,
  Award,
  Zap,
  Clock,
  Upload,
  BookOpen,
  TrendingUp,
  Target,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Globe
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import TrialPopup from '@/components/TrialPopup'

export default function HomePage() {
  const [visibleStats, setVisibleStats] = useState<Set<number>>(new Set())
  const [featuresOpen, setFeaturesOpen] = useState(false)
  
  // Intersection Observer for stats reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-stat-index') || '0')
            setVisibleStats(prev => new Set([...Array.from(prev), index]))
          }
        })
      },
      { threshold: 0.3 }
    )

    const statElements = document.querySelectorAll('[data-stat-index]')
    statElements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const howItWorks = [
    {
      step: '1',
      icon: Upload,
      title: 'Upload & Build',
      description: 'Upload any video, document, or presentation. Our AI instantly analyzes content and creates engaging training modules with quizzes and assessments.'
    },
    {
      step: '2', 
      icon: Users,
      title: 'Assign & Deploy',
      description: 'Instantly assign modules to individuals, teams, or your entire organization. Set due dates, send reminders, and track progress in real-time.'
    },
    {
      step: '3',
      icon: BarChart3,
      title: 'Track & Reward',
      description: 'Monitor completion rates, quiz scores, and engagement metrics. Celebrate achievements with leaderboards and automated certificates.'
    }
  ]

  const pricingPlans = [
    {
      name: 'Basic',
      price: '$12',
      description: 'Perfect for small teams',
      features: [
        'Up to 25 users',
        '5 AI modules/month',
        'Basic analytics',
        'Email support',
        'Mobile app access'
      ]
    },
    {
      name: 'Growth',
      price: '$29',
      description: 'For growing organizations',
      popular: true,
      features: [
        'Up to 250 users',
        'Unlimited AI modules',
        'Advanced analytics',
        'Priority support',
        'Custom branding',
        'API access'
      ]
    },
    {
      name: 'Enterprise',
      price: '$79',
      description: 'For large organizations',
      features: [
        'Unlimited users',
        'Advanced AI features',
        'White-label solution',
        '24/7 dedicated support',
        'Custom integrations',
        'SLA guarantees'
      ]
    }
  ]

  const supportFeatures = [
    {
      icon: '⚡',
      title: '< 4 Hours',
      description: 'Average response time for all support tickets'
    },
    {
      icon: '🎯',
      title: '99.5%',
      description: 'Customer satisfaction rating from our users'
    },
    {
      icon: '🌍',
      title: '24/7',
      description: 'Global support coverage across all time zones'
    }
  ]

  const helpMethods = [
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Instant help in-app'
    },
    {
      icon: '📧',
      title: 'Email Support',
      description: 'support@tutoralearn.com'
    },
    {
      icon: '📚',
      title: 'Help Center',
      description: 'Guides & tutorials'
    },
    {
      icon: '👥',
      title: 'Success Manager',
      description: 'Enterprise customers'
    }
  ]

  const securityFeatures = [
    {
      icon: Shield,
      title: 'SOC2 Type II',
      description: 'Certified security controls and annual audits',
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'GDPR Compliant',
      description: 'Full compliance with EU data protection laws',
      color: 'green'
    },
    {
      icon: Shield,
      title: '256-bit Encryption',
      description: 'Bank-grade encryption for all data transmission',
      color: 'purple'
    }
  ]

  const additionalSecurity = [
    'Single Sign-On (SSO) integration',
    'Regular security audits & pen testing',
    'Data residency options (US, EU, AU)',
    'Two-factor authentication (2FA)',
    '99.99% uptime SLA guarantee',
    'Complete audit logs & compliance reporting'
  ]

  const powerfulFeatures = [
    {
      icon: '📱',
      title: 'Mobile-First Training',
      subtitle: 'iOS & Android Apps',
      description: 'Your team can learn anywhere, anytime. Native iOS and Android apps with offline support, progress sync, and push notifications keep training on track.',
      features: [
        'Offline module downloads',
        'Cross-device progress sync', 
        'Smart push notifications',
        'Touch-optimized quizzes'
      ]
    },
    {
      icon: '📊',
      title: 'Live Analytics & Insights',
      subtitle: 'Live Dashboards',
      description: 'Real-time dashboards show completion rates, quiz scores, and engagement metrics. Export reports and integrate with your existing BI tools.',
      features: [
        'Real-time completion tracking',
        'Detailed quiz analytics',
        'CSV/Excel export',
        'API access for BI tools'
      ]
    },
    {
      icon: '🏆',
      title: 'Gamified Leaderboards',
      subtitle: 'Team Competition',
      description: 'Boost engagement with team competitions, achievement badges, and automated certificates. Turn training into a game your team actually wants to play.',
      features: [
        'Team & individual rankings',
        'Achievement badges',
        'Automated certificates',
        'Completion streaks'
      ]
    },
    {
      icon: '🎯',
      title: 'Advanced Question Types',
      subtitle: 'Interactive Quizzes',
      description: 'Go beyond multiple choice with drag-and-drop, image hotspots, scenario-based questions, and interactive simulations that test real understanding.',
      features: [
        'Drag & drop interactions',
        'Image hotspot questions',
        'Scenario simulations',
        'Video-based assessments'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <TrialPopup />
      
      {/* Simplified Hero Section */}
      <main className="pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              <span>New: AI Module Builder Now Available</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              The Only AI-Powered Training Platform
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                That Creates Modules in Minutes, Not Weeks
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform any video or document into engaging training modules automatically. Join 500+ companies revolutionizing their workforce development.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link
                href="/demo/ai-module-builder"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 transform hover:scale-105"
              >
                <Play className="h-5 w-5" />
                <span>See It in Action</span>
              </Link>
              <Link
                href="/register"
                className="border border-gray-300 text-slate-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 justify-center mb-12">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* How Tutora Works in 3 Simple Steps */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                How Tutora Works in 3 Simple Steps
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                From content upload to completion tracking, create professional training programs in minutes.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl mb-6 font-bold text-lg">
                    {step.step}
                  </div>
                  <step.icon className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                  {index === 0 && (
                    <div className="mt-4 text-sm text-blue-600 flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>10x faster than manual creation</span>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="mt-4 text-sm text-green-600 flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Works on any device, anywhere</span>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="mt-4 text-sm text-purple-600 flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>92% higher completion rates</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brief Pricing Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-slate-600">
                Flexible pricing that grows with your team. Start free, upgrade when you're ready.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div key={index} className={`p-8 rounded-2xl border-2 transition-all duration-300 relative ${
                  plan.popular 
                    ? 'border-blue-500 bg-blue-50 transform scale-105' 
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-slate-900 mb-6">
                    {plan.price}<span className="text-base font-normal text-slate-600">/user/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href="/register" 
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-colors block text-center ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : index === 2
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {index === 2 ? 'Contact Sales' : 'Start Free Trial'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* World-Class Support Section (Cleaner) */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                World-Class Support When You Need It
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our dedicated customer success team is here to help you succeed. Fast response times, expert guidance, and ongoing support to maximize your training ROI.
              </p>
            </div>

            {/* Support Stats */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {supportFeatures.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Help Methods */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-slate-900 mb-8 text-center">Multiple Ways to Get Help</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {helpMethods.map((method, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl mb-3">{method.icon}</div>
                    <h4 className="font-semibold text-slate-900 mb-1">{method.title}</h4>
                    <p className="text-sm text-slate-600">{method.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise-Grade Security & Privacy */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="text-5xl mb-6">🔒</div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Enterprise-Grade Security & Privacy
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Your data is protected by the same security standards used by Fortune 500 companies.
              </p>
            </div>

            {/* Security Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-2xl text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    feature.color === 'blue' ? 'bg-blue-100' :
                    feature.color === 'green' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    <feature.icon className={`h-8 w-8 ${
                      feature.color === 'blue' ? 'text-blue-600' :
                      feature.color === 'green' ? 'text-green-600' : 'text-purple-600'
                    }`} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Additional Security Features */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">Additional Security Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {additionalSecurity.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Powerful Features (Collapsible) */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-8">
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className="inline-flex items-center space-x-2 text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors"
              >
                <span>Powerful Features for Modern Training</span>
                {featuresOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
              </button>
              <p className="text-slate-600 mt-2">
                Everything you need to create, deploy, and track effective training programs.
              </p>
            </div>

            {featuresOpen && (
              <div className="space-y-12 animate-in slide-in-from-top duration-300">
                {powerfulFeatures.map((feature, index) => (
                  <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="text-4xl">{feature.icon}</div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900">{feature.title}</h3>
                            <p className="text-blue-600 font-medium">{feature.subtitle}</p>
                          </div>
                        </div>
                        <p className="text-slate-600 mb-6 leading-relaxed">{feature.description}</p>
                        <ul className="space-y-2">
                          {feature.features.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-center space-x-3">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-slate-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-100 p-8 rounded-xl text-center">
                        <div className="text-6xl mb-4">{feature.icon}</div>
                        <p className="text-slate-600 font-medium">{feature.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Conversion Footer */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Team's Training?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of companies already using AI to create better training experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demo/ai-module-builder"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Try It Free</span>
              </Link>
              <Link
                href="/register"
                className="bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-900 transition-colors flex items-center justify-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Book Demo</span>
              </Link>
              <Link
                href="mailto:sales@tutoralearn.com"
                className="bg-purple-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-900 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowRight className="h-5 w-5" />
                <span>Contact Sales</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 