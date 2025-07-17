import React from 'react'
import Link from 'next/link'
import { 
  Brain, 
  Smartphone, 
  BarChart3, 
  Workflow, 
  Building, 
  Shield, 
  Globe, 
  Lightbulb,
  Heart,
  ShoppingCart,
  Factory,
  DollarSign,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Clock,
  Users,
  Award
} from 'lucide-react'

export const metadata = {
  title: 'AI Training Features | Interactive Module Builder | Tutora',
  description: 'Discover Tutora\'s AI-powered features: 57% faster training creation, 92% engagement rates, automated workflows, and real-time analytics. Transform your employee training today.',
}

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Training Module Creation",
      description: "Transform any video, document, or presentation into engaging, interactive training modules automatically.",
      stats: [
        "57% faster training creation",
        "92% employee engagement increase", 
        "$2,400 average annual savings per 100 employees"
      ],
      process: [
        "Upload your video, PDF, or document",
        "AI analyzes content and creates learning objectives",
        "Generates interactive quizzes, assessments, and modules", 
        "Deploy across your organization instantly"
      ]
    },
    {
      icon: Smartphone,
      title: "Seamless Mobile Learning",
      description: "Your employees learn everywhere. Our mobile-first platform ensures training works perfectly on any device.",
      stats: [
        "70% of employees prefer mobile learning",
        "42% higher completion rates on mobile vs desktop",
        "Real-time sync across all devices"
      ]
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics & ROI Tracking", 
      description: "Measure what matters. Our analytics show which training drives real performance improvements.",
      stats: [
        "Companies with training analytics see 218% higher income per employee",
        "15-25% performance improvement through optimized training",
        "Real-time completion tracking and engagement metrics"
      ]
    },
    {
      icon: Workflow,
      title: "Automated Workflows",
      description: "Set up once, run forever. Our automation handles scheduling, reminders, and progress tracking.",
      stats: [
        "80% reduction in HR administrative time",
        "Automatic enrollment based on role or department", 
        "Smart reminders that actually get completed"
      ]
    },
    {
      icon: Building,
      title: "Enterprise Integration",
      description: "Connect seamlessly with your existing systems. No disruption, just enhancement.",
      features: [
        "Single Sign-On (SSO) with major providers",
        "SCORM/HTML5 compatibility",
        "API access for custom integrations",
        "White-label branding options"
      ]
    },
    {
      icon: Shield,
      title: "Compliance & Certification",
      description: "Stay compliant with automated tracking and industry-specific modules.",
      features: [
        "100% audit-ready reporting",
        "Industry certifications (HIPAA, OSHA, SOX)",
        "Automatic renewal reminders",
        "Role-based access controls"
      ]
    }
  ]

  const industries = [
    {
      icon: Heart,
      title: "Healthcare Training",
      subtitle: "91% of healthcare organizations cite training as essential for patient safety",
      features: [
        "HIPAA-compliant training delivery",
        "Medical certification tracking",
        "Interactive patient safety simulations",
        "Integration with EMR systems"
      ],
      results: "35% reduction in safety incidents, $500K+ annual savings"
    },
    {
      icon: ShoppingCart,
      title: "Retail Training", 
      subtitle: "67% turnover rate requires constant training",
      features: [
        "Product knowledge from supplier content",
        "Customer service role-play scenarios",
        "Seasonal training campaigns",
        "Mobile-first learning for floor staff"
      ],
      results: "45% improvement in customer satisfaction, 30% lower turnover"
    },
    {
      icon: Factory,
      title: "Manufacturing & Safety",
      subtitle: "OSHA mandates regular safety updates",
      features: [
        "Visual safety protocol demonstrations",
        "Equipment-specific training modules", 
        "Multi-language workforce support",
        "Offline capabilities for factory floors"
      ],
      results: "50% reduction in workplace incidents, $2M+ insurance savings"
    },
    {
      icon: DollarSign,
      title: "Financial Services",
      subtitle: "87% of firms struggle with compliance complexity",
      features: [
        "Real-time regulatory updates",
        "Role-based compliance tracking",
        "Audit-ready documentation", 
        "Risk management simulations"
      ],
      results: "99.8% audit success rate, zero violations for 18+ months"
    }
  ]

  const comparisons = [
    {
      title: "vs Traditional Training Companies",
      advantages: [
        "90% lower cost than external providers",
        "Real-time updates vs outdated content",
        "Personalized learning vs one-size-fits-all",
        "Measurable ROI vs unclear outcomes"
      ]
    },
    {
      title: "vs LearnWorlds ($299/month)",
      advantages: [
        "75% lower cost with more AI features",
        "Built-in module creation (their add-on costs $149/month)",
        "No per-enrollment fees (they charge $5/sale)",
        "Better mobile experience"
      ]
    },
    {
      title: "vs Building Internal Training",
      advantages: [
        "80% time savings on content creation", 
        "Professional instructional design built-in",
        "Automatic updates and maintenance",
        "Scalable across entire organization"
      ]
    }
  ]

  const customerStories = [
    {
      company: "TechStart Solutions",
      employees: "250 employees",
      challenge: "Onboarding remote developers across 5 time zones",
      solution: "AI-generated coding best practices training",
      results: "70% faster onboarding, $400K annual savings"
    },
    {
      company: "HealthCare Plus", 
      employees: "1,200 employees",
      challenge: "Mandatory HIPAA training for all staff",
      solution: "Interactive compliance modules with real scenarios",
      results: "95% completion rate, passed all audits"
    },
    {
      company: "RetailMax Chain",
      employees: "5,000 employees", 
      challenge: "Seasonal staff training across 200 locations",
      solution: "Mobile-first product training modules",
      results: "40% improvement in sales metrics, 25% lower turnover"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              <span>AI-Powered Training Features</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Transform Videos & Documents Into 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Training Modules in Minutes
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover the revolutionary AI features that make Tutora the fastest way to create, deploy, and track employee training. <strong>57% faster creation</strong>, <strong>92% higher engagement</strong>, and <strong>486% average ROI</strong>.
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-blue-600 mb-2">57%</div>
                <div className="text-sm text-gray-600">Faster Creation</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-purple-600 mb-2">92%</div>
                <div className="text-sm text-gray-600">Higher Engagement</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-green-600 mb-2">486%</div>
                <div className="text-sm text-gray-600">Average ROI</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-indigo-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Companies Using Tutora</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {mainFeatures.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mr-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 mb-6 text-lg">{feature.description}</p>
                
                {feature.stats && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Real Impact:</h4>
                    <ul className="space-y-2">
                      {feature.stats.map((stat, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700"><strong>{stat.split(' ')[0]}</strong> {stat.substring(stat.indexOf(' ') + 1)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feature.process && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">How It Works:</h4>
                    <ol className="space-y-2">
                      {feature.process.map((step, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">{i + 1}</span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {feature.features && (
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {feature.features.map((feat, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industry Solutions */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Industry-Specific Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored AI training for the unique challenges of your industry, with proven results across sectors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                    <industry.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{industry.title}</h3>
                </div>
                <p className="text-sm text-blue-600 font-medium mb-4">{industry.subtitle}</p>
                
                <ul className="space-y-2 mb-6">
                  {industry.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-800">Results:</span>
                  </div>
                  <p className="text-sm text-green-700">{industry.results}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Tutora */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Tutora?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how Tutora compares to traditional training methods and competitors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {comparisons.map((comparison, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{comparison.title}</h3>
                <ul className="space-y-3">
                  {comparison.advantages.map((advantage, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Success Stories */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Customer Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real companies achieving extraordinary results with Tutora's AI-powered training.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {customerStories.map((story, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{story.company}</h3>
                  <p className="text-sm text-gray-600">{story.employees}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Challenge:</h4>
                  <p className="text-gray-700 text-sm">{story.challenge}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Solution:</h4>
                  <p className="text-gray-700 text-sm">{story.solution}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Result:</h4>
                  <p className="text-blue-800 text-sm font-medium">{story.results}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to revolutionize your employee training?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join 500+ companies already saving 60% on training costs with Tutora's AI-powered platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
            >
              <Zap className="h-5 w-5" />
              <span>Start Free 14-Day Trial</span>
            </Link>
            <Link 
              href="/demo/ai-module-builder"
              className="bg-blue-500 bg-opacity-20 text-white px-8 py-4 rounded-lg hover:bg-opacity-30 transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
            >
              <ArrowRight className="h-5 w-5" />
              <span>See Tutora in Action</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm justify-center opacity-80">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Setup in 5 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>24/7 support</span>
            </div>
          </div>

          <p className="text-sm opacity-75 mt-6">
            <em>Join 500+ companies already saving 60% on training costs with Tutora.</em>
          </p>
        </div>
      </div>
    </div>
  )
} 