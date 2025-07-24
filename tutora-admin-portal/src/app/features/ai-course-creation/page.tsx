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
  Play,
  DollarSign,
  TrendingUp,
  Users,
  Settings,
  Database,
  Shield,
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useState } from 'react'

export default function AICourseCreationPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const features = [
    {
      icon: Upload,
      title: "Smart Content Upload",
      description: "Upload videos, PDFs, PowerPoints, or documents. Our AI analyzes everything automatically using advanced natural language processing."
    },
    {
      icon: Brain,
      title: "AI Content Analysis", 
      description: "Advanced AI extracts key concepts, learning objectives, and creates structured modules using GPT-4 and custom training algorithms."
    },
    {
      icon: Target,
      title: "Auto Quiz Generation",
      description: "Intelligent quiz creation with multiple choice, true/false, and scenario-based questions tailored to your content difficulty level."
    },
    {
      icon: BookOpen,
      title: "Interactive Elements",
      description: "Add interactive elements, knowledge checks, and progress tracking automatically with real-time engagement analytics."
    }
  ]

  const technicalSpecs = [
    {
      category: "Supported File Types",
      specs: [
        "Video: MP4, MOV, AVI, WebM (up to 4K resolution)",
        "Documents: PDF, DOCX, PPTX, TXT (up to 100MB)",
        "Audio: MP3, WAV, M4A (automatic transcription)",
        "Web: YouTube URLs, Vimeo links, website articles",
        "Images: JPG, PNG, SVG (with OCR text extraction)"
      ]
    },
    {
      category: "AI Processing Capabilities",
      specs: [
        "Natural Language Processing with 99.2% accuracy",
        "Automatic chapter detection and segmentation",
        "Key concept extraction using semantic analysis",
        "Learning objective generation based on Bloom's taxonomy",
        "Difficulty level assessment and adjustment"
      ]
    },
    {
      category: "Output Formats",
      specs: [
        "Interactive web modules with HTML5 compliance",
        "SCORM 1.2 and 2004 packages for LMS integration",
        "Mobile-responsive design for all devices",
        "Offline downloadable content packages",
        "API endpoints for custom integrations"
      ]
    }
  ]

  const useCases = [
    {
      industry: "Corporate Training",
      scenario: "Employee Onboarding",
      challenge: "New hires take 3-6 months to become fully productive",
      solution: "Transform existing training videos and documents into interactive modules",
      result: "65% faster onboarding, 40% higher retention rates",
      timeline: "Setup in 2 days, full deployment in 1 week"
    },
    {
      industry: "Healthcare",
      scenario: "Medical Compliance Training",
      challenge: "Complex regulations require frequent updates and testing",
      solution: "Auto-generate compliance modules from regulatory documents",
      result: "100% compliance tracking, 50% reduction in training time",
      timeline: "Immediate deployment, automatic updates"
    },
    {
      industry: "Manufacturing",
      scenario: "Safety Protocol Training",
      challenge: "High-risk environments require thorough safety knowledge",
      solution: "Convert safety manuals into engaging, interactive training",
      result: "85% reduction in safety incidents, improved knowledge retention",
      timeline: "1 week setup, ongoing content updates"
    },
    {
      industry: "Software Development",
      scenario: "Technical Documentation Training",
      challenge: "Complex technical concepts difficult to teach at scale",
      solution: "Transform code documentation into step-by-step learning paths",
      result: "70% faster developer onboarding, improved code quality",
      timeline: "Integration in 3 days, continuous content sync"
    }
  ]

  const roiMetrics = [
    {
      metric: "Content Creation Time",
      traditional: "4-6 weeks per module",
      withTutora: "5-10 minutes per module",
      improvement: "95% time reduction"
    },
    {
      metric: "Training Completion Rate",
      traditional: "45-60%",
      withTutora: "85-95%",
      improvement: "60% improvement"
    },
    {
      metric: "Knowledge Retention",
      traditional: "30% after 30 days",
      withTutora: "75% after 30 days",
      improvement: "150% improvement"
    },
    {
      metric: "Training Costs per Employee",
      traditional: "$500-1200",
      withTutora: "$50-150",
      improvement: "80% cost reduction"
    }
  ]

  const implementationSteps = [
    {
      step: 1,
      title: "Content Audit & Preparation",
      duration: "1-2 days",
      description: "Identify existing training materials, organize content by topic, and prepare files for upload.",
      deliverables: ["Content inventory", "File organization", "Quality assessment"]
    },
    {
      step: 2,
      title: "AI Processing & Module Generation",
      duration: "2-4 hours",
      description: "Upload content to Tutora's AI engine, review auto-generated modules, and customize as needed.",
      deliverables: ["Generated modules", "Quiz questions", "Interactive elements"]
    },
    {
      step: 3,
      title: "Review & Customization",
      duration: "1-3 days",
      description: "Review AI-generated content, add branding, customize assessments, and set learning paths.",
      deliverables: ["Customized modules", "Branded content", "Assessment criteria"]
    },
    {
      step: 4,
      title: "Testing & Deployment",
      duration: "1-2 days",
      description: "Test modules with sample users, gather feedback, make final adjustments, and deploy to team.",
      deliverables: ["Tested modules", "User feedback", "Deployment plan"]
    },
    {
      step: 5,
      title: "Monitoring & Optimization",
      duration: "Ongoing",
      description: "Monitor engagement analytics, track completion rates, and continuously optimize content.",
      deliverables: ["Analytics reports", "Optimization recommendations", "Performance metrics"]
    }
  ]

  const faqs = [
    {
      question: "How accurate is the AI content analysis?",
      answer: "Our AI achieves 99.2% accuracy in content analysis using advanced natural language processing. It's trained on millions of educational documents and continuously improves. For specialized technical content, accuracy may vary, but our system allows for easy manual review and correction."
    },
    {
      question: "Can I edit the AI-generated content?",
      answer: "Absolutely! While our AI creates comprehensive modules automatically, you have full control to edit text, modify questions, adjust difficulty levels, add custom branding, and reorganize content structure. Think of AI as your starting point, not your endpoint."
    },
    {
      question: "What happens to my original content files?",
      answer: "Your original files remain unchanged and are securely stored in your account. Our AI creates new training modules based on your content while preserving all source materials. You can download or reference original files anytime."
    },
    {
      question: "How long does AI processing take?",
      answer: "Processing time depends on content size and complexity. Most documents process in 2-5 minutes, while hour-long videos may take 10-15 minutes. You'll receive real-time progress updates and can continue working on other modules while processing."
    },
    {
      question: "Can the AI handle technical or specialized content?",
      answer: "Yes! Our AI is trained on diverse content including technical documentation, medical texts, legal documents, and industry-specific materials. For highly specialized content, you can provide glossaries or context to improve accuracy."
    },
    {
      question: "Is there a limit to content size or number of modules?",
      answer: "Limits depend on your plan. Starter plans include 10 AI modules per month, Growth and Professional plans offer unlimited modules. Individual files can be up to 100MB for documents and 5GB for videos."
    },
    {
      question: "How does AI quiz generation work?",
      answer: "Our AI analyzes your content to identify key concepts, then generates diverse question types including multiple choice, true/false, fill-in-the-blank, and scenario-based questions. Questions are calibrated to appropriate difficulty levels and aligned with learning objectives."
    },
    {
      question: "Can I integrate AI-generated modules with existing LMS?",
      answer: "Yes! Modules export as SCORM 1.2/2004 packages compatible with all major LMS platforms including Moodle, Blackboard, Canvas, and Cornerstone OnDemand. We also provide API access for custom integrations."
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
                  AI-Powered <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Course Creation</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Transform any video, document, or presentation into engaging, interactive training modules in minutes, not weeks. Our AI handles everything from content analysis to quiz generation, delivering professional courses at unprecedented speed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">95%</div>
                    <div className="text-sm text-gray-600">Time Saved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">99.2%</div>
                    <div className="text-sm text-gray-600">AI Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">10M+</div>
                    <div className="text-sm text-gray-600">Words Processed</div>
                  </div>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold">AI Processing</span>
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-sm text-gray-600">Analyzing content and generating interactive modules...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Enhanced */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How AI Course Creation Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our advanced AI technology makes course creation effortless. Upload any content format and watch as it transforms into professional training modules with interactive elements, assessments, and tracking capabilities.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8 mb-16">
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

            {/* Detailed Process Flow */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Detailed AI Processing Pipeline</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Content Ingestion & Format Detection</h4>
                    <p className="text-gray-600">AI automatically detects file type, extracts text from documents, transcribes audio/video, and preprocesses content for analysis. Supports 50+ file formats with 99.8% format recognition accuracy.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Semantic Analysis & Concept Extraction</h4>
                    <p className="text-gray-600">Advanced NLP identifies key concepts, relationships, and learning objectives. Builds knowledge graphs and determines optimal content structure using transformer-based models trained on educational content.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Module Structure Generation</h4>
                    <p className="text-gray-600">Creates logical learning sequences, determines chapter breaks, generates learning objectives aligned with Bloom's taxonomy, and establishes prerequisite relationships between concepts.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Assessment Generation & Calibration</h4>
                    <p className="text-gray-600">Generates diverse question types, calibrates difficulty levels, creates scenario-based assessments, and establishes mastery criteria. Includes adaptive testing algorithms for personalized learning paths.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">5</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Interactive Element Integration</h4>
                    <p className="text-gray-600">Adds interactive components, knowledge checks, multimedia elements, and engagement features. Optimizes for mobile devices and ensures accessibility compliance (WCAG 2.1 AA).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Specifications & Capabilities</h2>
              <p className="text-xl text-gray-600">
                Enterprise-grade AI technology with comprehensive format support and advanced processing capabilities.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {technicalSpecs.map((spec, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-6 text-gray-900">{spec.category}</h3>
                  <ul className="space-y-3">
                    {spec.specs.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <span className="text-gray-600 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases & Industry Applications */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Real-World Use Cases & Success Stories</h2>
              <p className="text-xl text-gray-600">
                See how organizations across industries are transforming their training with AI course creation.
              </p>
            </div>
            <div className="space-y-8">
              {useCases.map((useCase, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-200">
                  <div className="grid lg:grid-cols-4 gap-6">
                    <div>
                      <h3 className="font-semibold text-blue-600 mb-2">{useCase.industry}</h3>
                      <h4 className="text-lg font-bold text-gray-900 mb-3">{useCase.scenario}</h4>
                      <div className="text-sm text-gray-500">Timeline: {useCase.timeline}</div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Challenge</h5>
                      <p className="text-gray-600 text-sm">{useCase.challenge}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Solution</h5>
                      <p className="text-gray-600 text-sm">{useCase.solution}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Results</h5>
                      <p className="text-green-600 text-sm font-medium">{useCase.result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROI & Performance Metrics */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Measurable ROI & Performance Impact</h2>
              <p className="text-xl text-gray-600">
                Quantified results from organizations using AI course creation vs traditional methods.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Metric</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Traditional Method</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">With Tutora AI</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Improvement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {roiMetrics.map((metric, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{metric.metric}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{metric.traditional}</td>
                        <td className="px-6 py-4 text-sm text-green-600 text-center font-semibold">{metric.withTutora}</td>
                        <td className="px-6 py-4 text-sm text-blue-600 text-center font-bold">{metric.improvement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">*Based on data from 500+ organizations using Tutora AI course creation over 12 months</p>
            </div>
          </div>
        </section>

        {/* Implementation Guide */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Implementation Timeline & Process</h2>
              <p className="text-xl text-gray-600">
                Step-by-step guide to implementing AI course creation in your organization.
              </p>
            </div>
            <div className="space-y-8">
              {implementationSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="grid lg:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <div className="text-blue-600 font-medium text-sm mb-3">Duration: {step.duration}</div>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                      <div className="lg:col-span-2">
                        <h4 className="font-semibold text-gray-900 mb-3">Key Deliverables</h4>
                        <div className="grid md:grid-cols-3 gap-3">
                          {step.deliverables.map((deliverable, delIndex) => (
                            <div key={delIndex} className="bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700">
                              {deliverable}
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

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about AI course creation technology.
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
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

        {/* Integration & Compatibility */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Integration & Compatibility</h2>
              <p className="text-xl text-gray-600">
                Seamlessly integrate with your existing systems and workflows.
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">LMS & Platform Integration</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">SCORM 1.2 & 2004 compliance for universal LMS compatibility</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">xAPI (Tin Can API) support for advanced tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Direct integration with Moodle, Canvas, Blackboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">RESTful API for custom platform connections</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Single Sign-On (SSO) integration with SAML 2.0</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Security & Compliance</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">SOC 2 Type II certified data processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">GDPR compliant data handling and storage</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">End-to-end encryption for all content transfers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">WCAG 2.1 AA accessibility compliance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">ISO 27001 information security standards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Training Creation?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of companies who've revolutionized their training with AI course creation. Start your free trial today and create your first AI-powered module in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/demo/ai-module-builder"
                className="bg-blue-500 bg-opacity-20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Try Demo Now</span>
              </Link>
            </div>
            <div className="mt-8 text-blue-100 text-sm">
              No credit card required • 14-day free trial • Full feature access
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 