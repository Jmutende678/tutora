'use client'

import { useState } from 'react'
import { Check, Star, Zap, Shield, Users, BookOpen, BarChart3, HeadphonesIcon, Sparkles, Crown, Rocket, ArrowRight, Globe, Lock, Heart } from 'lucide-react'

const PRICING_PLANS = [
  {
    id: 'basic',
    name: 'Starter',
    price: 99,
    yearlyPrice: 990,
    description: 'Perfect for small teams taking their first step',
    features: [
      'Up to 50 users',
      'Essential training modules',
      'Progress tracking & insights',
      '24/7 email support',
      'Basic analytics dashboard',
      'Mobile app access',
      'SSL security'
    ],
    icon: <Rocket className="h-6 w-6" />,
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    glowColor: 'blue-500',
    popular: false,
    emoji: '🚀'
  },
  {
    id: 'premium',
    name: 'Professional',
    price: 299,
    yearlyPrice: 2990,
    description: 'Advanced features for ambitious companies',
    features: [
      'Up to 200 users',
      'Advanced training modules',
      'Custom quizzes & assessments',
      'Advanced analytics & AI insights',
      'Priority support & onboarding',
      'Custom branding & themes',
      'API access & integrations',
      'Advanced security features',
      'Performance benchmarking'
    ],
    icon: <Crown className="h-6 w-6" />,
    gradient: 'from-purple-400 via-purple-500 to-pink-500',
    glowColor: 'purple-500',
    popular: true,
    emoji: '👑'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    yearlyPrice: 9990,
    description: 'Complete solution for industry leaders',
    features: [
      'Unlimited users',
      'Custom training modules with AI',
      'Advanced AI-powered features',
      'White-label solution',
      'Dedicated success manager',
      'Custom integrations & SSO',
      '99.9% SLA guarantee',
      'Enterprise-grade security',
      'Custom deployment options',
      'Priority feature requests'
    ],
    icon: <Shield className="h-6 w-6" />,
    gradient: 'from-orange-400 via-red-500 to-pink-500',
    glowColor: 'orange-500',
    popular: false,
    emoji: '⚡'
  }
]

