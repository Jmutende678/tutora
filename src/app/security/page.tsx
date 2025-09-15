'use client'

import { Navigation } from '@/components/Navigation'
import Link from 'next/link'
import { Shield, Lock, FileText, Clock, Users, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4" />
            <span>Enterprise Security</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Security & Compliance
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Your data security is our top priority. Learn about our comprehensive security measures and compliance standards.
          </p>

          {/* Security Standards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">SOC 2 Type II</h2>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-orange-600 font-medium">In Progress (Expected Q4 2025)</span>
              </div>
              <p className="text-gray-700 mb-6">
                We are actively working towards SOC 2 Type II certification, demonstrating our commitment to managing customer data based on the five trust service principles: security, availability, processing integrity, confidentiality, and privacy.
              </p>
              <Link href="/trust" className="inline-flex items-center text-blue-600 hover:underline font-medium">
                View Trust Center <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">ISO 27001</h2>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-orange-600 font-medium">In Progress (Expected Q1 2026)</span>
              </div>
              <p className="text-gray-700 mb-6">
                Tutora is implementing an Information Security Management System (ISMS) aligned with ISO 27001 standards to ensure a systematic approach to managing sensitive company information.
              </p>
              <Link href="/contact?subject=Security_Inquiry" className="inline-flex items-center text-purple-600 hover:underline font-medium">
                Security Inquiry <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Security Measures */}
          <div className="bg-white shadow-xl rounded-2xl p-10 border border-gray-200 text-left mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Security Measures</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Data Encryption</h3>
                </div>
                <p className="text-gray-700">
                  All data is encrypted at rest using AES-256 encryption and in transit using TLS 1.3. Your sensitive information is protected at every level.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Access Control</h3>
                </div>
                <p className="text-gray-700">
                  Strict role-based access controls, multi-factor authentication, and regular access reviews ensure only authorized personnel can access systems.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Infrastructure Security</h3>
                </div>
                <p className="text-gray-700">
                  Our infrastructure is hosted on enterprise-grade cloud platforms with 99.5% uptime SLA and automatic backups.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Regular Audits</h3>
                </div>
                <p className="text-gray-700">
                  We conduct regular security audits and engage third-party experts for penetration testing to identify and remediate vulnerabilities.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Incident Response</h3>
                </div>
                <p className="text-gray-700">
                  Our dedicated incident response team is available 24/7 to address any security events swiftly and effectively.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Employee Training</h3>
                </div>
                <p className="text-gray-700">
                  All Tutora employees undergo regular security awareness training and follow strict data handling procedures.
                </p>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-white shadow-xl rounded-2xl p-10 border border-gray-200 text-left mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Data Protection & Privacy</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" /> GDPR Compliance
                </h3>
                <p className="text-gray-700 mb-4">
                  We comply with GDPR requirements for data protection and privacy, giving you control over your personal information.
                </p>
                <Link href="/privacy" className="text-blue-600 hover:underline">View Privacy Policy →</Link>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" /> Data Minimization
                </h3>
                <p className="text-gray-700 mb-4">
                  We only collect and process data that is necessary for providing our services, following the principle of data minimization.
                </p>
                <Link href="/gdpr" className="text-blue-600 hover:underline">GDPR Rights →</Link>
              </div>
            </div>
          </div>

          {/* Contact Security Team */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Questions?</h2>
            <p className="text-gray-700 mb-6">
              Our security team is here to answer any questions about our security practices and compliance standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="mailto:security@tutoralearn.com?subject=Security Inquiry"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Email Security Team
              </Link>
              <Link 
                href="/trust"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Visit Trust Center
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Last updated: September 15, 2025</p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-700">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-gray-700">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}