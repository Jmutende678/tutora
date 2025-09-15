'use client'

import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { Shield, Eye, Lock, Users, AlertTriangle, FileText, Mail, Calendar } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-blue-100 mb-6">
              Your privacy is important to us. Learn how we collect, use, and protect your data.
            </p>
            <div className="flex items-center justify-center text-blue-200">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Last updated: January 8, 2025</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Quick Navigation */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="#information-collection" className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                <FileText className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700 hover:text-blue-600">Information We Collect</span>
              </Link>
              <Link href="#data-usage" className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                <Eye className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700 hover:text-blue-600">How We Use Data</span>
              </Link>
              <Link href="#data-protection" className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                <Lock className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700 hover:text-blue-600">Data Protection</span>
              </Link>
              <Link href="#your-rights" className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                <Users className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700 hover:text-blue-600">Your Rights</span>
              </Link>
            </div>
          </div>

          {/* Content Sections */}
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 mb-4">
                Tutora ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our learning management platform and related services.
              </p>
              <p className="text-gray-700">
                By using Tutora, you agree to the collection and use of information in accordance with this policy. 
                If you do not agree with our policies and practices, do not use our services.
              </p>
            </section>

            {/* Information Collection */}
            <section id="information-collection" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Personal Information</h3>
                <ul className="list-disc list-inside text-blue-800 space-y-2">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials and authentication data</li>
                  <li>Profile information and preferences</li>
                  <li>Company or organization details</li>
                  <li>Payment and billing information</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Learning Data</h3>
                <ul className="list-disc list-inside text-green-800 space-y-2">
                  <li>Course progress and completion status</li>
                  <li>Quiz and assessment results</li>
                  <li>Learning preferences and behavior</li>
                  <li>Time spent on activities</li>
                  <li>Content interactions and engagement metrics</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Technical Information</h3>
                <ul className="list-disc list-inside text-purple-800 space-y-2">
                  <li>Device information (type, operating system, browser)</li>
                  <li>IP address and location data</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Usage logs and analytics data</li>
                  <li>Error reports and performance data</li>
                </ul>
              </div>
            </section>

            {/* Data Usage */}
            <section id="data-usage" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Data</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Delivery</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Provide and maintain our platform</li>
                    <li>• Process transactions and payments</li>
                    <li>• Deliver personalized learning experiences</li>
                    <li>• Generate progress reports and analytics</li>
                  </ul>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Send important service notifications</li>
                    <li>• Respond to support requests</li>
                    <li>• Share product updates and features</li>
                    <li>• Deliver educational content and reminders</li>
                  </ul>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Improvement</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Analyze usage patterns and trends</li>
                    <li>• Improve platform performance</li>
                    <li>• Develop new features and content</li>
                    <li>• Enhance user experience and interface</li>
                  </ul>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Compliance</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Comply with legal obligations</li>
                    <li>• Protect against fraud and abuse</li>
                    <li>• Enforce our terms of service</li>
                    <li>• Respond to legal requests</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Protection */}
            <section id="data-protection" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Protection & Security</h2>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-8 mb-6">
                <div className="flex items-center mb-4">
                  <Lock className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Security Measures</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Technical Safeguards</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• End-to-end encryption in transit and at rest</li>
                      <li>• Multi-factor authentication support</li>
                      <li>• Regular security audits and penetration testing</li>
                      <li>• Secure cloud infrastructure (AWS/Google Cloud)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Operational Controls</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Employee background checks and training</li>
                      <li>• Access controls and principle of least privilege</li>
                      <li>• Incident response and data breach procedures</li>
                      <li>• Regular backup and disaster recovery testing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">Data Retention</h3>
                    <p className="text-yellow-800 mb-3">
                      We retain your personal information only as long as necessary to provide our services and comply with legal obligations.
                    </p>
                    <ul className="text-yellow-800 space-y-1 text-sm">
                      <li>• Account data: Retained while your account is active</li>
                      <li>• Learning records: Retained for 7 years after account closure</li>
                      <li>• Payment data: Retained per financial regulations (7 years)</li>
                      <li>• Analytics data: Anonymized after 2 years</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section id="your-rights" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Privacy Rights</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <p className="text-gray-700 mb-6">
                  Under applicable privacy laws (including GDPR and CCPA), you have the following rights:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-xs font-semibold text-blue-600">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Right to Access</h4>
                        <p className="text-sm text-gray-600">Request copies of your personal data</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-xs font-semibold text-blue-600">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Right to Rectification</h4>
                        <p className="text-sm text-gray-600">Correct inaccurate or incomplete data</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-xs font-semibold text-blue-600">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Right to Erasure</h4>
                        <p className="text-sm text-gray-600">Request deletion of your personal data</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-xs font-semibold text-blue-600">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Right to Restrict Processing</h4>
                        <p className="text-sm text-gray-600">Limit how we process your data</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-xs font-semibold text-blue-600">5</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Right to Data Portability</h4>
                        <p className="text-sm text-gray-600">Receive your data in a portable format</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-xs font-semibold text-blue-600">6</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Right to Object</h4>
                        <p className="text-sm text-gray-600">Object to certain types of processing</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-xs font-semibold text-blue-600">7</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Right to Withdraw Consent</h4>
                        <p className="text-sm text-gray-600">Withdraw consent at any time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-xs font-semibold text-blue-600">8</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Right to Lodge Complaints</h4>
                        <p className="text-sm text-gray-600">File complaints with supervisory authorities</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Inquiries</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-gray-700">privacy@tutora.com</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-3" />
                        <Link href="/contact" className="text-blue-600 hover:text-blue-800">Data Protection Officer</Link>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time</h3>
                    <p className="text-gray-700 text-sm mb-2">We aim to respond to privacy requests within:</p>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• General inquiries: 48 hours</li>
                      <li>• Data requests: 30 days (as required by law)</li>
                      <li>• Urgent matters: 24 hours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date at the top of this policy.
              </p>
              <p className="text-gray-700">
                For significant changes, we will provide more prominent notice (including, for certain services, 
                email notification of privacy policy changes).
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 