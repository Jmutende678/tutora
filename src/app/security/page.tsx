'use client'

import React from 'react'
import Navigation from '@/components/Navigation'
import { Shield, Lock, Eye, Server, CheckCircle, AlertTriangle } from 'lucide-react'

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256)",
      details: ["256-bit encryption keys", "Perfect forward secrecy", "Regular key rotation"]
    },
    {
      icon: Shield,
      title: "SOC 2 Type II Certified",
      description: "Independently audited security controls and processes",
      details: ["Annual security audits", "Continuous monitoring", "Compliance reporting"]
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "Enterprise-grade cloud infrastructure with 99.9% uptime",
      details: ["AWS/GCP hosting", "DDoS protection", "Automated backups"]
    },
    {
      icon: Eye,
      title: "Access Controls",
      description: "Multi-factor authentication and role-based permissions",
      details: ["MFA required", "Principle of least privilege", "Session management"]
    }
  ]

  const certifications = [
    { name: "SOC 2 Type II", status: "Certified", year: "2024" },
    { name: "GDPR", status: "Compliant", year: "2024" },
    { name: "CCPA", status: "Compliant", year: "2024" },
    { name: "ISO 27001", status: "In Progress", year: "2025" }
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
              <span>Enterprise Security</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Security & 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Compliance
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your data security is our top priority. We implement industry-leading security measures to protect your information.
            </p>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Security</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive security measures designed to protect your most sensitive training data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Security 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Certifications</span>
            </h2>
            <p className="text-lg text-gray-600">
              Independently verified security standards and compliance certifications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                  cert.status === 'Certified' || cert.status === 'Compliant' 
                    ? 'bg-green-100' 
                    : 'bg-yellow-100'
                }`}>
                  {cert.status === 'Certified' || cert.status === 'Compliant' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{cert.status}</p>
                <p className="text-xs text-gray-500">{cert.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Security 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Practices</span>
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data Protection</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Encryption at Rest:</strong> All data stored using AES-256 encryption</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Encryption in Transit:</strong> TLS 1.3 for all data transmission</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Data Segregation:</strong> Complete isolation between customer environments</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Backup Security:</strong> Encrypted backups with geographic distribution</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Access Management</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Multi-Factor Authentication:</strong> Required for all user accounts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Role-Based Access:</strong> Granular permissions based on user roles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Session Management:</strong> Automatic logout and session monitoring</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Audit Logging:</strong> Comprehensive logging of all access and changes</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Infrastructure Security</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Cloud Security:</strong> Enterprise-grade AWS/GCP infrastructure</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Network Security:</strong> VPC isolation and firewall protection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>DDoS Protection:</strong> Advanced threat detection and mitigation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span><strong>Vulnerability Management:</strong> Regular security scans and updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Security Team */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Security 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Questions?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Our security team is here to address your concerns and provide additional information.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Our Security Team</h3>
            <p className="text-gray-700 mb-6">
              For security inquiries, vulnerability reports, or compliance questions:
            </p>
            <div className="space-y-2 text-gray-700 mb-8">
              <p><strong>Security Email:</strong> security@tutoralearn.com</p>
              <p><strong>Compliance Team:</strong> compliance@tutoralearn.com</p>
              <p><strong>Response Time:</strong> Security issues addressed within 24 hours</p>
            </div>
            <div className="space-y-4">
              <a 
                href="mailto:security@tutoralearn.com"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold transform hover:scale-105 inline-block"
              >
                Contact Security Team
              </a>
              <div>
                <a 
                  href="/contact"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  General Contact Form →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
