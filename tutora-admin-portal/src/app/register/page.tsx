'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { BookOpen, Building, Mail, User, Phone, MapPin, CreditCard, Check, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('professional')
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    
    // Billing Information
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })

  useEffect(() => {
    const plan = searchParams.get('plan') || 'professional'
    const billing = searchParams.get('billing') || 'monthly'
    setSelectedPlan(plan)
    setBillingCycle(billing)
  }, [searchParams])

  const planPricing = {
    starter: { monthly: 12, annual: 10 },
    professional: { monthly: 29, annual: 24 },
    enterprise: { monthly: 79, annual: 65 }
  }

  const currentPrice = planPricing[selectedPlan as keyof typeof planPricing]?.[billingCycle as keyof typeof planPricing.starter] || 65

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      // Create Stripe checkout session with user data
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan,
          billingCycle,
          successUrl: `${window.location.origin}/success?plan=${selectedPlan}`,
          cancelUrl: `${window.location.origin}/register`,
          metadata: {
            companyName: formData.companyName,
            adminName: `${formData.firstName} ${formData.lastName}`,
            contactEmail: formData.email,
            contactPhone: formData.phone,
            industry: formData.industry,
            companySize: formData.companySize,
            website: formData.website,
            jobTitle: formData.jobTitle
          }
        }),
      })

      const data = await response.json()
      
      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        console.error('Failed to create checkout session:', data.error)
        alert('Failed to start checkout. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    {
      number: 1,
      title: "Company Information",
      description: "Tell us about your organization"
    },
    {
      number: 2,
      title: "Contact Details",
      description: "Your personal information"
    },
    {
      number: 3,
      title: "Review & Start Trial",
      description: "Confirm your details and begin"
    }
  ]

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.companyName && formData.industry && formData.companySize
      case 2:
        return formData.firstName && formData.lastName && formData.email
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3 text-xl font-bold text-gray-900">Tutora</div>
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pricing
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Steps */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Setup Progress</h3>
              
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep > step.number 
                        ? 'bg-green-100 text-green-600' 
                        : currentStep === step.number 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {currentStep > step.number ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                      <p className={`text-xs ${
                        currentStep >= step.number ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Selected Plan</h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
                    </span>
                    <span className="text-sm font-bold text-blue-600">${currentPrice}/user/mo</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {billingCycle === 'annual' ? 'Billed annually' : 'Billed monthly'}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    14-day free trial included
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
                  <div className="space-y-6">
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
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your company name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Industry *
                        </label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select industry</option>
                          <option value="technology">Technology</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="finance">Finance</option>
                          <option value="education">Education</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="retail">Retail</option>
                          <option value="consulting">Consulting</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Size *
                        </label>
                        <select
                          name="companySize"
                          value={formData.companySize}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1000 employees</option>
                          <option value="1000+">1000+ employees</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://yourcompany.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
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
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="John"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="john@company.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title
                        </label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="CEO, CTO, HR Manager, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Start Trial</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Company:</span>
                          <span className="ml-2 font-medium">{formData.companyName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Industry:</span>
                          <span className="ml-2 font-medium">{formData.industry}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Size:</span>
                          <span className="ml-2 font-medium">{formData.companySize}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Contact:</span>
                          <span className="ml-2 font-medium">{formData.firstName} {formData.lastName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Summary</h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-medium">
                          {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan
                        </span>
                        <span className="text-2xl font-bold text-blue-600">${currentPrice}/user/mo</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {billingCycle === 'annual' ? 'Billed annually' : 'Billed monthly'} • 14-day free trial
                      </p>
                      <div className="text-sm text-green-600 font-medium">
                        ✓ No credit card required for trial
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-yellow-800 mb-2">What happens next?</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Start your 14-day free trial immediately</li>
                        <li>• Receive your company code and admin credentials</li>
                        <li>• Access all features during your trial period</li>
                        <li>• No charges until your trial ends</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Previous
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={!isStepValid(currentStep) || isLoading}
                  className={`px-8 py-2 rounded-lg font-medium transition-all ${
                    !isStepValid(currentStep) || isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : currentStep === 3
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : currentStep === 3 ? (
                    'Start Free Trial'
                  ) : (
                    'Next'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 