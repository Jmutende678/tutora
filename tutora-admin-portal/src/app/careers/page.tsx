'use client'

import React, { useState } from 'react'
import Navigation from '@/components/Navigation'
import { 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  Zap, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Mail,
  Briefcase,
  Star,
  Target
} from 'lucide-react'

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const benefits = [
    {
      icon: Globe,
      title: "Remote-First Culture",
      description: "Work from anywhere with a global team of passionate professionals"
    },
    {
      icon: Star,
      title: "Competitive Compensation",
      description: "Market-leading salaries plus equity upside in a fast-growing company"
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness stipend"
    },
    {
      icon: Zap,
      title: "Professional Development",
      description: "$2,000 annual learning budget for courses, conferences, and certifications"
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Flexible working hours and unlimited PTO policy"
    },
    {
      icon: Users,
      title: "Amazing Team",
      description: "Work with brilliant minds who are passionate about transforming education"
    }
  ]

  const openPositions = [
    {
      id: 1,
      title: "Senior Full-Stack Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build and scale our AI-powered training platform using React, Node.js, and Python.",
      requirements: ["5+ years full-stack experience", "React/Next.js expertise", "Python/AI experience preferred"],
      urgent: true
    },
    {
      id: 2,
      title: "AI/ML Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Develop and improve our AI algorithms for content analysis and training generation.",
      requirements: ["3+ years ML experience", "Python/TensorFlow/PyTorch", "NLP experience"],
      urgent: true
    },
    {
      id: 3,
      title: "Product Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Drive product positioning, messaging, and go-to-market strategy for our platform.",
      requirements: ["4+ years B2B SaaS marketing", "Product marketing experience", "Excellent writing skills"],
      urgent: false
    },
    {
      id: 4,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      description: "Ensure customer success and drive expansion within our growing customer base.",
      requirements: ["3+ years customer success", "SaaS experience", "Strong communication skills"],
      urgent: false
    },
    {
      id: 5,
      title: "Sales Development Representative",
      department: "Sales",
      location: "Remote",
      type: "Full-time",
      description: "Generate qualified leads and support our sales team in growing our customer base.",
      requirements: ["1-3 years sales experience", "B2B SaaS preferred", "Hunter mentality"],
      urgent: false
    },
    {
      id: 6,
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Design intuitive user experiences for our AI-powered training platform.",
      requirements: ["3+ years UX/UI design", "Figma expertise", "B2B SaaS experience preferred"],
      urgent: false
    }
  ]

  const departments = ['all', 'Engineering', 'Marketing', 'Sales', 'Customer Success', 'Design']

  const filteredPositions = selectedDepartment === 'all' 
    ? openPositions 
    : openPositions.filter(pos => pos.department === selectedDepartment)

  const handleApply = (positionTitle: string) => {
    const subject = `Application for ${positionTitle}`
    const body = `Hi Tutora Team,

I'm interested in applying for the ${positionTitle} position. Please find my resume attached.

Looking forward to hearing from you!

Best regards,
[Your Name]`
    
    window.location.href = `mailto:careers@tutoralearn.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

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
              <Briefcase className="h-4 w-4" />
              <span>Join Our Mission</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Help Transform How the World
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Learns
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join our remote-first team of passionate professionals building the future of AI-powered employee training.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#open-positions"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 transform hover:scale-105"
              >
                <span>View Open Positions</span>
                <ArrowRight className="h-5 w-5" />
              </a>
              <a 
                href="#culture"
                className="border border-gray-300 text-slate-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <span>Learn About Our Culture</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Company Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Mission</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're democratizing professional training by making it accessible, affordable, and incredibly effective for businesses of all sizes.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Impact</h3>
                <p className="text-gray-700">Transform how millions of employees learn and grow in their careers</p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-700">Push the boundaries of AI to solve real business problems</p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Growth</h3>
                <p className="text-gray-700">Join a fast-growing company with unlimited potential</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="culture" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Work at 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Tutora?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We believe in creating an environment where talented people can do their best work and grow their careers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Open 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Positions</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our team and help build the future of AI-powered employee training.
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedDepartment === dept
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept === 'all' ? 'All Departments' : dept}
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredPositions.map((position) => (
              <div key={position.id} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{position.title}</h3>
                      {position.urgent && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                          Urgent Hire
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {position.department}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {position.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {position.type}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{position.description}</p>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Key Requirements:</h4>
                      <ul className="space-y-1">
                        {position.requirements.map((req, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="lg:ml-8 mt-6 lg:mt-0">
                    <button
                      onClick={() => handleApply(position.title)}
                      className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold transform hover:scale-105"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPositions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No positions available in this department at the moment.</p>
              <p className="text-gray-600 mt-2">Check back soon or contact us about future opportunities!</p>
            </div>
          )}
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Application 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Process</span>
            </h2>
            <p className="text-lg text-gray-600">
              Our hiring process is designed to be transparent, efficient, and respectful of your time.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Apply", description: "Submit your application via email with your resume and cover letter" },
              { step: "2", title: "Screen", description: "Initial phone/video call to discuss your background and the role" },
              { step: "3", title: "Interview", description: "Technical/behavioral interviews with team members" },
              { step: "4", title: "Offer", description: "Reference checks and offer discussion" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-bold text-lg mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Don't See the Right 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Role?</span>
            </h2>
            <p className="text-lg text-gray-600">
              We're always looking for exceptional talent. Send us your resume and let us know how you'd like to contribute.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h3>
            <p className="text-gray-700 mb-6">
              Send your resume and a note about what interests you to our careers team.
            </p>
            <div className="space-y-2 text-gray-700 mb-8">
              <p className="flex items-center justify-center">
                <Mail className="h-4 w-4 mr-2" />
                <strong>careers@tutoralearn.com</strong>
              </p>
              <p className="text-sm text-gray-600">We review all applications and respond within 1 week</p>
            </div>
            <div className="space-y-4">
              <a 
                href="mailto:careers@tutoralearn.com?subject=General Interest - [Your Name]"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold transform hover:scale-105 inline-block"
              >
                Send General Application
              </a>
              <div>
                <a 
                  href="/contact"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Or use our contact form →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
