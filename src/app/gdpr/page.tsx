'use client'

import React from 'react'
import Navigation from '@/components/Navigation'
import { Shield, Eye, Download, Trash2, Edit, CheckCircle } from 'lucide-react'

export default function GDPRPage() {
  const rights = [
    {
      icon: Eye,
      title: "Right to Access",
      description: "Request access to your personal data we hold",
      action: "Request your data export within 30 days"
    },
    {
      icon: Edit,
      title: "Right to Rectification",
      description: "Correct inaccurate or incomplete personal data",
      action: "Update your information in account settings"
    },
    {
      icon: Trash2,
      title: "Right to Erasure",
      description: "Request deletion of your personal data",
      action: "Contact us to delete your account and data"
    },
    {
      icon: Download,
      title: "Right to Data Portability",
      description: "Receive your data in a structured format",
      action: "Export your data to use with other services"
    }
  ]

  const legalBases = [
    {
      basis: "Consent",
      description: "Marketing communications and optional features",
      example: "Newsletter subscriptions, product updates"
    },
    {
      basis: "Contract",
      description: "Providing our training platform services",
      example: "Account creation, service delivery, billing"
    },
    {
      basis: "Legitimate Interest",
      description: "Platform improvement and security",
      example: "Analytics, fraud prevention, system optimization"
    },
    {
      basis: "Legal Obligation",
      description: "Compliance with applicable laws",
      example: "Tax records, audit requirements, legal requests"
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
              <span>EU Data Protection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              GDPR 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Compliance
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We're committed to protecting your privacy rights under the General Data Protection Regulation (GDPR).
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights Under GDPR</h2>
            <p className="text-gray-700 mb-4">
              The General Data Protection Regulation (GDPR) gives individuals in the European Union specific rights regarding their personal data. At Tutora, we respect these rights and have implemented processes to ensure compliance.
            </p>
            <p className="text-gray-700">
              This page explains your GDPR rights and how to exercise them when using our AI-powered training platform.
            </p>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Data 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Rights</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Under GDPR, you have several rights regarding your personal data. Here's how to exercise them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {rights.map((right, index) => (
              <div key={index} className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <right.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{right.title}</h3>
                <p className="text-gray-600 mb-4">{right.description}</p>
                <p className="text-sm text-blue-600 font-semibold">{right.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Bases */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Legal Bases for 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Processing</span>
            </h2>
            <p className="text-lg text-gray-600">
              We process your personal data based on the following legal grounds under GDPR.
            </p>
          </div>

          <div className="space-y-6">
            {legalBases.map((basis, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mt-1">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{basis.basis}</h3>
                    <p className="text-gray-700 mb-2">{basis.description}</p>
                    <p className="text-sm text-gray-600"><strong>Examples:</strong> {basis.example}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Processing */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We Process 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Your Data</span>
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data We Collect</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Account Information</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Name and email address</li>
                    <li>• Company information</li>
                    <li>• Billing details</li>
                    <li>• Account preferences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Usage Data</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Training module interactions</li>
                    <li>• Learning progress</li>
                    <li>• Platform usage analytics</li>
                    <li>• Technical logs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data Retention</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Active Accounts</h4>
                  <p className="text-gray-700">Data is retained while your account is active and for legitimate business purposes.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Closed Accounts</h4>
                  <p className="text-gray-700">Personal data is deleted within 30 days of account closure, except where legal obligations require longer retention.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                  <p className="text-gray-700">Some data may be retained longer to comply with legal, tax, or regulatory requirements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exercise Your Rights */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Exercise Your 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Rights</span>
            </h2>
            <p className="text-lg text-gray-600">
              Ready to exercise your GDPR rights? Here's how to get started.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Our DPO</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Data Protection Officer</h4>
                    <p className="text-gray-700">dpo@tutoralearn.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Privacy Team</h4>
                    <p className="text-gray-700">privacy@tutoralearn.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Response Time</h4>
                    <p className="text-gray-700">We respond to GDPR requests within 30 days</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">What to Include</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Identity Verification</h4>
                    <p className="text-gray-700">Email from your registered account or provide identification</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Specific Request</h4>
                    <p className="text-gray-700">Clearly state which right you want to exercise</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Additional Details</h4>
                    <p className="text-gray-700">Any specific information or time periods relevant to your request</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a 
                href="mailto:dpo@tutoralearn.com"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold transform hover:scale-105 inline-block"
              >
                Contact Data Protection Officer
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Supervisory Authority */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Right to Lodge a Complaint</h2>
            <p className="text-gray-700 mb-4">
              If you're not satisfied with how we handle your personal data or GDPR request, you have the right to lodge a complaint with a supervisory authority.
            </p>
            <p className="text-gray-700">
              You can contact your local data protection authority or the Irish Data Protection Commission (our lead supervisory authority in the EU) at <strong>info@dataprotection.ie</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
