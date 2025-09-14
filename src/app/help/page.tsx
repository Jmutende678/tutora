'use client'

import React, { useState } from 'react'
import Navigation from '@/components/Navigation'
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Book,
  Video,
  Users
} from 'lucide-react'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "Available 9AM-6PM PST",
      action: "Start Chat",
      color: "blue"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with a support specialist",
      availability: "Monday-Friday 9AM-6PM PST",
      action: "Call Now",
      color: "green"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "Response within 4 hours",
      action: "Send Email",
      color: "purple"
    }
  ]

  const quickLinks = [
    {
      icon: Book,
      title: "Getting Started Guide",
      description: "Learn the basics of using Tutora",
      href: "/docs/getting-started"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step tutorials",
      href: "/docs/tutorials"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Add and manage team members",
      href: "/docs/user-management"
    },
    {
      icon: FileText,
      title: "API Documentation",
      description: "Integrate with our platform",
      href: "/docs/api"
    }
  ]

  const faqs = [
    {
      question: "How do I create my first training module?",
      answer: "Upload any document, video, or presentation to your dashboard. Our AI will automatically analyze the content and generate interactive training modules with quizzes and assessments. The process typically takes 2-5 minutes depending on content length."
    },
    {
      question: "What file formats are supported?",
      answer: "We support PDF documents, PowerPoint presentations, Word documents, MP4 videos, MP3 audio files, and plain text. For best results, ensure your content is clear and well-structured."
    },
    {
      question: "How does billing work for additional users?",
      answer: "Each plan includes a base number of users. Additional users are billed monthly at the per-user rate for your plan. You can add or remove users anytime, and billing adjusts automatically on your next invoice."
    },
    {
      question: "Can I customize the training modules?",
      answer: "Yes! After AI generation, you can edit questions, add custom content, modify assessments, and adjust the learning flow. You have full control over the final training experience."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade security with AES-256 encryption, SOC 2 Type II certification, and GDPR compliance. Your content is never shared and is processed in secure, isolated environments."
    },
    {
      question: "How do I track learner progress?",
      answer: "Our analytics dashboard shows completion rates, quiz scores, time spent, and engagement metrics for each learner and module. You can export reports and set up automated notifications."
    },
    {
      question: "Can I integrate with my existing systems?",
      answer: "Yes, we offer integrations with popular HR systems, LMS platforms, and productivity tools. Our API also allows custom integrations. Contact our team for specific integration requirements."
    },
    {
      question: "What happens if I need to cancel?",
      answer: "You can cancel anytime with no penalties. Your account remains active until the end of your billing period, and you can export all your data. We also offer a 30-day data retention period after cancellation."
    }
  ]

  const handleSupportAction = (title: string) => {
    switch (title) {
      case "Live Chat":
        // In a real implementation, this would open a chat widget
        alert("Live chat would open here. For now, please email support@tutoralearn.com")
        break
      case "Phone Support":
        window.location.href = "tel:+15551238886"
        break
      case "Email Support":
        window.location.href = "mailto:support@tutoralearn.com?subject=Support Request"
        break
    }
  }

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-25 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
          
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <HelpCircle className="h-4 w-4" />
              <span>We're Here to Help</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Help &
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Support
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Find answers to your questions, get help with your account, or contact our support team directly.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Support</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the support method that works best for you. Our team is committed to helping you succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => (
              <div key={index} className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${
                  option.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  option.color === 'green' ? 'from-green-500 to-green-600' :
                  'from-purple-500 to-purple-600'
                } rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <option.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <p className="text-sm text-gray-500 mb-6">{option.availability}</p>
                <button
                  onClick={() => handleSupportAction(option.title)}
                  className={`w-full bg-gradient-to-r ${
                    option.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    option.color === 'green' ? 'from-green-500 to-green-600' :
                    'from-purple-500 to-purple-600'
                  } text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105`}
                >
                  {option.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Resources</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick access to the most helpful guides and documentation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                  <link.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{link.title}</h3>
                <p className="text-gray-600 mb-4">{link.description}</p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:underline">
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Questions</span>
            </h2>
            <p className="text-lg text-gray-600">
              Find quick answers to the most common questions about Tutora.
            </p>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-8 pb-6">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-600">No FAQs found matching your search.</p>
              <p className="text-gray-600 mt-2">Try different keywords or contact our support team.</p>
            </div>
          )}
        </div>
      </section>

      {/* Support Stats */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              World-Class 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Support</span>
            </h2>
            <p className="text-lg text-gray-600">
              Our commitment to exceptional customer support, backed by real metrics.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Clock, stat: "< 4 Hours", label: "Average Response Time" },
              { icon: CheckCircle, stat: "99.5%", label: "Customer Satisfaction" },
              { icon: Star, stat: "24/7", label: "Support Coverage" },
              { icon: Users, stat: "500+", label: "Happy Customers" }
            ].map((item, index) => (
              <div key={index} className="text-center bg-white rounded-2xl p-8 border border-gray-200">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{item.stat}</div>
                <div className="text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Still Need 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Help?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Our support team is standing by to help you succeed with Tutora.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Our Support Team</h3>
            <p className="text-gray-700 mb-6">
              Get personalized help from our expert support team. We're here to ensure your success.
            </p>
            <div className="space-y-2 text-gray-700 mb-8">
              <p><strong>Email:</strong> support@tutoralearn.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-8886</p>
              <p><strong>Hours:</strong> Monday-Friday 9AM-6PM PST</p>
            </div>
            <div className="space-y-4">
              <a 
                href="mailto:support@tutoralearn.com"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold transform hover:scale-105 inline-block"
              >
                Email Support Team
              </a>
              <div>
                <a 
                  href="/contact"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Or use our contact form →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
