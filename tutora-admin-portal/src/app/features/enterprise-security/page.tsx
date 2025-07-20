'use client'

import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Shield, 
  Lock, 
  Key, 
  FileCheck, 
  CheckCircle, 
  ArrowRight, 
  Globe,
  Database,
  UserCheck,
  AlertTriangle
} from 'lucide-react'

export default function EnterpriseSecurityPage() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "SOC 2 Type II Certified",
      description: "Independently audited security controls ensuring the highest standards for data protection."
    },
    {
      icon: Globe,
      title: "GDPR Compliant", 
      description: "Full compliance with European data protection regulations for global peace of mind."
    },
    {
      icon: Lock,
      title: "256-bit Encryption",
      description: "Bank-grade encryption for all data in transit and at rest, protecting your sensitive information."
    },
    {
      icon: Key,
      title: "SSO Integration",
      description: "Seamless integration with your existing identity providers including Active Directory, Okta, and more."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Enterprise-Grade <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Security</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Trust your training data to a platform built with enterprise security from the ground up. SOC 2 certified, GDPR compliant, and designed for the most security-conscious organizations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/register"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Get Security Details</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link 
                    href="/support"
                    className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Security Audit</span>
                  </Link>
                </div>
              </div>
              <div className="relative">
                {/* Security Badges */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
                    <Image
                      src="/assets/images/SOC-2-Type-2.png"
                      alt="SOC 2 Type II Certified"
                      width={120}
                      height={120}
                      className="mx-auto mb-4"
                    />
                    <h3 className="font-semibold text-gray-900">SOC 2 Type II</h3>
                    <p className="text-sm text-gray-600">Certified</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
                    <Image
                      src="/assets/images/GDPR-compliant_logo@2x.png.webp"
                      alt="GDPR Compliant"
                      width={120}
                      height={120}
                      className="mx-auto mb-4"
                    />
                    <h3 className="font-semibold text-gray-900">GDPR</h3>
                    <p className="text-sm text-gray-600">Compliant</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-xl text-center col-span-2">
                    <Image
                      src="/assets/images/99 PERCENT SLA .png"
                      alt="99.9% SLA Uptime"
                      width={120}
                      height={60}
                      className="mx-auto mb-4"
                    />
                    <h3 className="font-semibold text-gray-900">99.9% Uptime SLA</h3>
                    <p className="text-sm text-gray-600">Guaranteed Availability</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Bank-Grade Security Standards</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Your data deserves the highest level of protection. We've implemented enterprise-grade security measures to keep your training content and user data safe.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Details */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <Database className="h-12 w-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Data Protection</h3>
                <p className="text-gray-600 mb-4">
                  Your data is encrypted at rest and in transit using AES-256 encryption. Regular security audits and penetration testing ensure ongoing protection.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• AES-256 encryption at rest</li>
                  <li>• TLS 1.3 for data in transit</li>
                  <li>• Regular security audits</li>
                  <li>• Automated backup systems</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <UserCheck className="h-12 w-12 text-green-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Access Control</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive access controls with role-based permissions, multi-factor authentication, and session management to protect user accounts.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Multi-factor authentication</li>
                  <li>• Role-based access control</li>
                  <li>• Session timeout protection</li>
                  <li>• Failed login monitoring</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <AlertTriangle className="h-12 w-12 text-orange-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Incident Response</h3>
                <p className="text-gray-600 mb-4">
                  24/7 security monitoring with automated threat detection and rapid incident response procedures to minimize any potential impact.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• 24/7 security monitoring</li>
                  <li>• Automated threat detection</li>
                  <li>• Rapid incident response</li>
                  <li>• Detailed audit logging</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Industry-Leading Compliance</h2>
              <p className="text-xl text-gray-600">
                Meet the strictest regulatory requirements with our comprehensive compliance framework.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">SOC 2 Type II Certification</h4>
                    <p className="text-gray-600">Annual third-party audits verify our security, availability, and confidentiality controls.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">GDPR & Privacy by Design</h4>
                    <p className="text-gray-600">Built-in privacy controls and data minimization practices ensure GDPR compliance from day one.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Data Residency Options</h4>
                    <p className="text-gray-600">Choose where your data is stored with multiple geographic options to meet local requirements.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Security by the Numbers</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Security audits per year</span>
                    <span className="font-semibold text-blue-600">4+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Penetration tests annually</span>
                    <span className="font-semibold text-blue-600">2+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Security certifications</span>
                    <span className="font-semibold text-blue-600">5+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Uptime guarantee</span>
                    <span className="font-semibold text-blue-600">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">Security You Can Trust</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join enterprise customers who trust Tutora with their most sensitive training data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Start Secure Trial
              </Link>
              <Link
                href="/support"
                className="bg-blue-500 bg-opacity-20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-200"
              >
                Request Security Audit
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 