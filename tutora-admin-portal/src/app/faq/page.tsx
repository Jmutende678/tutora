'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQ {
  question: string
  answer: string
  isOpen: boolean
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      question: "How quickly can we get our team started?",
      answer: "Your team can start learning within minutes! After registration, you'll receive company codes that your employees can use to instantly access our platform. Our onboarding process takes less than 5 minutes per user.",
      isOpen: false
    },
    {
      question: "Can we create custom learning content?",
      answer: "Absolutely! Our AI Module Builder allows you to create personalized learning experiences tailored to your industry and company needs. You can upload your own content, set custom learning paths, and track progress in real-time.",
      isOpen: false
    },
    {
      question: "How does the pricing work?",
      answer: "Our pricing is per active learner per month. You only pay for team members who are actively using the platform. All plans include unlimited modules, progress tracking, and customer support. Enterprise plans include advanced analytics and priority support.",
      isOpen: false
    },
    {
      question: "Is there a mobile app?",
      answer: "Yes! Tutora is available on iOS and Android. Your team can learn anywhere, anytime. All progress syncs seamlessly between devices, so learning can continue whether they're at their desk or on the go.",
      isOpen: false
    },
    {
      question: "What kind of support do you provide?",
      answer: "We provide 24/7 customer support via chat, email, and phone. Our dedicated customer success team helps with onboarding, training, and optimization. Enterprise customers get a dedicated account manager.",
      isOpen: false
    },
    {
      question: "Can we integrate with our existing systems?",
      answer: "Tutora integrates with popular HRIS systems, Slack, Microsoft Teams, and more. We also provide APIs for custom integrations. Our team can help you set up seamless workflows with your existing tools.",
      isOpen: false
    }
  ])

  const toggleFAQ = (index: number) => {
    setFaqs(faqs.map((faq, i) => ({
      ...faq,
      isOpen: i === index ? !faq.isOpen : false
    })))
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-slate-600">
              Everything you need to know about Tutora
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  {faq.isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {faq.isOpen && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 