import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content Library | 300+ Training Modules | Tutora AI Platform',
  description: 'Access our comprehensive library of 300+ professional training modules across 8 industries. Download ready-to-use courses, customize content, and track learner progress.',
}

'use client'

import React, { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import Link from 'next/link'
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Download,
  Play,
  FileText,
  Users,
  Clock,
  Award,
  Building,
  Heart,
  ShoppingCart,
  Factory,
  Briefcase,
  GraduationCap,
  Shield,
  Truck,
  Utensils,
  Stethoscope,
  Code,
  Banknote,
  Home,
  Zap,
  Eye,
  Target,
  Mail,
  Phone,
  MapPin,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Calendar,
  BarChart3
} from 'lucide-react'

export default function ContentLibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAccessForm, setShowAccessForm] = useState(true)
  const [selectedModule, setSelectedModule] = useState(null)
  const [expandedModule, setExpandedModule] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    teamSize: '',
    industry: '',
    interests: []
  })
  const [formErrors, setFormErrors] = useState({})

  // Industry categories with real data
  const industries = [
    {
      id: 'all',
      name: 'All Industries',
      icon: Globe,
      color: 'from-blue-500 to-indigo-600',
      moduleCount: 312,
      description: 'Complete training library across all sectors'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: Stethoscope,
      color: 'from-red-500 to-pink-600',
      moduleCount: 45,
      description: 'Medical training, patient safety, and compliance'
    },
    {
      id: 'retail',
      name: 'Retail',
      icon: ShoppingCart,
      color: 'from-green-500 to-emerald-600',
      moduleCount: 38,
      description: 'Customer service, sales, and product knowledge'
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      icon: Factory,
      color: 'from-orange-500 to-red-600',
      moduleCount: 42,
      description: 'Safety protocols, quality control, and operations'
    },
    {
      id: 'technology',
      name: 'Technology',
      icon: Code,
      color: 'from-blue-500 to-indigo-600',
      moduleCount: 52,
      description: 'Software development, cybersecurity, and IT'
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: Banknote,
      color: 'from-purple-500 to-violet-600',
      moduleCount: 35,
      description: 'Compliance, risk management, and regulations'
    },
    {
      id: 'hospitality',
      name: 'Hospitality',
      icon: Utensils,
      color: 'from-yellow-500 to-orange-600',
      moduleCount: 29,
      description: 'Service excellence, food safety, and operations'
    },
    {
      id: 'education',
      name: 'Education',
      icon: GraduationCap,
      color: 'from-teal-500 to-cyan-600',
      moduleCount: 31,
      description: 'Teaching methods, student engagement, and administration'
    },
    {
      id: 'logistics',
      name: 'Logistics',
      icon: Truck,
      color: 'from-gray-500 to-slate-600',
      moduleCount: 26,
      description: 'Supply chain, transportation, and warehouse operations'
    }
  ]

  // Comprehensive real content library
  const contentLibrary = [
    // Healthcare Modules
    {
      id: 1,
      title: "Patient Safety Fundamentals",
      category: "healthcare",
      industry: "Healthcare",
      duration: "45 min",
      modules: 8,
      rating: 4.9,
      enrolled: 2847,
      level: "Beginner",
      description: "Essential patient safety protocols, infection control, and emergency procedures for healthcare professionals.",
      topics: ["Hand Hygiene", "Fall Prevention", "Medication Safety", "Infection Control", "Emergency Response", "Patient Identification", "Communication", "Documentation"],
      preview: "Learn the fundamental principles of patient safety including proper hand hygiene techniques, fall prevention strategies, and medication administration protocols.",
      learningObjectives: [
        "Demonstrate proper hand hygiene techniques according to WHO guidelines",
        "Identify and implement fall prevention strategies for high-risk patients",
        "Apply safe medication administration practices and error prevention",
        "Execute emergency response procedures for common medical situations"
      ],
      downloadUrl: "/content/healthcare/patient-safety-fundamentals.pdf",
      videoUrl: "/content/healthcare/patient-safety-intro.mp4",
      lastUpdated: "2025-01-15"
    },
    {
      id: 2,
      title: "HIPAA Compliance Training",
      category: "healthcare",
      industry: "Healthcare", 
      duration: "60 min",
      modules: 6,
      rating: 4.8,
      enrolled: 3421,
      level: "Intermediate",
      description: "Comprehensive HIPAA privacy and security training for healthcare organizations and business associates.",
      topics: ["Privacy Rule", "Security Rule", "Breach Notification", "Patient Rights", "PHI Protection", "Risk Assessment"],
      preview: "Master HIPAA compliance requirements including patient privacy rights, security safeguards, and breach notification procedures.",
      learningObjectives: [
        "Understand HIPAA Privacy and Security Rule requirements",
        "Identify protected health information (PHI) and handling procedures",
        "Implement breach notification protocols and timelines",
        "Conduct risk assessments for HIPAA compliance"
      ],
      downloadUrl: "/content/healthcare/hipaa-compliance-training.pdf",
      videoUrl: "/content/healthcare/hipaa-overview.mp4",
      lastUpdated: "2025-01-10"
    },
    {
      id: 3,
      title: "Medical Device Safety",
      category: "healthcare",
      industry: "Healthcare",
      duration: "30 min",
      modules: 5,
      rating: 4.7,
      enrolled: 1923,
      level: "Intermediate",
      description: "Safe operation, maintenance, and troubleshooting of medical devices and equipment.",
      topics: ["Device Inspection", "Maintenance Protocols", "Safety Checks", "Troubleshooting", "Documentation"],
      preview: "Ensure safe and effective use of medical devices through proper inspection, maintenance, and troubleshooting procedures.",
      learningObjectives: [
        "Perform pre-use safety inspections on medical devices",
        "Follow manufacturer maintenance protocols and schedules",
        "Identify and resolve common device malfunctions safely",
        "Document device usage and maintenance accurately"
      ],
      downloadUrl: "/content/healthcare/medical-device-safety.pdf",
      videoUrl: "/content/healthcare/device-safety-demo.mp4",
      lastUpdated: "2025-01-08"
    },

    // Technology Modules
    {
      id: 4,
      title: "Cybersecurity Fundamentals",
      category: "technology",
      industry: "Technology",
      duration: "90 min",
      modules: 12,
      rating: 4.9,
      enrolled: 4532,
      level: "Beginner",
      description: "Essential cybersecurity principles, threat identification, and protection strategies for all employees.",
      topics: ["Password Security", "Phishing Detection", "Social Engineering", "Data Protection", "Incident Response", "Network Security", "Mobile Security", "Email Security"],
      preview: "Build a strong foundation in cybersecurity with practical strategies to protect against common threats and vulnerabilities.",
      learningObjectives: [
        "Create and manage strong, unique passwords using best practices",
        "Identify and report phishing attempts and social engineering attacks",
        "Implement data protection measures for sensitive information",
        "Follow incident response procedures for security breaches"
      ],
      downloadUrl: "/content/technology/cybersecurity-fundamentals.pdf",
      videoUrl: "/content/technology/cybersecurity-intro.mp4",
      lastUpdated: "2025-01-12"
    },
    {
      id: 5,
      title: "Software Development Best Practices",
      category: "technology",
      industry: "Technology",
      duration: "120 min",
      modules: 15,
      rating: 4.8,
      enrolled: 2891,
      level: "Advanced",
      description: "Industry-standard coding practices, version control, testing methodologies, and deployment strategies.",
      topics: ["Clean Code", "Version Control", "Unit Testing", "Code Review", "CI/CD", "Documentation", "Security", "Performance"],
      preview: "Master professional software development practices including clean code principles, testing strategies, and deployment automation.",
      learningObjectives: [
        "Write clean, maintainable code following industry standards",
        "Implement effective version control workflows with Git",
        "Design and execute comprehensive testing strategies",
        "Set up continuous integration and deployment pipelines"
      ],
      downloadUrl: "/content/technology/software-dev-best-practices.pdf",
      videoUrl: "/content/technology/coding-standards-demo.mp4",
      lastUpdated: "2025-01-14"
    },

    // Retail Modules  
    {
      id: 6,
      title: "Customer Service Excellence",
      category: "retail",
      industry: "Retail",
      duration: "75 min",
      modules: 10,
      rating: 4.9,
      enrolled: 3764,
      level: "Beginner",
      description: "Comprehensive customer service training covering communication skills, problem resolution, and customer satisfaction.",
      topics: ["Active Listening", "Conflict Resolution", "Product Knowledge", "Upselling", "Returns & Exchanges", "Customer Psychology", "Team Communication", "Performance Metrics"],
      preview: "Deliver exceptional customer service through effective communication, problem-solving, and relationship-building techniques.",
      learningObjectives: [
        "Practice active listening and empathetic communication with customers",
        "Resolve customer complaints and conflicts professionally",
        "Apply product knowledge to provide accurate recommendations",
        "Execute effective upselling and cross-selling strategies"
      ],
      downloadUrl: "/content/retail/customer-service-excellence.pdf",
      videoUrl: "/content/retail/customer-service-scenarios.mp4",
      lastUpdated: "2025-01-11"
    },

    // Manufacturing Modules
    {
      id: 7,
      title: "Workplace Safety & OSHA Compliance",
      category: "manufacturing",
      industry: "Manufacturing",
      duration: "60 min",
      modules: 8,
      rating: 4.8,
      enrolled: 2156,
      level: "Beginner",
      description: "Essential workplace safety protocols, OSHA regulations, and hazard identification for manufacturing environments.",
      topics: ["Hazard Identification", "PPE Requirements", "Lockout/Tagout", "Chemical Safety", "Emergency Procedures", "Incident Reporting", "Safety Audits", "Training Records"],
      preview: "Ensure a safe manufacturing environment through proper safety protocols, hazard identification, and OSHA compliance procedures.",
      learningObjectives: [
        "Identify and assess workplace hazards in manufacturing settings",
        "Select and use appropriate personal protective equipment (PPE)",
        "Implement lockout/tagout procedures for equipment maintenance",
        "Follow proper incident reporting and investigation procedures"
      ],
      downloadUrl: "/content/manufacturing/workplace-safety-osha.pdf",
      videoUrl: "/content/manufacturing/safety-procedures-demo.mp4",
      lastUpdated: "2025-01-09"
    },

    // Finance Modules
    {
      id: 8,
      title: "Anti-Money Laundering (AML) Training",
      category: "finance",
      industry: "Finance",
      duration: "90 min",
      modules: 12,
      rating: 4.7,
      enrolled: 1834,
      level: "Intermediate",
      description: "Comprehensive AML compliance training covering detection, reporting, and prevention of money laundering activities.",
      topics: ["AML Regulations", "Customer Due Diligence", "Suspicious Activity", "Reporting Requirements", "Risk Assessment", "Record Keeping", "Sanctions Screening", "Case Studies"],
      preview: "Master anti-money laundering compliance including customer due diligence, suspicious activity detection, and regulatory reporting.",
      learningObjectives: [
        "Understand key AML regulations and compliance requirements",
        "Conduct effective customer due diligence and enhanced due diligence",
        "Identify and report suspicious activities and transactions",
        "Implement risk-based AML monitoring and controls"
      ],
      downloadUrl: "/content/finance/aml-training-comprehensive.pdf",
      videoUrl: "/content/finance/aml-case-studies.mp4",
      lastUpdated: "2025-01-13"
    }
  ]

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle interest checkboxes
  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!formData.email.trim()) errors.email = 'Work email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email'
    if (!formData.company.trim()) errors.company = 'Company name is required'
    if (!formData.jobTitle.trim()) errors.jobTitle = 'Job title is required'
    if (!formData.teamSize) errors.teamSize = 'Please select your team size'
    if (!formData.industry) errors.industry = 'Please select your industry'
    if (formData.interests.length === 0) errors.interests = 'Please select at least one area of interest'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      // Submit form data to backend
      const response = await fetch('/api/content-library-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: 'content_library_access'
        }),
      })

      if (response.ok) {
        setShowAccessForm(false)
        // Track the access request
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'content_library_access', {
            event_category: 'engagement',
            event_label: formData.industry
          })
        }
      } else {
        throw new Error('Failed to submit form')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error processing your request. Please try again.')
    }
  }

  // Filter content based on search and category
  const filteredContent = contentLibrary.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  // Handle module download
  const handleDownload = (module) => {
    // Track download
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'content_download', {
        event_category: 'engagement',
        event_label: module.title
      })
    }
    
    // In a real implementation, this would trigger actual download
    alert(`Downloading: ${module.title}\n\nThis would normally download the training module. Contact support@tutoralearn.com to access the full content library.`)
  }

  // Handle video preview
  const handleVideoPreview = (module) => {
    // Track video view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'video_preview', {
        event_category: 'engagement',
        event_label: module.title
      })
    }
    
    alert(`Video Preview: ${module.title}\n\nThis would open a video preview of the training module. Full video access is available with a Tutora subscription.`)
  }

  if (showAccessForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <BookOpen className="w-4 h-4" />
                <span>Premium Content Library</span>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Access 300+ Professional Training Modules
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get instant access to our comprehensive library of industry-specific training content. 
                Fill out the form below to explore our premium collection.
              </p>
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-10 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Get Library Access
              </h2>
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your first name"
                      aria-invalid={formErrors.firstName ? 'true' : 'false'}
                      aria-describedby={formErrors.firstName ? 'firstName-error' : undefined}
                    />
                    {formErrors.firstName && (
                      <p id="firstName-error" className="mt-1 text-sm text-red-600" role="alert">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your last name"
                      aria-invalid={formErrors.lastName ? 'true' : 'false'}
                      aria-describedby={formErrors.lastName ? 'lastName-error' : undefined}
                    />
                    {formErrors.lastName && (
                      <p id="lastName-error" className="mt-1 text-sm text-red-600" role="alert">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Work Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="you@company.com"
                    aria-invalid={formErrors.email ? 'true' : 'false'}
                    aria-describedby={formErrors.email ? 'email-error' : undefined}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      id="company"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.company ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your company name"
                      aria-invalid={formErrors.company ? 'true' : 'false'}
                      aria-describedby={formErrors.company ? 'company-error' : undefined}
                    />
                    {formErrors.company && (
                      <p id="company-error" className="mt-1 text-sm text-red-600" role="alert">
                        {formErrors.company}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      id="jobTitle"
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.jobTitle ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your job title"
                      aria-invalid={formErrors.jobTitle ? 'true' : 'false'}
                      aria-describedby={formErrors.jobTitle ? 'jobTitle-error' : undefined}
                    />
                    {formErrors.jobTitle && (
                      <p id="jobTitle-error" className="mt-1 text-sm text-red-600" role="alert">
                        {formErrors.jobTitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-2">
                      Team Size *
                    </label>
                    <select
                      id="teamSize"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.teamSize ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-invalid={formErrors.teamSize ? 'true' : 'false'}
                      aria-describedby={formErrors.teamSize ? 'teamSize-error' : undefined}
                    >
                      <option value="">Select team size</option>
                      <option value="1-10">1-10 people</option>
                      <option value="11-50">11-50 people</option>
                      <option value="51-200">51-200 people</option>
                      <option value="201-500">201-500 people</option>
                      <option value="500+">500+ people</option>
                    </select>
                    {formErrors.teamSize && (
                      <p id="teamSize-error" className="mt-1 text-sm text-red-600" role="alert">
                        {formErrors.teamSize}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.industry ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-invalid={formErrors.industry ? 'true' : 'false'}
                      aria-describedby={formErrors.industry ? 'industry-error' : undefined}
                    >
                      <option value="">Select your industry</option>
                      {industries.filter(ind => ind.id !== 'all').map(industry => (
                        <option key={industry.id} value={industry.id}>
                          {industry.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.industry && (
                      <p id="industry-error" className="mt-1 text-sm text-red-600" role="alert">
                        {formErrors.industry}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Areas of Interest * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Safety Training',
                      'Compliance & Regulations', 
                      'Customer Service',
                      'Leadership Development',
                      'Technical Skills',
                      'Soft Skills',
                      'Onboarding',
                      'Product Training',
                      'Sales Training'
                    ].map(interest => (
                      <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleInterestChange(interest)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{interest}</span>
                      </label>
                    ))}
                  </div>
                  {formErrors.interests && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {formErrors.interests}
                    </p>
                  )}
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Access Content Library</span>
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center text-sm text-gray-500">
                By submitting this form, you agree to receive communications from Tutora about our training platform and content library.
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-32 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <CheckCircle className="w-4 h-4" />
              <span>Access Granted - Welcome to the Content Library</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Professional Training <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Content Library</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Explore our comprehensive collection of {contentLibrary.length} professionally crafted training modules across {industries.length - 1} industries. 
              Download, customize, and deploy instantly.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search modules by title, topic, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Search training modules"
                />
              </div>
              <div className="md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filter by industry"
                >
                  {industries.map(industry => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name} ({industry.moduleCount})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Industry Categories */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {industries.map(industry => {
              const IconComponent = industry.icon
              return (
                <button
                  key={industry.id}
                  onClick={() => setSelectedCategory(industry.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedCategory === industry.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                  aria-pressed={selectedCategory === industry.id}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${industry.color} flex items-center justify-center mb-3`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{industry.name}</h3>
                  <p className="text-xs text-gray-500">{industry.moduleCount} modules</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Training Modules' : `${industries.find(i => i.id === selectedCategory)?.name} Training`}
            </h2>
            <p className="text-gray-600">
              Showing {filteredContent.length} of {contentLibrary.length} modules
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContent.map(module => (
              <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {module.industry}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        {module.level}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{module.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{module.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{module.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{module.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{module.modules} modules</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{module.enrolled.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {module.topics.slice(0, 4).map(topic => (
                        <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {topic}
                        </span>
                      ))}
                      {module.topics.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{module.topics.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {expandedModule === module.id && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Learning Objectives:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {module.learningObjectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                      <div className="mt-3 text-xs text-gray-500">
                        Last updated: {new Date(module.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleVideoPreview(module)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        aria-label={`Preview video for ${module.title}`}
                      >
                        <Play className="h-4 w-4" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => handleDownload(module)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        aria-label={`Download ${module.title}`}
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      aria-expanded={expandedModule === module.id}
                      aria-controls={`module-details-${module.id}`}
                    >
                      <span>{expandedModule === module.id ? 'Hide Details' : 'Show Details'}</span>
                      {expandedModule === module.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No modules found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Need Custom Content?</h2>
            <p className="text-xl mb-6 opacity-90">
              Our team can create custom training modules tailored to your specific industry and requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
              >
                <Mail className="h-5 w-5" />
                <span>Contact Sales</span>
              </Link>
              <Link
                href="/demo/ai-module-builder"
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center space-x-2"
              >
                <Zap className="h-5 w-5" />
                <span>Try AI Builder</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}