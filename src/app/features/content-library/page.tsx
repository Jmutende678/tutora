'use client'

import React, { useState } from 'react'
import Navigation from '@/components/Navigation'
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
  Target
} from 'lucide-react'

export default function ContentLibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const industries = [
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
      description: 'Teaching methods, student engagement, and admin'
    },
    {
      id: 'logistics',
      name: 'Logistics',
      icon: Truck,
      color: 'from-gray-500 to-slate-600',
      moduleCount: 26,
      description: 'Supply chain, transportation, and warehouse'
    }
  ]

  const contentLibrary = [
    // Healthcare
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
      preview: "Learn the fundamental principles of patient safety including proper hand hygiene techniques, fall prevention strategies, and medication administration protocols."
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
      preview: "Master HIPAA compliance requirements including patient privacy rights, security safeguards, and breach notification procedures."
    },
    {
      id: 3,
      title: "Medical Device Safety",
      category: "healthcare",
      industry: "Healthcare",
      duration: "35 min", 
      modules: 5,
      rating: 4.7,
      enrolled: 1892,
      level: "Advanced",
      description: "Safe operation, maintenance, and troubleshooting of medical devices and equipment.",
      topics: ["Device Inspection", "Calibration", "Troubleshooting", "Maintenance", "Safety Protocols"],
      preview: "Ensure safe and effective use of medical devices through proper inspection, calibration, and maintenance procedures."
    },

    // Retail
    {
      id: 4,
      title: "Customer Service Excellence",
      category: "retail",
      industry: "Retail",
      duration: "40 min",
      modules: 7,
      rating: 4.9,
      enrolled: 4521,
      level: "Beginner",
      description: "Master the art of exceptional customer service, handling complaints, and building customer loyalty.",
      topics: ["Active Listening", "Problem Solving", "Complaint Handling", "Upselling", "Customer Psychology", "Communication Skills", "Conflict Resolution"],
      preview: "Transform customer interactions with proven techniques for active listening, problem-solving, and building lasting relationships."
    },
    {
      id: 5,
      title: "Visual Merchandising Mastery",
      category: "retail",
      industry: "Retail",
      duration: "55 min",
      modules: 9,
      rating: 4.6,
      enrolled: 2134,
      level: "Intermediate",
      description: "Create compelling product displays that drive sales and enhance the customer shopping experience.",
      topics: ["Display Principles", "Color Theory", "Lighting", "Seasonal Displays", "Product Placement", "Store Layout", "Brand Consistency", "Customer Flow", "Sales Impact"],
      preview: "Learn professional visual merchandising techniques to create eye-catching displays that increase sales and customer engagement."
    },
    {
      id: 6,
      title: "Loss Prevention Strategies",
      category: "retail",
      industry: "Retail",
      duration: "30 min",
      modules: 4,
      rating: 4.5,
      enrolled: 1876,
      level: "Intermediate",
      description: "Identify and prevent theft, fraud, and inventory shrinkage while maintaining excellent customer service.",
      topics: ["Theft Prevention", "Fraud Detection", "Inventory Control", "Customer Approach"],
      preview: "Protect your business with effective loss prevention strategies that balance security with customer service excellence."
    },

    // Manufacturing
    {
      id: 7,
      title: "Workplace Safety Essentials",
      category: "manufacturing",
      industry: "Manufacturing",
      duration: "50 min",
      modules: 10,
      rating: 4.9,
      enrolled: 3892,
      level: "Beginner",
      description: "Comprehensive workplace safety training covering OSHA standards, hazard identification, and emergency procedures.",
      topics: ["OSHA Standards", "Hazard Recognition", "PPE Usage", "Emergency Procedures", "Incident Reporting", "Safety Culture", "Risk Assessment", "Machine Safety", "Chemical Safety", "First Aid"],
      preview: "Build a strong safety foundation with OSHA-compliant training covering hazard identification, PPE, and emergency response."
    },
    {
      id: 8,
      title: "Quality Control Fundamentals",
      category: "manufacturing",
      industry: "Manufacturing",
      duration: "45 min",
      modules: 8,
      rating: 4.7,
      enrolled: 2567,
      level: "Intermediate",
      description: "Quality control processes, statistical methods, and continuous improvement techniques for manufacturing excellence.",
      topics: ["Quality Standards", "Statistical Process Control", "Inspection Methods", "Root Cause Analysis", "Corrective Actions", "Documentation", "Continuous Improvement", "Six Sigma Basics"],
      preview: "Master quality control fundamentals including statistical methods, inspection techniques, and continuous improvement processes."
    },
    {
      id: 9,
      title: "Lean Manufacturing Principles",
      category: "manufacturing",
      industry: "Manufacturing",
      duration: "65 min",
      modules: 12,
      rating: 4.8,
      enrolled: 1943,
      level: "Advanced",
      description: "Eliminate waste, improve efficiency, and optimize production processes using lean manufacturing methodologies.",
      topics: ["5S Methodology", "Value Stream Mapping", "Waste Elimination", "Kaizen", "Just-in-Time", "Poka-Yoke", "Standardized Work", "Visual Management", "Continuous Flow", "Pull Systems", "Performance Metrics", "Team Engagement"],
      preview: "Transform your manufacturing operations with lean principles that eliminate waste and maximize value creation."
    },

    // Technology
    {
      id: 10,
      title: "Cybersecurity Awareness",
      category: "technology",
      industry: "Technology",
      duration: "40 min",
      modules: 6,
      rating: 4.9,
      enrolled: 5234,
      level: "Beginner",
      description: "Essential cybersecurity knowledge for all employees including phishing, password security, and data protection.",
      topics: ["Phishing Recognition", "Password Security", "Data Protection", "Social Engineering", "Incident Response", "Mobile Security"],
      preview: "Protect your organization from cyber threats with essential security awareness training for all employees."
    },
    {
      id: 11,
      title: "Agile Development Practices",
      category: "technology",
      industry: "Technology",
      duration: "75 min",
      modules: 14,
      rating: 4.8,
      enrolled: 3456,
      level: "Intermediate",
      description: "Master agile methodologies including Scrum, Kanban, and DevOps practices for efficient software development.",
      topics: ["Scrum Framework", "Sprint Planning", "Daily Standups", "Sprint Review", "Retrospectives", "Kanban Boards", "User Stories", "Backlog Management", "DevOps Integration", "Continuous Integration", "Testing", "Team Collaboration", "Agile Metrics", "Scaling Agile"],
      preview: "Accelerate software delivery with proven agile practices that improve team collaboration and product quality."
    },
    {
      id: 12,
      title: "Cloud Security Best Practices",
      category: "technology",
      industry: "Technology",
      duration: "55 min",
      modules: 9,
      rating: 4.7,
      enrolled: 2187,
      level: "Advanced",
      description: "Secure cloud infrastructure, data, and applications across AWS, Azure, and Google Cloud platforms.",
      topics: ["Cloud Architecture", "Identity Management", "Data Encryption", "Network Security", "Compliance", "Monitoring", "Incident Response", "Multi-Cloud", "Zero Trust"],
      preview: "Implement robust cloud security strategies across major platforms with industry best practices and compliance frameworks."
    },

    // Finance
    {
      id: 13,
      title: "Anti-Money Laundering (AML)",
      category: "finance",
      industry: "Finance",
      duration: "60 min",
      modules: 8,
      rating: 4.8,
      enrolled: 2891,
      level: "Intermediate",
      description: "AML compliance training covering suspicious activity detection, reporting requirements, and regulatory obligations.",
      topics: ["AML Regulations", "Customer Due Diligence", "Suspicious Activity", "Reporting Requirements", "Risk Assessment", "Record Keeping", "Training Requirements", "Penalties"],
      preview: "Ensure AML compliance with comprehensive training on detection, reporting, and regulatory requirements."
    },
    {
      id: 14,
      title: "Financial Risk Management",
      category: "finance",
      industry: "Finance",
      duration: "70 min",
      modules: 11,
      rating: 4.6,
      enrolled: 1654,
      level: "Advanced",
      description: "Identify, assess, and mitigate financial risks including credit, market, operational, and liquidity risks.",
      topics: ["Risk Types", "Risk Assessment", "Risk Metrics", "Stress Testing", "Portfolio Management", "Hedging Strategies", "Regulatory Capital", "Risk Reporting", "Governance", "Crisis Management", "Technology Risk"],
      preview: "Master financial risk management with advanced techniques for identifying, measuring, and mitigating various risk types."
    },

    // Hospitality
    {
      id: 15,
      title: "Food Safety & Hygiene",
      category: "hospitality",
      industry: "Hospitality",
      duration: "45 min",
      modules: 7,
      rating: 4.9,
      enrolled: 4123,
      level: "Beginner",
      description: "Essential food safety training covering HACCP principles, hygiene practices, and regulatory compliance.",
      topics: ["HACCP Principles", "Personal Hygiene", "Temperature Control", "Cross Contamination", "Cleaning & Sanitizing", "Allergen Management", "Record Keeping"],
      preview: "Ensure food safety compliance with comprehensive training on HACCP principles and hygiene best practices."
    },
    {
      id: 16,
      title: "Hotel Guest Experience",
      category: "hospitality",
      industry: "Hospitality",
      duration: "50 min",
      modules: 9,
      rating: 4.7,
      enrolled: 2456,
      level: "Intermediate",
      description: "Deliver exceptional guest experiences through service excellence, problem resolution, and personalized attention.",
      topics: ["Service Standards", "Guest Communication", "Problem Resolution", "Upselling", "Cultural Sensitivity", "Technology Use", "Team Coordination", "Feedback Management", "Loyalty Programs"],
      preview: "Elevate guest satisfaction with proven techniques for exceptional service delivery and experience management."
    },

    // Education
    {
      id: 17,
      title: "Classroom Management Strategies",
      category: "education",
      industry: "Education",
      duration: "55 min",
      modules: 10,
      rating: 4.8,
      enrolled: 3234,
      level: "Intermediate",
      description: "Effective classroom management techniques for creating positive learning environments and handling behavioral challenges.",
      topics: ["Behavior Management", "Positive Reinforcement", "Conflict Resolution", "Parent Communication", "Inclusive Practices", "Technology Integration", "Assessment Strategies", "Time Management", "Student Engagement", "Crisis Intervention"],
      preview: "Create positive learning environments with proven classroom management strategies and behavioral intervention techniques."
    },
    {
      id: 18,
      title: "Digital Learning Tools",
      category: "education",
      industry: "Education",
      duration: "40 min",
      modules: 6,
      rating: 4.6,
      enrolled: 2187,
      level: "Beginner",
      description: "Integrate digital tools and platforms to enhance teaching effectiveness and student engagement.",
      topics: ["Learning Management Systems", "Interactive Presentations", "Virtual Classrooms", "Assessment Tools", "Collaboration Platforms", "Digital Citizenship"],
      preview: "Transform your teaching with digital tools that enhance student engagement and learning outcomes."
    },

    // Logistics
    {
      id: 19,
      title: "Warehouse Operations Excellence",
      category: "logistics",
      industry: "Logistics",
      duration: "50 min",
      modules: 8,
      rating: 4.7,
      enrolled: 1876,
      level: "Intermediate",
      description: "Optimize warehouse operations including inventory management, picking strategies, and safety protocols.",
      topics: ["Inventory Management", "Picking Strategies", "Storage Optimization", "Safety Protocols", "Equipment Operation", "Quality Control", "Performance Metrics", "Team Leadership"],
      preview: "Maximize warehouse efficiency with proven strategies for inventory management, picking optimization, and safety compliance."
    },
    {
      id: 20,
      title: "Supply Chain Fundamentals",
      category: "logistics",
      industry: "Logistics",
      duration: "65 min",
      modules: 12,
      rating: 4.5,
      enrolled: 1432,
      level: "Advanced",
      description: "End-to-end supply chain management including procurement, logistics, and vendor relationship management.",
      topics: ["Supply Chain Strategy", "Procurement", "Vendor Management", "Logistics Planning", "Demand Forecasting", "Risk Management", "Technology Integration", "Sustainability", "Performance Measurement", "Global Trade", "Compliance", "Continuous Improvement"],
      preview: "Master supply chain management with comprehensive training on procurement, logistics, and strategic planning."
    }
  ]

  const categories = ['all', ...industries.map(ind => ind.id)]
  
  const filteredContent = contentLibrary.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-25 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
          
            <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <BookOpen className="h-4 w-4" />
              <span>Ready-to-Use Content</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Content 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Library
              </span>
              </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Access 300+ professionally crafted training modules across 8 industries. Get started instantly with expert-designed content or customize to fit your needs.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search training modules, topics, or industries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 transform hover:scale-105"
              >
                <span>Browse Full Library</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                href="/demo/ai-module-builder"
                className="border border-gray-300 text-slate-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </Link>
            </div>
            </div>
          </div>
        </section>

      {/* Industry Categories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Training Content by 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Industry</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive library of industry-specific training modules designed by experts.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Industries ({contentLibrary.length})
            </button>
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setSelectedCategory(industry.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === industry.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {industry.name} ({contentLibrary.filter(item => item.category === industry.id).length})
              </button>
            ))}
          </div>

          {/* Industry Overview Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {industries.map((industry, index) => (
              <div key={industry.id} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${industry.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <industry.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{industry.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{industry.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600">{industry.moduleCount} modules</span>
                  <button
                    onClick={() => setSelectedCategory(industry.id)}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Library */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Training 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Modules</span>
            </h2>
            <p className="text-lg text-gray-600">
              {selectedCategory === 'all' 
                ? `Showing all ${filteredContent.length} training modules`
                : `Showing ${filteredContent.length} ${industries.find(ind => ind.id === selectedCategory)?.name || ''} modules`
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContent.map((module) => (
              <div key={module.id} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {module.industry}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{module.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {module.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {module.description}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {module.duration}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {module.modules} modules
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {module.enrolled.toLocaleString()}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Key Topics:</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      module.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      module.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {module.level}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {module.topics.slice(0, 3).map((topic, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {topic}
                      </span>
                    ))}
                    {module.topics.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{module.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    {module.preview}
                  </p>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-sm transform hover:scale-105">
                      Preview Module
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No modules found</h3>
              <p className="text-gray-600">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Content Library 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Impact</span>
            </h2>
            <p className="text-lg text-gray-600">
              Real results from organizations using our content library.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, stat: "300+", label: "Training Modules", description: "Across 8 major industries" },
              { icon: Users, stat: "50K+", label: "Learners Trained", description: "Using our content library" },
              { icon: Award, stat: "4.8/5", label: "Average Rating", description: "From learners and trainers" },
              { icon: Target, stat: "85%", label: "Completion Rate", description: "Higher than industry average" }
            ].map((item, index) => (
              <div key={index} className="text-center bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{item.stat}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{item.label}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Training?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get instant access to our complete content library and start training your team today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center space-x-2 transform hover:scale-105"
            >
              <span>Start Free 14-Day Trial</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
            >
              <span>Contact Sales</span>
            </Link>
          </div>

          <p className="text-sm opacity-75 mt-6">
            No credit card required • Access to full content library • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
