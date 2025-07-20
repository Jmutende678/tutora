'use client'

import React from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Star, Quote, ArrowRight, Brain } from 'lucide-react'

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Head of Learning & Development",
      company: "TechFlow Solutions",
      content: "Tutora transformed our onboarding process. New hires are now productive 40% faster, and our employee satisfaction scores have never been higher.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "VP of Human Resources",
      company: "InnovateCorpF",
      content: "The AI-powered content creation is incredible. We've built 50+ custom modules in just 3 months. Our team engagement with training went from 30% to 95%.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      role: "Chief People Officer",
      company: "GrowthTech",
      content: "ROI was evident within the first quarter. Reduced training costs by 60% while doubling the effectiveness. Tutora is now essential to our success.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Training Manager",
      company: "FutureLearn Inc",
      content: "The platform's flexibility and ease of use have made it a hit with our team. The mobile app ensures learning never stops, even on the go.",
      rating: 5
    },
    {
      name: "Emily Zhang",
      role: "Director of People Operations",
      company: "InnovateCo",
      content: "Tutora's analytics have given us unprecedented insight into our team's learning patterns. We can now make data-driven decisions about training.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Trusted by leading companies worldwide
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how organizations are transforming their workforce with Tutora
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-24">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.name}
                className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                  <div className="text-gray-500">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 