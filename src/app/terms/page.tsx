'use client'

import React from 'react'
import Navigation from '@/components/Navigation'
import { FileText, Shield, Users, CreditCard, AlertTriangle, Scale } from 'lucide-react'

export default function TermsPage() {
  const lastUpdated = "December 15, 2024"

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: FileText,
      content: [
        {
          subtitle: "Agreement",
          text: "By accessing or using Tutora's platform, you agree to be bound by these Terms of Service and all applicable laws and regulations."
        },
        {
          subtitle: "Eligibility",
          text: "You must be at least 18 years old and have the authority to enter into this agreement on behalf of your organization."
        },
        {
          subtitle: "Updates",
          text: "We may modify these terms at any time. Continued use of our platform constitutes acceptance of updated terms."
        }
      ]
    },
    {
      id: "services",
      title: "Description of Services",
      icon: Users,
      content: [
        {
          subtitle: "Platform Access",
          text: "Tutora provides an AI-powered training platform that converts your content into interactive learning modules."
        },
        {
          subtitle: "AI Processing",
          text: "Our AI systems analyze your uploaded content to generate quizzes, assessments, and learning materials."
        },
        {
          subtitle: "Analytics & Reporting",
          text: "We provide analytics on learner progress, completion rates, and training effectiveness."
        },
        {
          subtitle: "Support Services",
          text: "Technical support and customer service are provided according to your subscription plan."
        }
      ]
    },
    {
      id: "user-responsibilities",
      title: "User Responsibilities",
      icon: Shield,
      content: [
        {
          subtitle: "Account Security",
          text: "You are responsible for maintaining the confidentiality of your account credentials and all activities under your account."
        },
        {
          subtitle: "Content Ownership",
          text: "You must own or have proper rights to all content you upload to our platform."
        },
        {
          subtitle: "Acceptable Use",
          text: "You agree not to use our platform for illegal activities, harassment, or distribution of malicious content."
        },
        {
          subtitle: "Data Accuracy",
          text: "You are responsible for ensuring the accuracy of information you provide to us."
        }
      ]
    },
    {
      id: "payment-terms",
      title: "Payment Terms",
      icon: CreditCard,
      content: [
        {
          subtitle: "Subscription Fees",
          text: "Fees are charged according to your selected plan and are due in advance for each billing period."
        },
        {
          subtitle: "Auto-Renewal",
          text: "Subscriptions automatically renew unless cancelled before the renewal date."
        },
        {
          subtitle: "Refund Policy",
          text: "Refunds are provided according to our refund policy. Contact support for refund requests."
        },
        {
          subtitle: "Price Changes",
          text: "We may change our pricing with 30 days' notice. Changes apply to subsequent billing periods."
        }
      ]
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: Scale,
      content: [
        {
          subtitle: "Our IP",
          text: "Tutora retains all rights to our platform, AI technology, and proprietary algorithms."
        },
        {
          subtitle: "Your Content",
          text: "You retain ownership of content you upload. You grant us license to process and analyze it for service provision."
        },
        {
          subtitle: "Generated Content",
          text: "AI-generated training materials based on your content are owned by you, subject to our platform rights."
        },
        {
          subtitle: "Trademarks",
          text: "Tutora and our logos are trademarks. You may not use them without written permission."
        }
      ]
    },
    {
      id: "limitations",
      title: "Limitations and Disclaimers",
      icon: AlertTriangle,
      content: [
        {
          subtitle: "Service Availability",
          text: "We strive for 99.9% uptime but cannot guarantee uninterrupted service availability."
        },
        {
          subtitle: "AI Accuracy",
          text: "While our AI is highly accurate, generated content should be reviewed before deployment."
        },
        {
          subtitle: "Third-Party Services",
          text: "We integrate with third-party services and are not responsible for their availability or performance."
        },
        {
          subtitle: "Limitation of Liability",
          text: "Our liability is limited to the amount paid for services in the 12 months preceding any claim."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <FileText className="h-4 w-4" />
              <span>Legal Agreement</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms of 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Service
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              These terms govern your use of Tutora's AI-powered training platform and related services.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Tutora</h2>
            <p className="text-gray-700 mb-4">
              These Terms of Service ("Terms") constitute a legal agreement between you and Tutora regarding your use of our AI-powered training platform and related services.
            </p>
            <p className="text-gray-700">
              Please read these terms carefully before using our platform. By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={section.id} className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-4">
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                
                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.subtitle}</h3>
                      <p className="text-gray-700">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Termination */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Termination</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Termination by You</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• You may cancel your subscription at any time</li>
                  <li>• Cancellation takes effect at the end of your billing period</li>
                  <li>• You retain access to your data for 30 days after cancellation</li>
                  <li>• Export your data before the retention period expires</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Termination by Tutora</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• We may suspend accounts for terms violations</li>
                  <li>• 30 days' notice for non-payment issues</li>
                  <li>• Immediate termination for serious violations</li>
                  <li>• Data export assistance provided when possible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data and Privacy */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Processing and Privacy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Processing</h3>
                <p className="text-gray-700">We process your content using AI to generate training materials. This processing is essential for service delivery and is covered by our Data Processing Agreement.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Protection</h3>
                <p className="text-gray-700">Your privacy is protected according to our Privacy Policy. We implement industry-standard security measures to protect your data.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Retention</h3>
                <p className="text-gray-700">We retain your data according to your subscription plan and applicable legal requirements. You can request data deletion at any time.</p>
              </div>
            </div>
            <div className="mt-6">
              <a 
                href="/privacy"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Read our Privacy Policy →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Governing Law */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Jurisdiction</h3>
                  <p className="text-gray-700">These terms are governed by the laws of California, United States.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Dispute Resolution</h3>
                  <p className="text-gray-700">Disputes will be resolved through binding arbitration in San Francisco, CA.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Class Action Waiver</h3>
                  <p className="text-gray-700">You agree to resolve disputes individually, not as part of a class action.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Questions</h3>
                  <p className="text-gray-700">For questions about these terms, contact: legal@tutoralearn.com</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Address</h3>
                  <p className="text-gray-700">Tutora, Inc.<br />San Francisco, CA<br />United States</p>
                </div>
                <div className="mt-6">
                  <a 
                    href="/contact"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold transform hover:scale-105"
                  >
                    Contact Legal Team
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Severability */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Legal Notes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Severability</h3>
                <p className="text-gray-700">If any provision of these terms is found unenforceable, the remaining provisions will continue in full force.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Entire Agreement</h3>
                <p className="text-gray-700">These terms, along with our Privacy Policy, constitute the entire agreement between you and Tutora.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Assignment</h3>
                <p className="text-gray-700">We may assign these terms in connection with a merger, acquisition, or sale of assets. You may not assign your rights without our consent.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
