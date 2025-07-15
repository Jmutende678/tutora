'use client'

import { useState } from 'react'
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
  BookOpen
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import TrialPopup from '@/components/TrialPopup'

export default function HomePage() {
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

  const trustBadges = [
    { icon: Shield, text: "SOC2 Type II Certified" },
    { icon: Award, text: "GDPR Compliant" },
    { icon: Zap, text: "99.99% Uptime SLA" },
    { icon: Clock, text: "24/7 Enterprise Support" }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <TrialPopup />
      
      {/* Hero Section */}
      <main className="pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              <span>New: AI Module Builder Now Available</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Train Smarter. Not Harder.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Let AI Build Your Team's Training in Minutes
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Tutora turns your videos into interactive training modules with quizzes, 
              analytics, and compliance tracking — all in one place. Trusted by leading 
              companies worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/demo/ai-module-builder"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
              >
                <Brain className="h-5 w-5" />
                <span>Try AI Builder Demo</span>
              </Link>
              <Link
                href="/register"
                className="bg-white text-slate-700 px-8 py-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all font-semibold flex items-center justify-center space-x-2"
              >
                <ArrowRight className="h-5 w-5" />
                <span>Start Free Trial</span>
              </Link>
              <button className="bg-white text-slate-700 px-8 py-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all font-semibold flex items-center justify-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Watch 60s Demo</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 justify-center">
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

            {/* Trust Logos */}
            <div className="mt-16 border-t border-gray-100 pt-16">
              <p className="text-sm text-gray-500 mb-8">TRUSTED BY TEAMS AT</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70">
                <Image src="/images/logo-1.svg" alt="Company Logo" width={120} height={40} />
                <Image src="/images/logo-2.svg" alt="Company Logo" width={120} height={40} />
                <Image src="/images/logo-3.svg" alt="Company Logo" width={120} height={40} />
                <Image src="/images/logo-4.svg" alt="Company Logo" width={120} height={40} />
              </div>
            </div>
          </div>

          {/* Product Preview */}
          <div className="mb-32 relative">
            <div className="aspect-[16/9] max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-gray-200">
              <Image
                src="/images/shutterstock_1901378431-scaled.jpg"
                alt="Tutora Platform Preview"
                width={1920}
                height={1080}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-4">
              {trustBadges.map((badge) => (
                <div
                  key={badge.text}
                  className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-100"
                >
                  <badge.icon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Everything You Need to Train Your Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built for modern teams who need to move fast and stay compliant. 
                Create, deploy, and track training modules in minutes, not months.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Demo Section */}
          <div className="py-24 bg-gradient-to-br from-gray-50 to-white rounded-2xl mb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Experience Tutora in Action
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Upload a short training video and watch as Tutora's AI transforms it into 
                  a comprehensive learning module within seconds.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                {/* Demo Container */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  {/* Upload Area */}
                  <div className="p-8 border-b border-gray-100">
                    <Link 
                      href="/demo/ai-module-builder"
                      className="block relative group"
                    >
                      <div className="aspect-video bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 hover:border-blue-500 transition-all cursor-pointer">
                        <div className="bg-white rounded-full p-4 shadow-md mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Try the AI Module Builder
                        </h3>
                        <p className="text-sm text-gray-600 text-center max-w-md">
                          Upload any training video or document and see how our AI creates an 
                          interactive learning module in real-time.
                        </p>
                      </div>
                      
                      {/* Preview Features */}
                      <div className="mt-8 grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <Brain className="h-6 w-6 text-blue-600 mb-2" />
                          <h4 className="font-medium text-gray-900 mb-1">Smart Analysis</h4>
                          <p className="text-sm text-gray-600">AI extracts key concepts and learning objectives</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <BookOpen className="h-6 w-6 text-blue-600 mb-2" />
                          <h4 className="font-medium text-gray-900 mb-1">Quiz Generation</h4>
                          <p className="text-sm text-gray-600">Auto-generated questions to test understanding</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <BarChart3 className="h-6 w-6 text-blue-600 mb-2" />
                          <h4 className="font-medium text-gray-900 mb-1">Progress Tracking</h4>
                          <p className="text-sm text-gray-600">Monitor completion and performance</p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Call to Action */}
                  <div className="bg-gray-50 p-8 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Ready to transform your training?
                      </h4>
                      <p className="text-sm text-gray-600">
                        Get full access to all features with a free trial.
                      </p>
                    </div>
                    <Link
                      href="/register"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center space-x-2"
                    >
                      <span>Start Free Trial</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="py-24 bg-gradient-to-br from-gray-50 to-white rounded-2xl mb-24">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Trusted by Leading Companies
                </h2>
                <p className="text-xl text-gray-600">
                  See how organizations are transforming their workforce with Tutora
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.name}
                    className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 text-lg">"{testimonial.content}"</p>
                    <div className="flex items-center space-x-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-gray-600">{testimonial.role}</div>
                        <div className="text-gray-500">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-24 text-white text-center">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Modernize Your Team Training?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of companies already training their teams with Tutora.
                Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/contact"
                  className="bg-blue-500 bg-opacity-20 text-white px-8 py-4 rounded-lg hover:bg-opacity-30 transition-all duration-200 font-semibold"
                >
                  Schedule a Demo
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="py-24 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                <div className="col-span-2">
                  <Link href="/" className="flex items-center space-x-2 mb-6">
                    <div className="relative w-10 h-10">
                      <Image 
                        src="/tutora_logo.png" 
                        alt="Tutora" 
                        fill 
                        className="object-contain" 
                      />
                    </div>
                    <span className="text-xl font-semibold">Tutora</span>
                  </Link>
                  <p className="text-gray-600 mb-6">
                    AI-powered training platform that helps teams learn faster and work better.
                  </p>
                  <div className="flex space-x-4">
                    <Link href="https://apps.apple.com" className="block">
                      <Image 
                        src="/images/appstore.svg" 
                        alt="Download on App Store" 
                        width={120} 
                        height={40} 
                      />
                    </Link>
                    <Link href="https://play.google.com" className="block">
                      <Image 
                        src="/images/playstore.svg" 
                        alt="Get it on Google Play" 
                        width={120} 
                        height={40} 
                      />
                    </Link>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
                  <ul className="space-y-3">
                    <li><Link href="/features" className="text-gray-600 hover:text-gray-900">Features</Link></li>
                    <li><Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
                    <li><Link href="/testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</Link></li>
                    <li><Link href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
                  <ul className="space-y-3">
                    <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                    <li><Link href="/support" className="text-gray-600 hover:text-gray-900">Support</Link></li>
                    <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
                    <li><Link href="/admin/login" className="text-gray-600 hover:text-gray-900">Admin Portal</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
                  <ul className="space-y-3">
                    <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
                    <li><Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link></li>
                    <li><Link href="/security" className="text-gray-600 hover:text-gray-900">Security</Link></li>
                    <li><Link href="/gdpr" className="text-gray-600 hover:text-gray-900">GDPR</Link></li>
                  </ul>
                </div>
              </div>
              <div className="mt-16 pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-gray-500">
                    © {new Date().getFullYear()} Tutora. All rights reserved.
                  </p>
                  <div className="flex items-center space-x-6">
                    <Link href="/privacy" className="text-gray-500 hover:text-gray-900">Privacy Policy</Link>
                    <Link href="/terms" className="text-gray-500 hover:text-gray-900">Terms of Service</Link>
                    <Link href="/cookies" className="text-gray-500 hover:text-gray-900">Cookie Policy</Link>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
} 