'use client'

import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { FileText, Shield, AlertTriangle, Users, CreditCard, Settings, Mail, Calendar } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-purple-100 mb-6">
              The legal terms that govern your use of Tutora's learning platform and services.
            </p>
            <div className="flex items-center justify-center text-purple-200">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="#acceptance" className="flex items-center p-3 bg-white rounded-lg hover:bg-purple-50 transition-colors">
                <Shield className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-gray-700 hover:text-purple-600">Acceptance of Terms</span>
              </Link>
              <Link href="#services" className="flex items-center p-3 bg-white rounded-lg hover:bg-purple-50 transition-colors">
                <Settings className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-gray-700 hover:text-purple-600">Services Description</span>
              </Link>
              <Link href="#user-accounts" className="flex items-center p-3 bg-white rounded-lg hover:bg-purple-50 transition-colors">
                <Users className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-gray-700 hover:text-purple-600">User Accounts</span>
              </Link>
              <Link href="#payment-terms" className="flex items-center p-3 bg-white rounded-lg hover:bg-purple-50 transition-colors">
                <CreditCard className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-gray-700 hover:text-purple-600">Payment Terms</span>
              </Link>
              <Link href="#prohibited-uses" className="flex items-center p-3 bg-white rounded-lg hover:bg-purple-50 transition-colors">
                <AlertTriangle className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-gray-700 hover:text-purple-600">Prohibited Uses</span>
              </Link>
              <Link href="#termination" className="flex items-center p-3 bg-white rounded-lg hover:bg-purple-50 transition-colors">
                <FileText className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-gray-700 hover:text-purple-600">Termination</span>
              </Link>
            </div>
          </div>

          {/* Content Sections */}
          <div className="prose prose-lg max-w-none">
            {/* Acceptance of Terms */}
            <section id="acceptance" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  By accessing and using Tutora ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
                </p>
                <p className="text-gray-700">
                  If you do not agree to abide by the above, please do not use this service. These Terms of Service ("Terms") 
                  constitute a legal agreement between you and Tutora Inc. ("Company," "we," "us," or "our").
                </p>
              </div>
            </section>

            {/* Services Description */}
            <section id="services" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Services Description</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Features</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Learning Management System (LMS)</li>
                    <li>• AI-powered content creation tools</li>
                    <li>• Interactive training modules</li>
                    <li>• Progress tracking and analytics</li>
                    <li>• Mobile and web applications</li>
                  </ul>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Levels</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Free tier with basic features</li>
                    <li>• Professional plans for businesses</li>
                    <li>• Enterprise solutions</li>
                    <li>• Custom integrations and support</li>
                    <li>• 24/7 technical assistance</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">Service Availability</h3>
                <p className="text-yellow-800 mb-2">
                  We strive to maintain 99.9% uptime for our services. However, we reserve the right to:
                </p>
                <ul className="text-yellow-800 space-y-1">
                  <li>• Perform scheduled maintenance with advance notice</li>
                  <li>• Make emergency updates to ensure security and stability</li>
                  <li>• Temporarily suspend services to prevent abuse or security threats</li>
                </ul>
              </div>
            </section>

            {/* User Accounts */}
            <section id="user-accounts" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">3. User Accounts and Responsibilities</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Account Registration</h3>
                  <p className="text-green-800 mb-3">
                    To access certain features of our service, you must register for an account. You agree to:
                  </p>
                  <ul className="text-green-800 space-y-1">
                    <li>• Provide accurate, current, and complete information</li>
                    <li>• Maintain and update your account information</li>
                    <li>• Keep your password secure and confidential</li>
                    <li>• Accept responsibility for all activities under your account</li>
                    <li>• Notify us immediately of any unauthorized use</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">User Conduct</h3>
                  <p className="text-purple-800 mb-3">
                    You agree to use the service in a lawful and respectful manner. You will not:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="text-purple-800 space-y-1 text-sm">
                      <li>• Violate any applicable laws or regulations</li>
                      <li>• Infringe on intellectual property rights</li>
                      <li>• Upload malicious code or viruses</li>
                      <li>• Attempt to gain unauthorized access</li>
                    </ul>
                    <ul className="text-purple-800 space-y-1 text-sm">
                      <li>• Harass or abuse other users</li>
                      <li>• Share inappropriate or offensive content</li>
                      <li>• Reverse engineer our software</li>
                      <li>• Use the service for commercial purposes without permission</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section id="payment-terms" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Payment Terms and Billing</h2>
              
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Subscription Plans</h3>
                    <ul className="text-blue-800 space-y-2 text-sm">
                      <li>• Monthly and annual billing options available</li>
                      <li>• Automatic renewal unless cancelled</li>
                      <li>• Price changes with 30 days notice</li>
                      <li>• Prorated charges for plan upgrades</li>
                      <li>• Free trial periods where applicable</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">Payment Processing</h3>
                    <ul className="text-green-800 space-y-2 text-sm">
                      <li>• Secure payment processing via Stripe</li>
                      <li>• Major credit cards and bank transfers accepted</li>
                      <li>• Invoice billing for enterprise customers</li>
                      <li>• Automatic retry for failed payments</li>
                      <li>• Receipts provided for all transactions</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-900 mb-3">Refund Policy</h3>
                    <ul className="text-red-800 space-y-2 text-sm">
                      <li>• 30-day money-back guarantee for new subscriptions</li>
                      <li>• Prorated refunds for service disruptions</li>
                      <li>• No refunds for partial month usage</li>
                      <li>• Custom plans subject to separate terms</li>
                      <li>• Refund requests processed within 5-10 business days</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-3">Late Payments</h3>
                    <ul className="text-yellow-800 space-y-2 text-sm">
                      <li>• 7-day grace period for failed payments</li>
                      <li>• Account suspension after grace period</li>
                      <li>• Data retention for 30 days post-suspension</li>
                      <li>• Service restoration upon payment</li>
                      <li>• Late fees may apply for enterprise accounts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Prohibited Uses */}
            <section id="prohibited-uses" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Prohibited Uses</h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                <div className="flex items-start mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 mr-3 mt-1" />
                  <h3 className="text-lg font-semibold text-red-900">Strictly Prohibited Activities</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">Security Violations</h4>
                    <ul className="text-red-800 space-y-1 text-sm">
                      <li>• Unauthorized access to systems or data</li>
                      <li>• Circumventing security measures</li>
                      <li>• Distributing malware or viruses</li>
                      <li>• Network scanning or penetration testing</li>
                      <li>• Data mining or scraping without permission</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">Content Violations</h4>
                    <ul className="text-red-800 space-y-1 text-sm">
                      <li>• Uploading illegal or copyrighted content</li>
                      <li>• Sharing harmful or offensive material</li>
                      <li>• Creating fake or misleading content</li>
                      <li>• Spamming or unsolicited communications</li>
                      <li>• Impersonating others or organizations</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">Commercial Misuse</h4>
                    <ul className="text-red-800 space-y-1 text-sm">
                      <li>• Reselling or redistributing our services</li>
                      <li>• Creating competing products using our platform</li>
                      <li>• Automated account creation or management</li>
                      <li>• Bulk downloading or data extraction</li>
                      <li>• Using free accounts for commercial purposes</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">System Abuse</h4>
                    <ul className="text-red-800 space-y-1 text-sm">
                      <li>• Excessive API calls or resource consumption</li>
                      <li>• Attempting to overload or crash systems</li>
                      <li>• Creating multiple accounts to bypass limits</li>
                      <li>• Interfering with other users' access</li>
                      <li>• Reverse engineering proprietary algorithms</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-red-100 rounded-lg">
                  <p className="text-red-900 font-semibold text-sm">
                    Violation of these terms may result in immediate account suspension, legal action, and 
                    cooperation with law enforcement authorities.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Intellectual Property Rights</h2>
              
              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Our Content</h3>
                  <p className="text-purple-800 mb-3">
                    All content, features, and functionality of Tutora, including but not limited to software, text, displays, 
                    images, video, audio, design, selection, and arrangement, are owned by us, our licensors, or other providers.
                  </p>
                  <p className="text-purple-800 text-sm">
                    This content is protected by copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Your Content</h3>
                  <p className="text-blue-800 mb-3">
                    You retain ownership of content you upload to our platform. By uploading content, you grant us a 
                    non-exclusive, worldwide, royalty-free license to use, store, and process your content to provide our services.
                  </p>
                  <p className="text-blue-800 text-sm">
                    You represent that you own or have permission to use all content you upload and that it doesn't violate any third-party rights.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section id="termination" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Termination</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">By You</h3>
                  <ul className="text-orange-800 space-y-2 text-sm">
                    <li>• Cancel your subscription at any time</li>
                    <li>• Download your data before account deletion</li>
                    <li>• 30-day data retention after cancellation</li>
                    <li>• No penalty fees for early termination</li>
                    <li>• Prorated refunds where applicable</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">By Us</h3>
                  <ul className="text-red-800 space-y-2 text-sm">
                    <li>• Immediate termination for terms violations</li>
                    <li>• 30-day notice for service discontinuation</li>
                    <li>• Suspension for non-payment or abuse</li>
                    <li>• Data export assistance during transition</li>
                    <li>• Appeal process for disputed terminations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Disclaimers and Limitations */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Disclaimers and Limitations of Liability</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Disclaimer</h3>
                    <p className="text-gray-700 text-sm">
                      Our services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, 
                      including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Limitation of Liability</h3>
                    <p className="text-gray-700 text-sm">
                      In no event shall Tutora be liable for any indirect, incidental, special, consequential, or punitive damages, 
                      including but not limited to loss of profits, data, use, or other intangible losses, resulting from your use of our services.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Contact Information</h2>
              
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Inquiries</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-purple-600 mr-3" />
                        <span className="text-gray-700">legal@tutora.com</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-purple-600 mr-3" />
                        <Link href="/contact" className="text-purple-600 hover:text-purple-800">Legal Department</Link>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">General Support</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-purple-600 mr-3" />
                        <span className="text-gray-700">support@tutora.com</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-purple-600 mr-3" />
                        <Link href="/support" className="text-purple-600 hover:text-purple-800">Help Center</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 