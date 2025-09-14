'use client'

import React from 'react'
import Navigation from '@/components/Navigation'
import { Shield, Lock, Eye, FileText, Users, Globe } from 'lucide-react'

export default function PrivacyPage() {
  const lastUpdated = "December 15, 2024"

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: FileText,
      content: [
        {
          subtitle: "Account Information",
          text: "When you create an account, we collect your name, email address, company information, and billing details."
        },
        {
          subtitle: "Usage Data",
          text: "We collect information about how you use our platform, including training modules accessed, completion rates, and engagement metrics."
        },
        {
          subtitle: "Content Data",
          text: "Training materials you upload are processed by our AI systems to generate learning modules. This content is encrypted and stored securely."
        },
        {
          subtitle: "Technical Information",
          text: "We collect device information, IP addresses, browser type, and other technical data to improve our services."
        }
      ]
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: Users,
      content: [
        {
          subtitle: "Service Provision",
          text: "To provide, maintain, and improve our training platform and AI-powered features."
        },
        {
          subtitle: "Communication",
          text: "To send you important updates, security alerts, and support messages."
        },
        {
          subtitle: "Analytics",
          text: "To analyze usage patterns and improve our platform's effectiveness and user experience."
        },
        {
          subtitle: "Legal Compliance",
          text: "To comply with legal obligations and protect our rights and the rights of our users."
        }
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: Globe,
      content: [
        {
          subtitle: "Service Providers",
          text: "We share data with trusted third-party service providers who help us operate our platform, including cloud hosting, payment processing, and analytics."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information when required by law, court order, or to protect our rights and safety."
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the transaction."
        },
        {
          subtitle: "No Sale of Personal Data",
          text: "We do not sell, rent, or trade your personal information to third parties for marketing purposes."
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: [
        {
          subtitle: "Encryption",
          text: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption."
        },
        {
          subtitle: "Access Controls",
          text: "We implement strict access controls and multi-factor authentication for all system access."
        },
        {
          subtitle: "Regular Audits",
          text: "Our security practices are regularly audited and we maintain SOC 2 Type II certification."
        },
        {
          subtitle: "Data Backup",
          text: "Regular backups are performed with the same security standards as production data."
        }
      ]
    },
    {
      id: "user-rights",
      title: "Your Rights",
      icon: Eye,
      content: [
        {
          subtitle: "Access",
          text: "You can request access to the personal information we hold about you."
        },
        {
          subtitle: "Correction",
          text: "You can request correction of inaccurate or incomplete personal information."
        },
        {
          subtitle: "Deletion",
          text: "You can request deletion of your personal information, subject to legal and contractual obligations."
        },
        {
          subtitle: "Portability",
          text: "You can request a copy of your data in a structured, machine-readable format."
        },
        {
          subtitle: "Opt-out",
          text: "You can opt out of non-essential communications and certain data processing activities."
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
              <Shield className="h-4 w-4" />
              <span>Your Privacy Matters</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Privacy 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Policy
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We're committed to protecting your privacy and being transparent about how we collect, use, and protect your information.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Privacy</h2>
            <p className="text-gray-700 mb-4">
              At Tutora, we understand that your privacy is fundamental to your trust in our platform. This Privacy Policy explains how we collect, use, protect, and share information about you when you use our AI-powered training platform.
            </p>
            <p className="text-gray-700">
              This policy applies to all users of our platform, including administrators, managers, and learners within your organization.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
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

      {/* GDPR & CCPA Compliance */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Global Privacy 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Compliance</span>
            </h2>
            <p className="text-lg text-gray-600">
              We comply with major privacy regulations worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">GDPR Compliance</h3>
              <p className="text-gray-700 mb-4">
                For users in the European Union, we comply with the General Data Protection Regulation (GDPR), including:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Lawful basis for processing personal data</li>
                <li>• Right to access, rectify, and erase data</li>
                <li>• Data portability and right to object</li>
                <li>• Privacy by design and default</li>
                <li>• Data Protection Impact Assessments</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">CCPA Compliance</h3>
              <p className="text-gray-700 mb-4">
                For California residents, we comply with the California Consumer Privacy Act (CCPA), including:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Right to know what personal information is collected</li>
                <li>• Right to delete personal information</li>
                <li>• Right to opt-out of sale of personal information</li>
                <li>• Right to non-discrimination</li>
                <li>• Transparent privacy practices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Data Retention */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Retention</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Data</h3>
                <p className="text-gray-700">We retain account information for as long as your account is active or as needed to provide services.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Training Content</h3>
                <p className="text-gray-700">Training materials and generated modules are retained according to your subscription plan and data retention settings.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Analytics</h3>
                <p className="text-gray-700">Aggregated and anonymized usage data may be retained for longer periods to improve our services.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                <p className="text-gray-700">Some data may be retained longer to comply with legal obligations, resolve disputes, or enforce agreements.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Questions About 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Privacy?</span>
            </h2>
            <p className="text-lg text-gray-600">
              We're here to help you understand how we protect your information.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Our Privacy Team</h3>
            <p className="text-gray-700 mb-6">
              If you have questions about this Privacy Policy or want to exercise your privacy rights, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> privacy@tutoralearn.com</p>
              <p><strong>Address:</strong> Tutora Privacy Team, San Francisco, CA</p>
              <p><strong>Response Time:</strong> We respond to privacy inquiries within 30 days</p>
            </div>
            <div className="mt-8">
              <a 
                href="/contact"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold transform hover:scale-105"
              >
                Contact Privacy Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Updates */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we make significant changes, we will:
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>• Notify you via email (if you have an account)</li>
              <li>• Post a notice on our platform</li>
              <li>• Update the "Last updated" date at the top of this policy</li>
            </ul>
            <p className="text-gray-700">
              Your continued use of our platform after any changes indicates your acceptance of the updated Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