const FAQ_ITEMS = [
  {
    question: 'How quickly can we get started?',
    answer: 'Lightning fast! Once you complete payment, your company code and admin access are generated instantly. You can start adding users and content immediately.',
    emoji: '⚡'
  },
  {
    question: 'Can we customize the training content?',
    answer: 'Absolutely! Premium and Enterprise plans include powerful content creation tools. Upload your materials, create custom quizzes, and use AI to generate personalized training modules.',
    emoji: '🎨'
  },
  {
    question: 'Is there a setup fee?',
    answer: 'Zero setup fees! You only pay the subscription. We even provide free white-glove onboarding to get you running smoothly.',
    emoji: '💝'
  },
  {
    question: 'Can we change plans later?',
    answer: 'Of course! Upgrade or downgrade anytime. Changes are instant with smart prorated billing.',
    emoji: '🔄'
  },
  {
    question: 'What happens to our data if we cancel?',
    answer: 'Your data is yours forever. We provide 30 days to export everything before account closure. No data hostage situations!',
    emoji: '🔒'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes! 14-day money-back guarantee. Not happy? We\'ll refund your first payment, no questions asked.',
    emoji: '��'
  }
]

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'VP of Learning, TechCorp',
    avatar: '👩‍💼',
    comment: 'Tutora transformed how we onboard new employees. 10x faster and way more engaging!'
  },
  {
    name: 'Marcus Johnson',
    role: 'CEO, StartupXYZ',
    avatar: '👨‍💼',
    comment: 'Best investment we made. Our team productivity increased 40% after implementing Tutora.'
  },
  {
    name: 'Lisa Park',
    role: 'HR Director, Enterprise Co',
    avatar: '👩‍🎓',
    comment: 'The AI-powered content creation is mind-blowing. It\'s like having a learning designer on staff.'
  }
]

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  const handleGetStarted = async (planId: string) => {
    setSelectedPlan(planId)
    setIsLoading(true)

    try {
      // Redirect to checkout form
      window.location.href = `/checkout?plan=${planId}&billing=${isAnnual ? 'annual' : 'monthly'}`
    } catch (error) {
      console.error('Error starting checkout:', error)
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number, yearlyPrice: number) => {
    if (isAnnual) {
      const monthlyEquivalent = Math.round(yearlyPrice / 12)
      return {
        amount: monthlyEquivalent,
        period: '/month',
        note: `$${yearlyPrice}/year`,
        savings: `Save $${(price * 12) - yearlyPrice}`
      }
    }
    return {
      amount: price,
      period: '/month',
      note: 'billed monthly',
      savings: null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 h-60 w-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-50 bg-white/10 backdrop-blur-xl border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center group">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Tutora</span>
                <div className="text-sm text-purple-200 font-medium">Learning Platform</div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">Features</a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">Pricing</a>
              <a href="#testimonials" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">Reviews</a>
              <a href="#faq" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">FAQ</a>
            </nav>
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium mb-8 hover:bg-white/20 transition-all duration-300">
            <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
            Join 1,800+ companies already transforming their teams
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Transform Your Team's
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Learning Journey
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Empower your employees with AI-powered training modules, track progress in real-time, and boost productivity with our intelligent learning platform that adapts to your team.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
              <span className="text-white/90 font-semibold ml-2">4.9/5 from 2,100+ reviews</span>
            </div>
            <div className="flex items-center space-x-4 text-white/80">
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                <span>Global reach</span>
              </div>
              <div className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                <span>Enterprise secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2">
            <button
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                !isAnnual 
                  ? 'bg-white text-gray-900 shadow-lg' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                isAnnual 
                  ? 'bg-white text-gray-900 shadow-lg' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {PRICING_PLANS.map((plan, index) => {
            const pricing = formatPrice(plan.price, plan.yearlyPrice)
            const isHovered = hoveredPlan === plan.id
            
            return (
              <div
                key={plan.id}
                className={`relative group transition-all duration-500 hover:scale-105 ${
                  plan.popular ? 'lg:-mt-4 lg:mb-4' : ''
                }`}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      🔥 Most Popular
                    </div>
                  </div>
                )}
                
                <div className={`relative h-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 ${
                  plan.popular ? 'ring-2 ring-purple-400 ring-opacity-60' : ''
                } ${isHovered ? 'bg-white/20 shadow-2xl shadow-purple-500/20' : ''} transition-all duration-300`}>
                  
                  {/* Card glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} opacity-0 ${
                    isHovered ? 'opacity-10' : ''
                  } rounded-3xl transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${plan.gradient} shadow-lg`}>
                        {plan.icon}
                      </div>
                      <div className="text-3xl">{plan.emoji}</div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-white/70 mb-6 leading-relaxed">{plan.description}</p>
                    
                    <div className="mb-8">
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-white">${pricing.amount}</span>
                        <span className="text-white/70 ml-2">{pricing.period}</span>
                      </div>
                      <div className="text-sm text-white/60 mt-1">{pricing.note}</div>
                      {pricing.savings && (
                        <div className="text-green-400 text-sm font-semibold mt-2">
                          💰 {pricing.savings}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleGetStarted(plan.id)}
                      disabled={isLoading && selectedPlan === plan.id}
                      className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 mb-8 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-2xl hover:shadow-purple-500/25'
                          : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                      } ${isLoading && selectedPlan === plan.id ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                    >
                      {isLoading && selectedPlan === plan.id ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          Get Started
                          <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      )}
                    </button>
                    
                    <div className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <div className={`flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mr-3`}>
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-white/90 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Loved by teams worldwide 🌎
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-white/70 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-white/90 italic">"{testimonial.comment}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Frequently Asked Questions 🤔
          </h2>
          
          <div className="space-y-6">
            {FAQ_ITEMS.map((item, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <span className="text-2xl mr-3">{item.emoji}</span>
                  {item.question}
                </h3>
                <p className="text-white/80 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to transform your team? 🚀
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of companies already using Tutora to level up their teams
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
              Start Your Free Trial 
              <Heart className="inline h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 