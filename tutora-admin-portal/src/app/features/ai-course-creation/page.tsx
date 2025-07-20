'use client'

import Navigation from '@/components/Navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Brain, 
  Upload, 
  FileText, 
  Video, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Zap,
  Target,
  BookOpen,
  Play
} from 'lucide-react'

export default function AICourseCreationPage() {
  const features = [
    {
      icon: Upload,
      title: "Smart Content Upload",
      description: "Upload videos, PDFs, PowerPoints, or documents. Our AI analyzes everything automatically."
    },
    {
      icon: Brain,
      title: "AI Content Analysis", 
      description: "Advanced AI extracts key concepts, learning objectives, and creates structured modules."
    },
    {
      icon: Target,
      title: "Auto Quiz Generation",
      description: "Intelligent quiz creation with multiple choice, true/false, and scenario-based questions."
    },
    {
      icon: BookOpen,
      title: "Interactive Elements",
      description: "Add interactive elements, knowledge checks, and progress tracking automatically."
    }
  ]

  const benefits = [
    "10x faster than manual course creation",
    "Consistent quality across all training materials", 
    "Automatic learning objective extraction",
    "Multi-format content support",
    "Real-time content optimization",
    "Instant deployment to your team"
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
                  AI-Powered <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Course Creation</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Transform any video, document, or presentation into engaging, interactive training modules in minutes, not weeks. Our AI handles everything from content analysis to quiz generation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Start Creating Now</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link 
                    href="/demo/ai-module-builder"
                    className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>Watch Demo</span>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/assets/images/tutapp Ai module screen.png"
                    alt="AI Module Builder Interface"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How AI Course Creation Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our advanced AI technology makes course creation effortless. Just upload your content and watch as it transforms into professional training modules.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose AI Course Creation?</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Traditional course creation takes weeks of manual work. Our AI technology revolutionizes the process, delivering professional training modules in minutes while maintaining quality and engagement.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Time Comparison</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Traditional Method</span>
                      <span className="font-semibold text-red-600">2-4 weeks</span>
                    </div>
                    <div className="bg-red-100 h-2 rounded-full">
                      <div className="bg-red-500 h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Tutora AI</span>
                      <span className="font-semibold text-green-600">5-10 minutes</span>
                    </div>
                    <div className="bg-green-100 h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full w-1/12"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-700">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">Save 95% of your time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Formats */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Supports All Your Content Types</h2>
              <p className="text-xl text-gray-600">
                Our AI works with any format you already have. No need to recreate existing content.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200">
                <Video className="h-12 w-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Video Content</h3>
                <p className="text-gray-600 mb-4">MP4, MOV, AVI, YouTube links, screen recordings, and live training sessions.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Automatic transcript generation</li>
                  <li>• Key moment identification</li>
                  <li>• Chapter creation</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200">
                <FileText className="h-12 w-12 text-green-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Documents</h3>
                <p className="text-gray-600 mb-4">PDF manuals, Word docs, PowerPoint presentations, and training guides.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Text analysis and structuring</li>
                  <li>• Image and diagram recognition</li>
                  <li>• Content summarization</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200">
                <Brain className="h-12 w-12 text-purple-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Live Sessions</h3>
                <p className="text-gray-600 mb-4">Zoom recordings, webinars, workshops, and conference presentations.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Speaker identification</li>
                  <li>• Q&A extraction</li>
                  <li>• Action item highlighting</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Training?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of companies who've revolutionized their training with AI course creation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Start Free Trial
              </Link>
              <Link
                href="/demo/ai-module-builder"
                className="bg-blue-500 bg-opacity-20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-200"
              >
                Try Demo Now
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 