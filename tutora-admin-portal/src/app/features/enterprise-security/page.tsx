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
  AlertTriangle,
  Eye,
  Server,
  Wifi,
  Monitor,
  Settings,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  X,
  Send
} from 'lucide-react'
import { useState } from 'react'

export default function EnterpriseSecurityPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [certOpen, setCertOpen] = useState<number | null>(null)
  const [auditModalOpen, setAuditModalOpen] = useState(false)
  const [auditForm, setAuditForm] = useState({
    companyName: '',
    email: '',
    phone: '',
    message: '',
    urgency: 'standard'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleAuditRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate form submission - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitStatus('success')
      setTimeout(() => {
        setAuditModalOpen(false)
        setSubmitStatus('idle')
        setAuditForm({ companyName: '', email: '', phone: '', message: '', urgency: 'standard' })
      }, 2000)
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const securityFeatures = [
    {
      icon: Shield,
      title: "SOC 2 Type II Certified",
      description: "Independently audited security controls ensuring the highest standards for data protection, availability, and confidentiality."
    },
    {
      icon: Globe,
      title: "GDPR Compliant", 
      description: "Full compliance with European data protection regulations including data minimization, user consent, and right to erasure."
    },
    {
      icon: Lock,
      title: "256-bit AES Encryption",
      description: "Bank-grade encryption for all data in transit and at rest, protecting your sensitive training information and user data."
    },
    {
      icon: Key,
      title: "SSO Integration",
      description: "Seamless integration with enterprise identity providers including Active Directory, Okta, Azure AD, and SAML 2.0."
    }
  ]

  const complianceFrameworks = [
    {
      name: "SOC 2 Type II",
      description: "Annual third-party audits verify security, availability, processing integrity, confidentiality, and privacy controls",
      details: [
        "Independent security audits every 12 months",
        "Continuous monitoring of security controls", 
        "Detailed audit reports available to enterprise customers",
        "90+ security controls across 5 trust service criteria"
      ],
      status: "Active",
      lastAudit: "March 2024",
      nextAudit: "March 2025"
    },
    {
      name: "GDPR Compliance",
      description: "Full adherence to European General Data Protection Regulation requirements",
      details: [
        "Data Protection Impact Assessments (DPIA) conducted",
        "Privacy by Design principles implemented",
        "User consent management and withdrawal mechanisms",
        "Data portability and right to erasure capabilities"
      ],
      status: "Compliant",
      lastReview: "January 2024",
      nextReview: "January 2025"
    },
    {
      name: "ISO 27001",
      description: "International standard for information security management systems",
      details: [
        "Comprehensive information security management system",
        "Risk assessment and treatment procedures",
        "Security incident response protocols",
        "Regular security awareness training programs"
      ],
      status: "Certified",
      lastAudit: "September 2023",
      nextAudit: "September 2024"
    },
    {
      name: "CCPA Compliance",
      description: "California Consumer Privacy Act compliance for US operations",
      details: [
        "Consumer rights request processing",
        "Data sale opt-out mechanisms",
        "Third-party data sharing transparency",
        "Privacy policy and disclosure requirements"
      ],
      status: "Compliant",
      lastReview: "February 2024",
      nextReview: "February 2025"
    }
  ]

  const securityControls = [
    {
      category: "Data Protection",
      controls: [
        {
          name: "Encryption at Rest",
          description: "AES-256 encryption for all stored data using AWS KMS managed keys",
          implementation: "Database-level encryption with automatic key rotation every 90 days"
        },
        {
          name: "Encryption in Transit", 
          description: "TLS 1.3 for all data transmission with perfect forward secrecy",
          implementation: "All API endpoints and web traffic encrypted using latest TLS protocols"
        },
        {
          name: "Data Classification",
          description: "Automated data classification and handling based on sensitivity levels",
          implementation: "Four-tier classification: Public, Internal, Confidential, Restricted"
        },
        {
          name: "Data Loss Prevention",
          description: "Monitoring and prevention of unauthorized data exfiltration",
          implementation: "Real-time scanning and alerting for sensitive data movements"
        }
      ]
    },
    {
      category: "Access Controls", 
      controls: [
        {
          name: "Multi-Factor Authentication",
          description: "Required MFA for all user accounts with multiple authentication methods",
          implementation: "TOTP, SMS, hardware tokens, and biometric authentication support"
        },
        {
          name: "Role-Based Access Control",
          description: "Granular permissions based on job functions and responsibilities",
          implementation: "50+ predefined roles with custom role creation capabilities"
        },
        {
          name: "Single Sign-On (SSO)",
          description: "Enterprise identity provider integration for centralized authentication",
          implementation: "SAML 2.0, OAuth 2.0, and OpenID Connect protocol support"
        },
        {
          name: "Session Management",
          description: "Secure session handling with automatic timeout and concurrency controls",
          implementation: "Configurable session timeouts, device limits, and location-based restrictions"
        }
      ]
    },
    {
      category: "Infrastructure Security",
      controls: [
        {
          name: "Network Segmentation",
          description: "Isolated network environments with strict access controls",
          implementation: "VPC isolation, private subnets, and network access control lists"
        },
        {
          name: "Intrusion Detection",
          description: "24/7 monitoring for unauthorized access attempts and suspicious activities",
          implementation: "AI-powered threat detection with automated response capabilities"
        },
        {
          name: "Vulnerability Management",
          description: "Regular security assessments and automated patching procedures",
          implementation: "Weekly vulnerability scans, monthly penetration testing"
        },
        {
          name: "Backup & Recovery",
          description: "Automated backups with geographic redundancy and disaster recovery",
          implementation: "3-2-1 backup strategy with point-in-time recovery capabilities"
        }
      ]
    }
  ]

  const auditReports = [
    {
      type: "SOC 2 Type II",
      period: "April 2023 - March 2024", 
      auditor: "PricewaterhouseCoopers LLP",
      scope: "Security, Availability, Processing Integrity, Confidentiality, Privacy",
      outcome: "Unqualified Opinion - No Material Weaknesses",
      keyFindings: [
        "All security controls operating effectively",
        "99.98% system availability achieved",
        "Zero security incidents during audit period",
        "Continuous monitoring systems functioning as designed"
      ]
    },
    {
      type: "Penetration Testing",
      period: "Q1 2024",
      auditor: "Rapid7 Security Services",
      scope: "Web Application, API Endpoints, Infrastructure",
      outcome: "No Critical or High Vulnerabilities Found", 
      keyFindings: [
        "Application security controls effective",
        "API rate limiting and authentication robust",
        "Infrastructure hardening standards met",
        "Recommendations for medium-priority improvements provided"
      ]
    }
  ]

  const incidentResponse = [
    {
      phase: "Detection",
      description: "Automated monitoring systems detect potential security incidents",
      timeline: "< 5 minutes",
      tools: ["SIEM", "IDS/IPS", "Log Analytics", "Threat Intelligence"]
    },
    {
      phase: "Analysis",
      description: "Security team analyzes the incident to determine scope and impact",
      timeline: "< 30 minutes",
      tools: ["Forensic Tools", "Threat Hunting", "IOC Analysis", "Risk Assessment"]
    },
    {
      phase: "Containment",
      description: "Immediate actions taken to prevent incident escalation",
      timeline: "< 1 hour",
      tools: ["Network Isolation", "Access Revocation", "System Quarantine", "Communication"]
    },
    {
      phase: "Recovery",
      description: "Systems restored to normal operations with enhanced monitoring",
      timeline: "< 4 hours",
      tools: ["Backup Restoration", "System Validation", "Performance Monitoring", "User Communication"]
    },
    {
      phase: "Lessons Learned",
      description: "Post-incident review and security control improvements",
      timeline: "Within 48 hours",
      tools: ["Root Cause Analysis", "Control Enhancement", "Documentation Updates", "Training Updates"]
    }
  ]

  const securityFaqs = [
    {
      question: "How is our sensitive training data protected?",
      answer: "All training content is encrypted using AES-256 encryption both at rest and in transit. Data is stored in geographically distributed data centers with redundant security controls. Access is logged and monitored 24/7, with role-based permissions ensuring only authorized personnel can access specific content."
    },
    {
      question: "What certifications and compliance standards do you meet?",
      answer: "We maintain SOC 2 Type II certification, ISO 27001 certification, and full GDPR compliance. We also adhere to CCPA requirements and undergo regular third-party security audits. All certifications are renewed annually with continuous monitoring throughout the year."
    },
    {
      question: "How do you handle data breaches and security incidents?",
      answer: "We have a comprehensive incident response plan with detection systems that alert our security team within minutes. Our response includes immediate containment, forensic analysis, affected customer notification within required timeframes, and post-incident improvements. We maintain cyber insurance and legal compliance with breach notification requirements."
    },
    {
      question: "Can we audit your security controls?",
      answer: "Yes, enterprise customers can request access to our SOC 2 reports, security documentation, and compliance certificates. We also accommodate customer security assessments and due diligence requests. Additionally, we provide security questionnaire responses and can participate in vendor risk assessment processes."
    },
    {
      question: "How do you ensure data residency and sovereignty?",
      answer: "We offer data residency options in multiple geographic regions including US, EU, and APAC. Customers can specify where their data is stored and processed. We maintain detailed data flow documentation and ensure compliance with local data protection laws in each jurisdiction."
    },
    {
      question: "What backup and disaster recovery capabilities exist?",
      answer: "We implement a 3-2-1 backup strategy with automated daily backups stored in multiple geographic locations. Our disaster recovery plan includes RTO (Recovery Time Objective) of 4 hours and RPO (Recovery Point Objective) of 1 hour. We conduct quarterly disaster recovery tests to validate our procedures."
    },
    {
      question: "How do you manage third-party vendor security?",
      answer: "All third-party vendors undergo security assessments before engagement. We maintain a vendor risk management program with regular reviews, contractual security requirements, and ongoing monitoring. Critical vendors must provide SOC 2 reports or equivalent security documentation."
    },
    {
      question: "What employee security training do you provide?",
      answer: "All employees complete security awareness training during onboarding and annually thereafter. We conduct regular phishing simulations, security workshops, and role-specific training. Our security team participates in continuous education and industry conferences to stay current with emerging threats."
    }
  ]

  const dataHandling = [
    {
      category: "Data Collection",
      practices: [
        "Minimal data collection principle - only necessary information",
        "Clear user consent mechanisms with granular options",
        "Purpose specification for all data collection activities",
        "Regular data collection audits and optimization"
      ]
    },
    {
      category: "Data Processing",
      practices: [
        "Automated data processing logs with full audit trails",
        "Data pseudonymization and anonymization where applicable",
        "Processing limitation based on stated purposes",
        "Regular data quality assessments and corrections"
      ]
    },
    {
      category: "Data Storage",
      practices: [
        "Geographic data residency options for compliance",
        "Automated data lifecycle management and retention",
        "Secure deletion procedures for expired data",
        "Regular backup verification and restoration testing"
      ]
    },
    {
      category: "Data Sharing",
      practices: [
        "Explicit consent required for any data sharing",
        "Data Processing Agreements (DPA) with all partners",
        "Regular third-party security assessments",
        "Real-time monitoring of data transfer activities"
      ]
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
                  Trust your training data to a platform built with enterprise security from the ground up. SOC 2 certified, GDPR compliant, and designed for the most security-conscious organizations with bank-grade protection.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link 
                    href="/register"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Get Security Details</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <button 
                    onClick={() => setAuditModalOpen(true)}
                    className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Request Security Audit</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">99.98%</div>
                    <div className="text-sm text-gray-600">Uptime SLA</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Security Incidents</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">24/7</div>
                    <div className="text-sm text-gray-600">Monitoring</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                {/* Security Badges */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-xl text-center hover:scale-105 transition-transform">
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
                  <div className="bg-white p-6 rounded-2xl shadow-xl text-center hover:scale-105 transition-transform">
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
                  <div className="bg-white p-6 rounded-2xl shadow-xl text-center col-span-2 hover:scale-105 transition-transform">
                    <Image
                      src="/assets/images/99 PERCENT SLA .png"
                      alt="99.9% SLA Uptime"
                      width={120}
                      height={60}
                      className="mx-auto mb-4"
                    />
                    <h3 className="font-semibold text-gray-900">99.98% Uptime SLA</h3>
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
                Your data deserves the highest level of protection. We've implemented enterprise-grade security measures used by financial institutions and government agencies to keep your training content and user data safe.
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

        {/* Compliance Frameworks */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Compliance Framework</h2>
              <p className="text-xl text-gray-600">
                We maintain the highest industry standards with regular audits and continuous compliance monitoring.
              </p>
            </div>
            <div className="space-y-6">
              {complianceFrameworks.map((framework, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200">
                  <button
                    onClick={() => setCertOpen(certOpen === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-2xl"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{framework.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          framework.status === 'Active' ? 'bg-green-100 text-green-800' :
                          framework.status === 'Certified' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {framework.status}
                        </span>
                      </div>
                      <p className="text-gray-600">{framework.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        Last Review: {framework.lastReview || framework.lastAudit} • Next Review: {framework.nextReview || framework.nextAudit}
                      </div>
                    </div>
                    {certOpen === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {certOpen === index && (
                    <div className="px-6 pb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Controls & Requirements</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {framework.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-start space-x-3">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                            <span className="text-sm text-gray-600">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Security Controls */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Security Controls</h2>
              <p className="text-xl text-gray-600">
                Multi-layered security architecture with defense-in-depth principles.
              </p>
            </div>
            <div className="space-y-12">
              {securityControls.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">{category.category}</h3>
                  <div className="grid lg:grid-cols-2 gap-8">
                    {category.controls.map((control, controlIndex) => (
                      <div key={controlIndex} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">{control.name}</h4>
                        <p className="text-gray-600 mb-4">{control.description}</p>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="font-medium text-blue-900 mb-2">Implementation</h5>
                          <p className="text-blue-700 text-sm">{control.implementation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Audit Reports & Assessments */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Third-Party Audits & Assessments</h2>
              <p className="text-xl text-gray-600">
                Independent verification of our security controls and practices.
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {auditReports.map((report, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{report.type}</h3>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Passed
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div><span className="font-medium">Period:</span> {report.period}</div>
                    <div><span className="font-medium">Auditor:</span> {report.auditor}</div>
                    <div><span className="font-medium">Scope:</span> {report.scope}</div>
                    <div><span className="font-medium">Outcome:</span> <span className="text-green-600 font-semibold">{report.outcome}</span></div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Findings</h4>
                  <ul className="space-y-2">
                    {report.keyFindings.map((finding, findingIndex) => (
                      <li key={findingIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                        <span className="text-sm text-gray-600">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Incident Response */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Security Incident Response</h2>
              <p className="text-xl text-gray-600">
                Comprehensive incident response plan with rapid detection and resolution capabilities.
              </p>
            </div>
            <div className="space-y-6">
              {incidentResponse.map((phase, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="grid lg:grid-cols-4 gap-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{phase.phase}</h3>
                        <div className="text-red-600 font-medium text-sm mb-3">Timeline: {phase.timeline}</div>
                        <p className="text-gray-600">{phase.description}</p>
                      </div>
                      <div className="lg:col-span-3">
                        <h4 className="font-semibold text-gray-900 mb-3">Tools & Technologies</h4>
                        <div className="grid md:grid-cols-4 gap-3">
                          {phase.tools.map((tool, toolIndex) => (
                            <div key={toolIndex} className="bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 text-center">
                              {tool}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Handling Practices */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Handling & Privacy Practices</h2>
              <p className="text-xl text-gray-600">
                Comprehensive data governance with privacy-by-design principles.
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {dataHandling.map((category, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">{category.category}</h3>
                  <div className="space-y-4">
                    {category.practices.map((practice, practiceIndex) => (
                      <div key={practiceIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                        <span className="text-gray-600">{practice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security FAQ */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Security & Compliance FAQ</h2>
              <p className="text-xl text-gray-600">
                Common questions about our enterprise security practices.
              </p>
            </div>
            <div className="space-y-4">
              {securityFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200">
                  <button
                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    {faqOpen === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {faqOpen === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">Security You Can Trust</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join enterprise customers who trust Tutora with their most sensitive training data. Request a security audit or start your trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Start Secure Trial
              </Link>
              <button
                onClick={() => setAuditModalOpen(true)}
                className="bg-blue-500 bg-opacity-20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-200"
              >
                Request Security Audit
              </button>
            </div>
            <div className="mt-8 text-blue-100 text-sm">
              SOC 2 Type II Certified • GDPR Compliant • 99.98% Uptime SLA
            </div>
          </div>
        </section>
      </div>

      {/* Security Audit Request Modal */}
      {auditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Request Security Audit</h2>
                  <p className="text-gray-600">Get access to our compliance reports and security documentation</p>
                </div>
                <button
                  onClick={() => setAuditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAuditRequest} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={auditForm.companyName}
                    onChange={(e) => setAuditForm({...auditForm, companyName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={auditForm.email}
                    onChange={(e) => setAuditForm({...auditForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your business email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={auditForm.phone}
                    onChange={(e) => setAuditForm({...auditForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Request Priority
                  </label>
                  <select
                    value={auditForm.urgency}
                    onChange={(e) => setAuditForm({...auditForm, urgency: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="standard">Standard (5-7 business days)</option>
                    <option value="urgent">Urgent (2-3 business days)</option>
                    <option value="emergency">Emergency (24 hours)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Security Requirements & Questions *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={auditForm.message}
                    onChange={(e) => setAuditForm({...auditForm, message: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please describe your security audit requirements, compliance needs, or specific questions about our security controls..."
                  />
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => setAuditModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : submitStatus === 'success' ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Request Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                * Required fields. We'll respond within the selected timeframe with your security documentation and audit reports.
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 