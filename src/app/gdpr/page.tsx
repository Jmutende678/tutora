'use client'

import { Navigation } from '@/components/Navigation'
import Link from 'next/link'
import { Shield, FileText, Eye, Trash2, Download, Edit, AlertTriangle, Mail } from 'lucide-react'

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span>Data Protection Rights</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              GDPR & Your Data Rights
            </h1>
            <p className="text-xl text-gray-600">
              Under the General Data Protection Regulation (GDPR), you have specific rights regarding your personal data. Learn about these rights and how to exercise them.
            </p>
          </div>

          {/* GDPR Compliance Statement */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our GDPR Commitment</h2>
            <p className="text-gray-700 mb-4">
              Tutora is committed to protecting your privacy and ensuring compliance with the General Data Protection Regulation (GDPR). 
              We process personal data lawfully, fairly, and transparently, and only for specified, explicit, and legitimate purposes.
            </p>
            <p className="text-gray-700">
              While Tutora operates from Australia, we respect and comply with GDPR requirements when processing personal data of EU residents.
            </p>
          </div>

          {/* Your Rights */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your Data Protection Rights</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Eye className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Right to Access</h3>
                    <p className="text-gray-700">You can request a copy of the personal data we hold about you, including how we use it and who we share it with.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Edit className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Right to Rectification</h3>
                    <p className="text-gray-700">You can ask us to correct or update any inaccurate or incomplete personal data we hold about you.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Trash2 className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Right to Erasure</h3>
                    <p className="text-gray-700">Also known as the "right to be forgotten," you can request that we delete your personal data in certain circumstances.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Right to Restrict Processing</h3>
                    <p className="text-gray-700">You can ask us to limit how we use your personal data in certain situations, such as when you contest its accuracy.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Download className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Right to Data Portability</h3>
                    <p className="text-gray-700">You can request to receive your personal data in a structured, commonly used format and transfer it to another service.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Right to Object</h3>
                    <p className="text-gray-700">You can object to our processing of your personal data for direct marketing purposes or other legitimate interests.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FileText className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Right to Withdraw Consent</h3>
                    <p className="text-gray-700">Where we process your data based on consent, you can withdraw that consent at any time.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Right to Complain</h3>
                    <p className="text-gray-700">You have the right to lodge a complaint with a supervisory authority if you believe we've mishandled your data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How to Exercise Your Rights */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Exercise Your Rights</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">
                To exercise any of your GDPR rights, please contact our Data Protection team using the details below. 
                We will respond to your request within one month, though this may be extended by two additional months for complex requests.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Our Data Protection Team</h3>
                <div className="space-y-2">
                  <p><strong>Email:</strong> <a href="mailto:privacy@tutoralearn.com?subject=GDPR Data Request" className="text-blue-600 hover:underline">privacy@tutoralearn.com</a></p>
                  <p><strong>Subject Line:</strong> "GDPR Data Request - [Your Name]"</p>
                  <p><strong>Response Time:</strong> Within 30 days (may be extended for complex requests)</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">What to Include in Your Request</h3>
              <ul className="text-gray-700 space-y-2 mb-6">
                <li>• Your full name and email address associated with your Tutora account</li>
                <li>• Specific details about which right you want to exercise</li>
                <li>• Any additional information that would help us locate your data</li>
                <li>• Proof of identity (for security purposes)</li>
              </ul>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Important Notes
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• We may need to verify your identity before processing your request</li>
                  <li>• Some rights may not apply in all circumstances (we'll explain if this is the case)</li>
                  <li>• We don't charge fees for most requests, unless they are excessive or repetitive</li>
                  <li>• We'll keep you informed about the progress of your request</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Legal Basis for Processing */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Legal Basis for Processing Your Data</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contract Performance</h3>
                <p className="text-gray-700">We process your data to provide our training services and fulfill our contractual obligations to you.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Legitimate Interests</h3>
                <p className="text-gray-700">We may process data for legitimate business purposes, such as improving our services and preventing fraud.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Compliance</h3>
                <p className="text-gray-700">We process data to comply with legal obligations, such as tax requirements and data protection laws.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Consent</h3>
                <p className="text-gray-700">For certain activities like marketing communications, we rely on your explicit consent.</p>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Last updated: September 15, 2025</p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
              <Link href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</Link>
              <Link href="/security" className="text-blue-600 hover:underline">Security</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}