'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Shield, Lock, Eye, FileText, CheckCircle, Clock, Download } from 'lucide-react'

export default function TrustCenter() {
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    company: '',
    requestType: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestForm,
          type: 'security_documentation',
          subject: `Security Documentation Request: ${requestForm.requestType}`,
          message: `Security documentation request from ${requestForm.name} at ${requestForm.company}. Request type: ${requestForm.requestType}`
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        throw new Error('Failed to submit request')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('There was an error submitting your request. Please try again or email security@tutoralearn.com directly.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRequestForm({
      ...requestForm,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Security & Trust Center</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tutora is committed to maintaining the highest standards of security, privacy, and compliance 
              to protect your data and ensure your trust.
            </p>
          </div>

          {/* Security Overview */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Encryption</h3>
              <p className="text-gray-600">
                All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. 
                Your sensitive information is protected at all times.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy by Design</h3>
              <p className="text-gray-600">
                We follow privacy-by-design principles, collecting only necessary data and giving you 
                full control over your information.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compliance Ready</h3>
              <p className="text-gray-600">
                Built to support GDPR, CCPA, and other privacy regulations with comprehensive 
                data management and user rights tools.
              </p>
            </div>
          </div>

          {/* Compliance Status */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Compliance & Certifications</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* SOC 2 */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">SOC 2 Type II</h3>
                  <div className="flex items-center text-yellow-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">In Progress</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  We are currently undergoing SOC 2 Type II audit with a leading third-party auditor. 
                  Expected completion: Q2 2025.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Status:</strong> Audit in progress. Pre-audit assessment completed with positive results.
                  </p>
                </div>
              </div>

              {/* ISO 27001 */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">ISO 27001</h3>
                  <div className="flex items-center text-blue-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Planned</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  ISO 27001 certification is planned following SOC 2 completion. 
                  Expected timeline: Q3 2025.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Status:</strong> Information Security Management System (ISMS) framework being implemented.
                  </p>
                </div>
              </div>

              {/* GDPR */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">GDPR Compliance</h3>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Compliant</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Fully compliant with GDPR requirements including data portability, 
                  right to deletion, and consent management.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Status:</strong> Active compliance with regular privacy impact assessments.
                  </p>
                </div>
              </div>

              {/* CCPA */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">CCPA Compliance</h3>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Compliant</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Compliant with California Consumer Privacy Act including consumer rights 
                  and data transparency requirements.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Status:</strong> Active compliance with consumer request handling procedures.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Measures */}
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-white mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Security Measures</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Infrastructure Security</h3>
                <p className="text-sm text-gray-300">Cloud infrastructure with enterprise-grade security controls</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Access Controls</h3>
                <p className="text-sm text-gray-300">Multi-factor authentication and role-based access</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Monitoring</h3>
                <p className="text-sm text-gray-300">24/7 security monitoring and incident response</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Regular Audits</h3>
                <p className="text-sm text-gray-300">Quarterly security assessments and penetration testing</p>
              </div>
            </div>
          </div>

          {/* Documentation Request */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Request Security Documentation</h2>
            
            {isSubmitted ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Request Submitted</h3>
                <p className="text-gray-600">
                  We've received your request for security documentation. Our security team will review 
                  and respond within 2 business days.
                </p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <p className="text-gray-600 mb-8 text-center">
                  Request access to our security documentation, audit reports, and compliance certificates. 
                  Available to qualified prospects and customers under NDA.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={requestForm.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={requestForm.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={requestForm.company}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-2">
                      Documentation Type *
                    </label>
                    <select
                      id="requestType"
                      name="requestType"
                      required
                      value={requestForm.requestType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select documentation type...</option>
                      <option value="soc2_status">SOC 2 Audit Status Report</option>
                      <option value="security_overview">Security Overview & Controls</option>
                      <option value="compliance_summary">Compliance Summary</option>
                      <option value="penetration_test">Penetration Test Summary</option>
                      <option value="data_processing">Data Processing Agreement</option>
                      <option value="all_documentation">All Available Documentation</option>
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isLoading ? 'Submitting Request...' : 'Request Documentation'}
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Documentation is provided under mutual NDA. Processing time: 2-3 business days.
                  </p>
                </form>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="mt-16 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Security Questions?</h2>
            <p className="text-gray-600 mb-4">
              Our security team is here to help with any questions about our security practices.
            </p>
            <div className="space-y-2">
              <p>
                <strong>Security Team:</strong>{' '}
                <a href="mailto:security@tutoralearn.com" className="text-blue-600 hover:underline">
                  security@tutoralearn.com
                </a>
              </p>
              <p>
                <strong>Privacy Officer:</strong>{' '}
                <a href="mailto:privacy@tutoralearn.com" className="text-blue-600 hover:underline">
                  privacy@tutoralearn.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
