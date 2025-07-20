'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building, 
  Mail, 
  User, 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Zap,
  BarChart3,
  Shield,
  Smartphone
} from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Business Basics
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    jobTitle: '',
    
    // Step 2: Team Details
    teamSize: '',
    industry: '',
    currentTrainingMethod: '',
    
    // Step 3: Needs Assessment
    primaryGoal: '',
    urgency: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getRecommendedPlan = () => {
    const teamSizeNum = parseInt(formData.teamSize.split('-')[0]) || 0
    if (teamSizeNum <= 25) return 'basic'
    if (teamSizeNum <= 250) return 'growth'
    return 'enterprise'
  }

  const planDetails = {
    basic: {
      name: 'Basic',
      price: '$12',
      description: 'Perfect for small teams',
      features: ['Up to 25 users', '5 AI modules/month', 'Basic analytics', 'Email support']
    },
    growth: {
      name: 'Growth',
      price: '$29',
      description: 'For growing organizations',
      features: ['Up to 250 users', 'Unlimited AI modules', 'Advanced analytics', 'Priority support'],
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      price: '$79',
      description: 'For large organizations',
      features: ['Unlimited users', 'Advanced AI features', '24/7 dedicated support', 'Custom integrations']
    }
  }

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStartTrial = () => {
    const recommendedPlan = getRecommendedPlan()
    // Redirect to pricing with pre-selected plan and collected data
    const queryParams = new URLSearchParams({
      plan: recommendedPlan,
      email: formData.email,
      company: formData.companyName,
      size: formData.teamSize
    })
    router.push(`/pricing?${queryParams.toString()}`)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.companyName && formData.jobTitle
      case 2:
        return formData.teamSize && formData.industry && formData.currentTrainingMethod
      case 3:
        return formData.primaryGoal && formData.urgency
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-24 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentStep === 1 && "Let's get to know you"}
                {currentStep === 2 && "Tell us about your team"}
                {currentStep === 3 && "What are your training goals?"}
                {currentStep === 4 && "Perfect! Here's our recommendation"}
              </h1>
              <p className="text-gray-600">
                {currentStep === 1 && "We'll use this to personalize your experience"}
                {currentStep === 2 && "This helps us recommend the right plan for you"}
                {currentStep === 3 && "Understanding your needs helps us serve you better"}
                {currentStep === 4 && "Based on your answers, we've found the perfect plan"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Step 1: Business Basics */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your work email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your company name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <select
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="ceo">CEO/Founder</option>
                    <option value="hr-director">HR Director</option>
                    <option value="learning-development">Learning & Development</option>
                    <option value="operations">Operations Manager</option>
                    <option value="training-manager">Training Manager</option>
                    <option value="department-head">Department Head</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Team Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How many people are in your team/organization? *
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { value: '1-10', label: '1-10 people' },
                      { value: '11-25', label: '11-25 people' },
                      { value: '26-50', label: '26-50 people' },
                      { value: '51-100', label: '51-100 people' },
                      { value: '101-250', label: '101-250 people' },
                      { value: '251-500', label: '251-500 people' },
                      { value: '501-1000', label: '501-1000 people' },
                      { value: '1000+', label: '1000+ people' }
                    ].map((option) => (
                      <label key={option.value} className="relative">
                        <input
                          type="radio"
                          name="teamSize"
                          value={option.value}
                          checked={formData.teamSize === option.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.teamSize === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <Users className="h-5 w-5" />
                            <span className="font-medium">{option.label}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What industry are you in? *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select your industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance & Banking</option>
                    <option value="education">Education</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail">Retail & E-commerce</option>
                    <option value="consulting">Consulting</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="non-profit">Non-Profit</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How do you currently train your team? *
                  </label>
                  <select
                    name="currentTrainingMethod"
                    value={formData.currentTrainingMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select current method</option>
                    <option value="in-person">In-person workshops</option>
                    <option value="video-calls">Video calls/Zoom meetings</option>
                    <option value="documents">PDF documents/manuals</option>
                    <option value="youtube">YouTube videos</option>
                    <option value="lms">Existing LMS platform</option>
                    <option value="informal">Informal/on-the-job training</option>
                    <option value="none">No formal training process</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Needs Assessment */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's your primary training goal? *
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'onboarding', label: 'Improve employee onboarding', icon: '🚀' },
                      { value: 'compliance', label: 'Ensure compliance training', icon: '⚖️' },
                      { value: 'skills', label: 'Develop team skills', icon: '📚' },
                      { value: 'sales', label: 'Sales enablement', icon: '💼' },
                      { value: 'productivity', label: 'Increase productivity', icon: '📈' },
                      { value: 'retention', label: 'Improve employee retention', icon: '🤝' }
                    ].map((option) => (
                      <label key={option.value} className="relative">
                        <input
                          type="radio"
                          name="primaryGoal"
                          value={option.value}
                          checked={formData.primaryGoal === option.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.primaryGoal === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{option.icon}</span>
                            <span className="font-medium">{option.label}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How quickly do you want to get started? *
                  </label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select timeline</option>
                    <option value="immediately">Immediately (this week)</option>
                    <option value="soon">Soon (within 2 weeks)</option>
                    <option value="month">Within a month</option>
                    <option value="quarter">Within 3 months</option>
                    <option value="exploring">Just exploring options</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 4: Plan Recommendation */}
            {currentStep === 4 && (
              <div className="text-center">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Perfect! We recommend the {planDetails[getRecommendedPlan() as keyof typeof planDetails].name} plan
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Based on your team size of {formData.teamSize} people, this plan will give you the best value and features.
                  </p>
                </div>

                {/* Recommended Plan Card */}
                <div className="max-w-md mx-auto mb-8">
                  {(() => {
                    const plan = planDetails[getRecommendedPlan() as keyof typeof planDetails]
                    return (
                      <div className="border-2 border-blue-500 rounded-2xl p-6 bg-blue-50">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                          <p className="text-gray-600 mb-4">{plan.description}</p>
                          <div className="text-4xl font-bold text-blue-600 mb-2">
                            {plan.price}<span className="text-lg text-gray-600">/user/month</span>
                          </div>
                        </div>
                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })()}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-2">✨ What happens next?</h3>
                  <div className="text-left max-w-md mx-auto space-y-2 text-sm text-gray-600">
                    <p>• Start your 14-day free trial (no credit card required)</p>
                    <p>• Upload your first training content in minutes</p>
                    <p>• Invite your team and start tracking progress</p>
                    <p>• Get dedicated onboarding support</p>
                  </div>
                </div>

                <button
                  onClick={handleStartTrial}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <span>Start My Free Trial</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  No credit card required • 14-day free trial • Cancel anytime
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 ${
                    currentStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={!isStepValid()}
                  className={`px-8 py-3 rounded-lg font-medium flex items-center space-x-2 ${
                    isStepValid()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Trust Signals */}
          <div className="mt-8 text-center">
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>SOC2 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>10,000+ Happy Users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 