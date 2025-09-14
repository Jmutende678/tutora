'use client'

import { useState } from 'react'
import { CheckCircle, Users, ArrowRight, Info } from 'lucide-react'

interface PricingPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  annualPrice: number
  baseUsers: number
  additionalUserPrice: number
  popular?: boolean
  features: string[]
}

interface EnhancedPricingCardProps {
  plan: PricingPlan
  billingCycle: 'monthly' | 'annual'
  onSelectPlan: (planId: string, userCount: number) => void
  isLoading?: boolean
}

export default function EnhancedPricingCard({ 
  plan, 
  billingCycle, 
  onSelectPlan, 
  isLoading = false 
}: EnhancedPricingCardProps) {
  const [userCount, setUserCount] = useState(plan.baseUsers)
  
  const basePrice = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice
  const additionalUsers = Math.max(0, userCount - plan.baseUsers)
  const additionalCost = additionalUsers * plan.additionalUserPrice
  const totalMonthlyPrice = basePrice + additionalCost
  const annualSavings = billingCycle === 'annual' 
    ? (plan.monthlyPrice - plan.annualPrice) * 12 + (additionalUsers * plan.additionalUserPrice * 12)
    : 0

  return (
    <div className={`relative rounded-2xl border-2 p-8 transition-all duration-300 ${
      plan.popular 
        ? 'border-blue-500 bg-blue-50 transform scale-105 shadow-xl' 
        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg'
    }`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600">{plan.description}</p>
      </div>

      {/* Pricing Display */}
      <div className="mb-6">
        <div className="flex items-baseline mb-2">
          <span className="text-4xl font-bold text-gray-900">
            ${totalMonthlyPrice}
          </span>
          <span className="text-base font-normal text-gray-600 ml-1">
            /{billingCycle === 'annual' ? 'month' : 'month'}
          </span>
        </div>
        
        {billingCycle === 'annual' && annualSavings > 0 && (
          <div className="text-sm text-green-600 font-medium">
            Save ${annualSavings} per year
          </div>
        )}

        <div className="text-sm text-blue-600 font-medium">
          {userCount} users included
        </div>
      </div>

      {/* User Count Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Users className="h-4 w-4 inline mr-1" />
          Number of Users
        </label>
        <select
          value={userCount}
          onChange={(e) => setUserCount(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {Array.from({ length: 20 }, (_, i) => {
            const count = plan.baseUsers + (i * 5)
            const extraCost = Math.max(0, count - plan.baseUsers) * plan.additionalUserPrice
            const price = basePrice + extraCost
            return (
              <option key={count} value={count}>
                {count} users - ${price}/month
              </option>
            )
          })}
        </select>
        
        {additionalUsers > 0 && (
          <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
            <Info className="h-4 w-4 inline mr-1" />
            {additionalUsers} additional users × ${plan.additionalUserPrice}/month = ${additionalCost}/month
          </div>
        )}
      </div>

      {/* Features */}
      <div className="mb-8">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onSelectPlan(plan.id, userCount)}
        disabled={isLoading}
        className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
          plan.popular
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>Start Free Trial</span>
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      {/* Trial Info */}
      <div className="mt-4 text-center text-sm text-gray-500">
        14-day free trial • No credit card required
      </div>
    </div>
  )
}
