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
  UserCheck
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import TrialPopup from '@/components/TrialPopup'

export default function HomePage() {
  const [visibleStats, setVisibleStats] = useState<Set<number>>(new Set())
  
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

  const features = [
    {
      title: "AI-Powered Course Creation",
      description: "Transform any video or document into an interactive training module in minutes. Our AI handles everything from quiz generation to progress tracking.",
      icon: Brain
    },
    {
      title: "Real-Time Analytics",
      description: "Track completion rates, quiz scores, and engagement metrics. Get actionable insights to improve your team's learning experience.",
      icon: BarChart3
    },
    {
      title: "Enterprise Security",
      description: "SOC2 Type II certified, GDPR compliant, and SSO enabled. Your data is protected by bank-grade security measures.",
      icon: Shield
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Head of Learning & Development",
      company: "TechFlow Solutions",
      content: "Tutora transformed our onboarding process. New hires are now productive 40% faster, and our employee satisfaction scores have never been higher.",
      rating: 5,
      image: "/images/testimonial-1.jpg"
    },
    {
      name: "Marcus Rodriguez", 
      role: "VP of Human Resources",
      company: "InnovateCorpF",
      content: "The AI-powered content creation is incredible. We've built 50+ custom modules in just 3 months. Our team engagement with training went from 30% to 95%.",
      rating: 5,
      image: "/images/testimonial-2.jpg"
    },
    {
      name: "Lisa Thompson",
      role: "Chief People Officer", 
      company: "GrowthTech",
      content: "ROI was evident within the first quarter. Reduced training costs by 60% while doubling the effectiveness. Tutora is now essential to our success.",
      rating: 5,
      image: "/images/testimonial-3.jpg"
    }
  ]

  // Credible industry placeholder logos (no obvious fakes)
  const trustLogos = [
    { name: "BrightPath Hotels", logo: "/assets/logos/brightpath.svg" },
    { name: "Northline Logistics", logo: "/assets/logos/northline.svg" },
    { name: "EverGrowth Retail", logo: "/assets/logos/evergrowth.svg" },
    { name: "Horizon Clinics", logo: "/assets/logos/horizon.svg" },
    { name: "MetroBuild Services", logo: "/assets/logos/metrobuild.svg" }
  ]

  const keyStats = [
    { 
      value: "57%", 
      label: "Faster training creation with AI",
      description: "Compared to traditional content creation methods"
    },
    { 
      value: "92%", 
      label: "Higher engagement rates",
      description: "Than static training materials"
    },
    { 
      value: "$2,400+", 
      label: "Annual savings per 100 employees",
      description: "In reduced training costs and improved productivity"
    },
    { 
      value: "486%", 
      label: "Average ROI in first year",
      description: "Across all customer implementations"
    }
  ]

  const howItWorks = [
    {
      step: "1",
      title: "Upload & Build",
      description: "Upload any video, document, or presentation. Our AI analyzes the content and creates interactive training modules automatically.",
      icon: Upload
    },
    {
      step: "2", 
      title: "Assign & Track",
      description: "Assign modules to teams or individuals. Monitor progress in real-time with detailed analytics and completion tracking.",
      icon: Target
    },
    {
      step: "3",
      title: "Track & Reward",
      description: "Celebrate achievements with certificates and leaderboards. Keep your team motivated and engaged with gamification.",
      icon: Award
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <TrialPopup />
      
      {/* Hero Section */}
      <main className="pt-32 bg-white">
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
              Upload a video or document. We build the training. Your team learns faster.
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
                className="bg-white text-slate-700 px-8 py-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center space-x-2 transform hover:scale-105"
              >
                <ArrowRight className="h-5 w-5" />
                <span>Book a Live Demo</span>
              </Link>
            </div>
            
            {/* Simplified trust stats - only 1-2 above fold */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 justify-center mb-12">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Join 500+ teams</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>92% higher engagement</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>
        </div>

        {/* How Tutora Works - moved above stats */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                How Tutora Works in 3 Simple Steps
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                From content to completion in minutes, not weeks
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl mb-6 font-bold text-lg">
                    {step.step}
                  </div>
                  <step.icon className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof / Company Logos */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-slate-500 mb-6">TRUSTED BY COMPANIES WORLDWIDE</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-60">
                {trustLogos.map((company, index) => (
                  <div key={index} className="h-12 w-32 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 hover:border-gray-200 transition-colors">
                    <span className="text-slate-600 font-medium text-sm">{company.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Stats Reveal */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Results That Speak for Themselves
              </h2>
              <p className="text-xl text-slate-600">
                Real impact, measured across hundreds of implementations
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyStats.map((stat, index) => (
                <div 
                  key={index}
                  data-stat-index={index}
                  className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center transition-all duration-700 transform hover:border-blue-300 hover:shadow-lg ${
                    visibleStats.has(index) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                  }`}
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{stat.label}</h3>
                  <p className="text-sm text-slate-600">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans & Pricing Snapshot */}
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-slate-600">
                Choose the plan that fits your team size and needs
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Basic</h3>
                <div className="text-3xl font-bold text-slate-900 mb-4">$12<span className="text-base font-normal text-slate-600">/user/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-slate-600">Up to 50 users</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-slate-600">10 AI modules/month</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-slate-600">Basic analytics</span>
                  </li>
                </ul>
                <Link href="/register" className="w-full bg-gray-50 hover:bg-gray-100 text-slate-700 py-3 px-6 rounded-xl font-medium transition-colors block text-center border border-gray-200">
                  Start Free Trial
                </Link>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white relative transform scale-105 shadow-xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <h3 className="text-xl font-semibold mb-2">Growth</h3>
                <div className="text-3xl font-bold mb-4">$29<span className="text-base font-normal opacity-80">/user/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-white" />
                    <span>Up to 200 users</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-white" />
                    <span>50 AI modules/month</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-white" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-white" />
                    <span>Custom branding</span>
                  </li>
                </ul>
                <Link href="/register" className="w-full bg-white text-blue-600 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors block text-center">
                  Start Free Trial
                </Link>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-slate-900 mb-4">$79<span className="text-base font-normal text-slate-600">/user/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-slate-600">Unlimited users</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-slate-600">Unlimited AI modules</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-slate-600">White-label solution</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-slate-600">Dedicated support</span>
                  </li>
                </ul>
                <Link href="/register" className="w-full bg-gray-50 hover:bg-gray-100 text-slate-700 py-3 px-6 rounded-xl font-medium transition-colors block text-center border border-gray-200">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Everything You Need to Train Your Team
              </h2>
              <p className="text-xl text-slate-600">
                Powerful features that drive real learning outcomes
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                  <feature.icon className="h-12 w-12 text-blue-600 mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Trust (NO emojis - use assets) */}
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Enterprise-Grade Security & Compliance
              </h2>
              <p className="text-xl text-slate-600">
                Your data is protected by industry-leading security measures
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center mb-12">
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md text-center">
                <Image 
                  src="/assets/images/SOC-2-Type-2.png" 
                  alt="SOC 2 Type II Certified" 
                  width={120} 
                  height={60} 
                  className="h-12 w-auto object-contain mx-auto mb-3"
                />
                <p className="text-sm font-medium text-slate-700">SOC 2 Type II</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md text-center">
                <Image 
                  src="/assets/images/GDPR-compliant_logo@2x.png.webp" 
                  alt="GDPR Compliant" 
                  width={120} 
                  height={60} 
                  className="h-12 w-auto object-contain mx-auto mb-3"
                />
                <p className="text-sm font-medium text-slate-700">GDPR Compliant</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md text-center">
                <Image 
                  src="/assets/images/99 PERCENT SLA .png" 
                  alt="99.9% Uptime SLA" 
                  width={120} 
                  height={60} 
                  className="h-12 w-auto object-contain mx-auto mb-3"
                />
                <p className="text-sm font-medium text-slate-700">99.9% Uptime SLA</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md text-center">
                <Image 
                  src="/assets/images/png-clipart-24-7-logo-24-7-service-customer-service-management-email-miscellaneous-blue.png" 
                  alt="24/7 Support" 
                  width={120} 
                  height={60} 
                  className="h-12 w-auto object-contain mx-auto mb-3"
                />
                <p className="text-sm font-medium text-slate-700">24/7 Support</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-slate-600 max-w-3xl mx-auto">
                Bank-grade encryption, role-based access controls, and comprehensive audit trails ensure your training data stays secure. 
                Our infrastructure meets the highest security standards with continuous monitoring and compliance certifications.
              </p>
            </div>
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