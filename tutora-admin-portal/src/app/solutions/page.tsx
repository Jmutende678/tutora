import React from 'react'
import Link from 'next/link'
import { 
  Building, 
  TrendingUp, 
  Briefcase,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Calculator,
  Heart,
  ShoppingCart,
  Factory,
  DollarSign,
  Globe,
  Clock,
  Shield,
  Zap,
  Award,
  Phone,
  PlayCircle,
  MessageSquare
} from 'lucide-react'

export const metadata = {
  title: 'Training Solutions for Every Business | Small to Enterprise | Tutora',
  description: 'Tailored AI training solutions for businesses of all sizes. From 10 to 10,000 employees. 65% cost reduction, 486% ROI, automated workflows. Find your perfect fit.',
}

export default function SolutionsPage() {
  const businessSizes = [
    {
      icon: Building,
      size: "Small Businesses",
      range: "1-50 Employees",
      challenge: "Limited Training Budget & Time",
      solution: "AI-Powered Efficiency",
      description: "Transform your existing knowledge into professional training modules without hiring trainers or spending weeks on content creation.",
      benefits: [
        "65% cost reduction vs external training providers",
        "No dedicated training staff required", 
        "Mobile-first learning for busy employees",
        "Instant deployment across all locations"
      ],
      roi: "$12/employee/month investment yields $200+ monthly productivity gains",
      perfectFor: [
        "Retail operations needing product training",
        "Professional services requiring compliance training",
        "Healthcare practices with certification requirements", 
        "Restaurants with food safety and service training"
      ],
      story: {
        company: "Bella's Boutique",
        employees: "12 employees",
        challenge: "Training seasonal staff on product knowledge",
        solution: "AI-generated modules from supplier catalogs",
        result: "40% faster onboarding, 25% increase in sales per employee"
      }
    },
    {
      icon: TrendingUp,
      size: "Growing Companies", 
      range: "51-200 Employees",
      challenge: "Scaling Training Across Departments",
      solution: "Automated Workflows & Department-Specific Modules",
      description: "Create standardized training that adapts to different roles while maintaining consistency across your organization.",
      benefits: [
        "70% reduction in HR training workload",
        "Consistent training quality across all departments",
        "Advanced analytics to identify training gaps",
        "Role-based learning paths for different positions"
      ],
      roi: "Professional services firm reduced onboarding time from 6 weeks to 2 weeks",
      scalingFeatures: [
        "Multi-department management with custom workflows",
        "Automated onboarding for new hires", 
        "Performance tracking by team and individual",
        "Integration with existing HR systems"
      ],
      departments: [
        {
          name: "Sales Teams",
          features: [
            "Product knowledge training from marketing materials",
            "Customer objection handling scenarios",
            "CRM integration for practical training", 
            "Performance-based learning paths"
          ]
        },
        {
          name: "Customer Service",
          features: [
            "Brand voice and communication training",
            "Problem-solving scenario simulations",
            "Product troubleshooting modules",
            "Customer satisfaction improvement programs"
          ]
        },
        {
          name: "Operations", 
          features: [
            "Process documentation transformed into training",
            "Safety and compliance automated updates",
            "Quality control standard training",
            "Cross-training for operational flexibility"
          ]
        }
      ]
    },
    {
      icon: Briefcase,
      size: "Enterprises",
      range: "200+ Employees", 
      challenge: "Complex Compliance & Specialized Training Needs",
      solution: "Advanced AI with Custom Integrations",
      description: "Enterprise-grade platform with dedicated support, custom features, and seamless integration with your existing technology stack.",
      benefits: [
        "SSO integration with existing systems (Okta, Azure AD, LDAP)",
        "Advanced compliance tracking and audit reporting",
        "Custom branding and white-label options",
        "Dedicated success manager and priority support",
        "API access for custom integrations",
        "Advanced analytics with custom reporting"
      ],
      compliance: [
        "SOC 2 Type II certified",
        "GDPR & CCPA compliant", 
        "SCORM 1.2/2004 support",
        "Advanced user permissions and role management"
      ],
      impact: "Fortune 500 clients report 40% reduction in compliance violations",
      useCases: [
        {
          type: "Global Organizations",
          features: [
            "Multi-language training with cultural adaptation",
            "Timezone-aware scheduling for global teams",
            "Regional compliance variations",
            "Local content customization"
          ]
        },
        {
          type: "Highly Regulated Industries",
          features: [
            "Pharmaceutical: FDA compliance training with automatic updates",
            "Financial Services: Real-time regulatory change management", 
            "Healthcare: HIPAA, patient safety, and clinical protocols",
            "Manufacturing: OSHA safety training and equipment certifications"
          ]
        }
      ]
    }
  ]

  const industries = [
    {
      icon: Heart,
      title: "Healthcare & Medical",
      marketNeed: "91% of healthcare organizations cite training as essential for patient safety",
      features: [
        "HIPAA-compliant training delivery and storage",
        "Medical certification tracking with automatic renewals",
        "Patient safety simulations with real-world scenarios", 
        "EMR system integration for practical training",
        "Continuing education credit tracking"
      ],
      results: [
        "35% reduction in safety incidents",
        "90% completion rates for mandatory training",
        "$500K+ annual savings on external training costs"
      ]
    },
    {
      icon: ShoppingCart,
      title: "Retail & E-commerce",
      marketNeed: "67% annual turnover rate requires constant training", 
      features: [
        "Product knowledge modules from supplier content",
        "Customer service training with role-play scenarios",
        "Seasonal training campaigns for holiday staff",
        "Mobile-first learning for floor staff",
        "Visual merchandising standards training"
      ],
      results: [
        "45% improvement in customer satisfaction scores",
        "30% reduction in employee turnover", 
        "$150K annual savings vs external training providers"
      ]
    },
    {
      icon: Factory,
      title: "Manufacturing & Industrial",
      marketNeed: "OSHA mandates regular safety training updates",
      features: [
        "Safety protocol training with visual demonstrations",
        "Equipment-specific training modules",
        "Multi-language support for diverse workforces",
        "Offline capabilities for factory floors",
        "Just-in-time training for equipment operation"
      ],
      results: [
        "50% reduction in workplace incidents",
        "100% OSHA compliance tracking",
        "$2M+ savings from reduced insurance premiums"
      ]
    },
    {
      icon: DollarSign,
      title: "Financial Services",
      marketNeed: "87% of financial firms struggle with compliance complexity",
      features: [
        "Real-time regulatory update integration",
        "Role-based compliance tracking", 
        "Audit-ready reporting and documentation",
        "Risk management scenario training",
        "Customer protection training modules"
      ],
      results: [
        "99.8% audit success rate",
        "60% reduction in compliance training costs",
        "Zero regulatory violations for 18+ months"
      ]
    },
    {
      icon: Users,
      title: "Professional Services",
      marketNeed: "Client-facing teams need consistent training on methodologies and client management",
      features: [
        "Methodology training from internal documentation",
        "Client communication best practices",
        "Project management certification paths",
        "Industry-specific expertise development", 
        "Soft skills development for client interaction"
      ]
    }
  ]

  const roiCalculations = [
    {
      size: "Small Business",
      employees: "25 employees",
      monthlyCost: "$300 (Tutora) vs $2,500 (external training)",
      annualSavings: "$26,400",
      productivityGains: "$60,000 (from faster onboarding)",
      totalROI: "2,347%"
    },
    {
      size: "Medium Business", 
      employees: "100 employees",
      monthlyCost: "$1,200 (Tutora) vs $8,000 (external training)",
      annualSavings: "$81,600",
      productivityGains: "$180,000",
      totalROI: "1,730%"
    },
    {
      size: "Enterprise",
      employees: "1,000+ employees", 
      monthlyCost: "$8,000 (Tutora) vs $50,000 (external training)",
      annualSavings: "$504,000",
      productivityGains: "$2,100,000",
      totalROI: "2,735%"
    }
  ]

  const implementation = {
    quickStart: [
      {
        week: "Week 1",
        title: "Platform setup and initial content upload"
      },
      {
        week: "Week 2", 
        title: "AI-generated training modules ready for review"
      },
      {
        week: "Week 3",
        title: "Employee enrollment and first training deployments"
      },
      {
        week: "Week 4",
        title: "Analytics review and optimization"
      }
    ],
    ongoingSupport: [
      "Dedicated customer success manager (Enterprise)",
      "24/7 technical support with guaranteed response times",
      "Regular platform updates with new AI capabilities", 
      "Best practices consultation and optimization reviews"
    ],
    migrationSupport: [
      "Content migration from existing platforms",
      "User data transfer with zero downtime",
      "Training calendar synchronization",
      "Integration setup with existing systems"
    ]
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Users className="h-4 w-4" />
              <span>Solutions for Every Business Size</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Training Solutions That Scale
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}With Your Business
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Whether you're a startup with 10 employees or an enterprise with 10,000, Tutora's AI-powered platform adapts to your needs and grows with your business. <strong>65% cost reduction</strong>, <strong>486% average ROI</strong>, and proven results across industries.
            </p>
          </div>
        </div>
      </div>

      {/* Business Size Solutions */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-24">
            {businessSizes.map((business, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-cols-2' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mr-4">
                      <business.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{business.size}</h2>
                      <p className="text-gray-600">{business.range}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">The Challenge: {business.challenge}</h3>
                    <p className="text-gray-600 mb-4">{business.description}</p>
                    <h4 className="font-semibold text-blue-600 mb-2">The Tutora Solution: {business.solution}</h4>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                    <ul className="space-y-2">
                      {business.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {business.roi && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calculator className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-800">ROI Impact:</span>
                      </div>
                      <p className="text-green-700">{business.roi}</p>
                    </div>
                  )}

                  {business.perfectFor && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Perfect For:</h4>
                      <ul className="space-y-1">
                        {business.perfectFor.map((item, i) => (
                          <li key={i} className="text-gray-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  {business.story && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                      <div className="flex items-center space-x-2 mb-4">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="font-semibold text-gray-900">Success Story</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{business.story.company}</h3>
                      <p className="text-sm text-gray-600 mb-4">{business.story.employees}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-900">Challenge: </span>
                          <span className="text-gray-700">{business.story.challenge}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Solution: </span>
                          <span className="text-gray-700">{business.story.solution}</span>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <span className="font-medium text-blue-900">Result: </span>
                          <span className="text-blue-800">{business.story.result}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {business.departments && (
                    <div className="space-y-6">
                      <h4 className="font-semibold text-gray-900">Department-Specific Solutions:</h4>
                      {business.departments.map((dept, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                          <h5 className="font-semibold text-gray-900 mb-3">{dept.name}</h5>
                          <ul className="space-y-1">
                            {dept.features.map((feature, j) => (
                              <li key={j} className="text-sm text-gray-700">• {feature}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {business.useCases && (
                    <div className="space-y-6">
                      <h4 className="font-semibold text-gray-900">Enterprise Use Cases:</h4>
                      {business.useCases.map((useCase, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                          <h5 className="font-semibold text-gray-900 mb-3">{useCase.type}</h5>
                          <ul className="space-y-1">
                            {useCase.features.map((feature, j) => (
                              <li key={j} className="text-sm text-gray-700">• {feature}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
              Tailored AI training for the unique challenges of your industry, with proven results and compliance built-in.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                    <industry.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{industry.title}</h3>
                </div>
                
                <p className="text-sm text-blue-600 font-medium mb-4">{industry.marketNeed}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Specialized Features:</h4>
                  <ul className="space-y-1">
                    {industry.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-700">• {feature}</li>
                    ))}
                  </ul>
                </div>

                {industry.results && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">Proven Results:</span>
                    </div>
                    <ul className="space-y-1">
                      {industry.results.map((result, i) => (
                        <li key={i} className="text-sm text-green-700">• {result}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calculator className="h-4 w-4" />
              <span>ROI Calculator</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">See Your Potential Savings</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real ROI calculations based on actual customer data across different business sizes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {roiCalculations.map((calc, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{calc.size}</h3>
                <p className="text-gray-600 mb-6">{calc.employees}</p>
                
                <div className="space-y-4 text-left">
                  <div>
                    <span className="font-medium text-gray-900">Monthly Cost: </span>
                    <span className="text-gray-700">{calc.monthlyCost}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Annual Savings: </span>
                    <span className="text-green-600 font-semibold">{calc.annualSavings}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Productivity Gains: </span>
                    <span className="text-gray-700">{calc.productivityGains}</span>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{calc.totalROI}</div>
                  <div className="text-sm text-blue-800">Total ROI</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Implementation & Support */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Implementation & Support</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get up and running quickly with our proven implementation process and ongoing support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <Clock className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Quick Start Program</h3>
              </div>
              <ul className="space-y-3">
                {implementation.quickStart.map((item, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mt-1">{item.week}</span>
                    <span className="text-gray-700">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Ongoing Support</h3>
              </div>
              <ul className="space-y-3">
                {implementation.ongoingSupport.map((item, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <Globe className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Migration Support</h3>
              </div>
              <ul className="space-y-3">
                {implementation.migrationSupport.map((item, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to see how Tutora fits your specific needs?</h2>
          <p className="text-xl opacity-90 mb-12">
            Get a personalized demo and ROI analysis for your organization. See exactly how Tutora can transform your training.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 rounded-2xl p-8 text-left">
              <h3 className="text-xl font-bold mb-4">Free Business Assessment</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>• 30-minute consultation with training experts</li>
                <li>• Custom ROI analysis for your organization</li>
                <li>• Personalized demo with your actual content</li>
                <li>• Implementation roadmap and timeline</li>
              </ul>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-8 text-left">
              <h3 className="text-xl font-bold mb-4">Risk-Free Trial</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>• 14-day full access to all features</li>
                <li>• White-glove onboarding support</li>
                <li>• Sample training modules created for you</li>
                <li>• No long-term contract required</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>Book Your Assessment</span>
            </Link>
            <Link 
              href="/register"
              className="bg-blue-500 bg-opacity-20 text-white px-8 py-4 rounded-lg hover:bg-opacity-30 transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
            >
              <Zap className="h-5 w-5" />
              <span>Start Free Trial</span>
            </Link>
            <Link 
              href="/demo/ai-module-builder"
              className="bg-blue-500 bg-opacity-20 text-white px-8 py-4 rounded-lg hover:bg-opacity-30 transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Live Chat - 24/7</span>
            </Link>
          </div>

          <p className="text-sm opacity-75">
            <em>Join companies like Microsoft, Shopify, and Tesla who trust Tutora for their employee training.</em>
          </p>
        </div>
      </div>
    </div>
  )
} 