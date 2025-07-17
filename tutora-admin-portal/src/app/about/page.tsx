import React from 'react'
import Link from 'next/link'
import { 
  Target, 
  Users, 
  Award, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Brain,
  Lightbulb,
  Globe,
  Heart,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Zap,
  Shield,
  Clock,
  Building
} from 'lucide-react'

export const metadata = {
  title: 'About Tutora | Revolutionizing Employee Training with AI | Our Mission',
  description: 'Learn about Tutora\'s mission to democratize professional training. 500+ companies, $50M+ saved, 95% retention rate. Meet the team revolutionizing workforce development with AI.',
}

export default function AboutPage() {
  const achievements = [
    {
      icon: Users,
      number: "500+",
      label: "Companies using Tutora worldwide"
    },
    {
      icon: Award,
      number: "1M+",
      label: "Training modules created with AI"
    },
    {
      icon: TrendingUp,
      number: "85%",
      label: "Average completion rate (vs 30% industry average)"
    },
    {
      icon: Shield,
      number: "99.9%",
      label: "Uptime across all customer deployments"
    },
    {
      icon: Clock,
      number: "$50M+",
      label: "Saved by customers on training costs"
    },
    {
      icon: Building,
      number: "95%",
      label: "Customer retention rate"
    }
  ]

  const differentiators = [
    {
      title: "True AI Innovation",
      description: "We're not just adding AI as a feature - our entire platform is built AI-first:",
      features: [
        "Proprietary training algorithms developed specifically for workplace learning",
        "Continuous learning models that improve with every module created",
        "Natural language processing optimized for business content"
      ]
    },
    {
      title: "Proven Business Results", 
      description: "Every feature is designed to drive measurable business outcomes:",
      features: [
        "ROI tracking built into every training module",
        "Performance correlation analytics",
        "Business impact reporting for executives"
      ]
    },
    {
      title: "Scalable for Any Size",
      description: "From 10-person startups to 10,000-person enterprises:",
      features: [
        "Flexible pricing that grows with your business",
        "Enterprise-grade security and compliance", 
        "Global deployment capabilities"
      ]
    },
    {
      title: "Industry Expertise",
      description: "Deep understanding of training challenges across industries:",
      features: [
        "Healthcare: HIPAA compliance and patient safety",
        "Financial Services: Regulatory training and risk management",
        "Manufacturing: Safety protocols and equipment training",
        "Retail: Product knowledge and customer service"
      ]
    }
  ]

  const technology = [
    {
      title: "Computer Vision",
      description: "for video content analysis"
    },
    {
      title: "Natural Language Processing", 
      description: "for document understanding"
    },
    {
      title: "Machine Learning",
      description: "for personalized learning paths"
    },
    {
      title: "Predictive Analytics",
      description: "for training effectiveness"
    }
  ]

  const globalImpact = [
    {
      stat: "25+",
      label: "Countries with companies using Tutora"
    },
    {
      stat: "20+", 
      label: "Languages for content creation"
    },
    {
      stat: "6",
      label: "Major industries served"
    }
  ]

  const teamValues = [
    {
      icon: Brain,
      title: "Innovation First",
      description: "We believe the best solutions come from pushing the boundaries of what's possible with AI and machine learning."
    },
    {
      icon: Heart,
      title: "Human-Centered",
      description: "Technology should enhance human potential, not replace it. We build AI that empowers people to learn and grow."
    },
    {
      icon: Target,
      title: "Results-Driven",
      description: "Every feature we build must demonstrably improve business outcomes for our customers."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Building className="h-4 w-4" />
              <span>Revolutionizing Employee Training</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              The Future of Employee Training
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}is Here
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              At Tutora, we believe every company deserves world-class employee training without the traditional barriers of cost, complexity, and time. That's why we built the world's first AI-powered training module generator.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Problem */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-xl font-semibold text-blue-600 mb-4">
                To democratize professional training by making it accessible, affordable, and incredibly effective for businesses of all sizes.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We're solving the <strong>$805 billion problem:</strong> Companies spend massive amounts on training that employees don't complete, don't retain, and doesn't drive real business results.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">The Training Crisis:</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="bg-red-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700"><strong>70% of employees</strong> say they don't have mastery of skills needed for their job</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="bg-red-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700"><strong>87% of millennials</strong> rate development as important, but only <strong>29%</strong> are engaged</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="bg-red-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Companies waste <strong>$13.5 million annually</strong> on ineffective training programs</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="bg-red-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700"><strong>42% of companies</strong> struggle with content creation for training</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Our Solution */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Lightbulb className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-4xl font-bold text-gray-900">Our Revolutionary Solution</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-Powered Training Creation that transforms any existing content into professional training modules in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How It Works:</h3>
              <ol className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full">1</span>
                  <span className="text-gray-700">Upload video, PDF, or document</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full">2</span>
                  <span className="text-gray-700">AI analyzes content and creates learning objectives</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full">3</span>
                  <span className="text-gray-700">Generates interactive quizzes and assessments automatically</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full">4</span>
                  <span className="text-gray-700">Deploys across your organization instantly</span>
                </li>
              </ol>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real Results:</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700"><strong>57% faster</strong> training creation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700"><strong>92% higher</strong> employee engagement</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700"><strong>$2,400+ savings</strong> per 100 employees annually</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700"><strong>85% average</strong> completion rates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Achievements</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform milestones, industry recognition, and customer success metrics that demonstrate our impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-200">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                  <achievement.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{achievement.number}</div>
                <div className="text-gray-600">{achievement.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Industry Recognition</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">"Most Innovative Training Platform 2024"</div>
                <div className="text-sm text-gray-600">HR Technology Awards</div>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Featured in Forbes</div>
                <div className="text-sm text-gray-600">"Top 10 AI Companies Transforming Business"</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">#1 Rated</div>
                <div className="text-sm text-gray-600">Employee training platform on G2</div>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">SOC 2 Type II Certified</div>
                <div className="text-sm text-gray-600">Enterprise security</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Makes Us Different</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four key differentiators that set Tutora apart from traditional training solutions and competitors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {differentiators.map((diff, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{diff.title}</h3>
                <p className="text-gray-600 mb-4">{diff.description}</p>
                <ul className="space-y-2">
                  {diff.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-4xl font-bold text-gray-900">Our Technology</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI capabilities that power the world's most effective training platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {technology.map((tech, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <h3 className="font-bold text-gray-900 mb-2">{tech.title}</h3>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Enterprise-Grade Platform</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span><strong>99.9% uptime</strong> SLA with global CDN</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span><strong>SOC 2 Type II</strong> security certification</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span><strong>GDPR & CCPA</strong> compliant data handling</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span><strong>Advanced encryption</strong> for all data transmission</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Integration Ecosystem</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span><strong>50+ integrations</strong> with popular business tools</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span><strong>RESTful APIs</strong> for custom integrations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span><strong>SSO support</strong> for enterprise identity management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span><strong>Webhook notifications</strong> for real-time updates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Impact */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Globe className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-4xl font-bold text-gray-900">Our Global Impact</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforming workplaces worldwide with sustainable and accessible training solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {globalImpact.map((impact, index) => (
              <div key={index} className="text-center bg-white rounded-2xl p-8 border border-gray-200">
                <div className="text-4xl font-bold text-green-600 mb-2">{impact.stat}</div>
                <div className="text-gray-600">{impact.label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainability & Social Impact</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span className="text-gray-700"><strong>Carbon footprint reduction:</strong> Digital training eliminates travel for in-person sessions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span className="text-gray-700"><strong>Accessibility focus:</strong> Screen reader compatible and ADA compliant</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                  <span className="text-gray-700"><strong>Small business support:</strong> Affordable pricing makes professional training accessible</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Industries Served</h3>
              <div className="text-gray-700">
                <strong>Healthcare, Finance, Retail, Manufacturing, Technology, Professional Services</strong> and many more industries trust Tutora for their training needs.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Values */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and the reason we started Tutora.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {teamValues.map((value, index) => (
              <div key={index} className="text-center bg-white border border-gray-200 rounded-2xl p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why We Started Tutora</h3>
            <blockquote className="text-lg text-gray-700 italic mb-4">
              "After watching countless companies waste millions on training that doesn't work, we knew there had to be a better way. With AI, we can create personalized, engaging training that actually drives business results - and do it at a fraction of the cost and time."
            </blockquote>
            <div className="text-gray-600">- Tutora Founding Team</div>
          </div>
        </div>
      </div>

      {/* Vision for the Future */}
      <div className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Vision for the Future</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The next 5 years of innovation and impact in the training industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">The Next 5 Years:</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                  <span className="text-gray-700"><strong>Democratize training</strong> for 1 million businesses globally</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                  <span className="text-gray-700"><strong>Save companies $1 billion</strong> in training costs annually</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                  <span className="text-gray-700"><strong>Create the most comprehensive</strong> AI training library in the world</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                  <span className="text-gray-700"><strong>Set the standard</strong> for effective, measurable employee development</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Innovation Roadmap:</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-purple-600 mt-1" />
                  <span className="text-gray-700"><strong>Virtual Reality</strong> training simulations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-purple-600 mt-1" />
                  <span className="text-gray-700"><strong>Advanced analytics</strong> with predictive modeling</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-purple-600 mt-1" />
                  <span className="text-gray-700"><strong>Real-time translation</strong> for global teams</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-purple-600 mt-1" />
                  <span className="text-gray-700"><strong>AI coaching</strong> for personalized development</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to join the training revolution? Contact us to learn how Tutora can transform your organization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">hello@tutora.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Phone</div>
                    <div className="text-gray-600">+1 (555) 123-TUTOR</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Address</div>
                    <div className="text-gray-600">San Francisco, CA (HQ)<br />Global Remote Team</div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-4">Follow Our Journey</h4>
                <div className="flex space-x-4">
                  <a href="https://linkedin.com/company/tutora-ai" className="bg-blue-100 rounded-lg p-3 hover:bg-blue-200 transition-colors">
                    <Linkedin className="h-6 w-6 text-blue-600" />
                  </a>
                  <a href="https://twitter.com/tutora_ai" className="bg-blue-100 rounded-lg p-3 hover:bg-blue-200 transition-colors">
                    <Twitter className="h-6 w-6 text-blue-600" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Transform Your Training?</h3>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">For Businesses</h4>
                  <p className="text-gray-600 mb-4">See how Tutora can transform your workforce development</p>
                  <div className="space-y-2">
                    <Link href="/register" className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition-colors">
                      🚀 Start Free 14-Day Trial
                    </Link>
                    <Link href="/demo/ai-module-builder" className="block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors">
                      📞 Schedule Demo
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">For Careers</h4>
                  <p className="text-gray-600 mb-4">Help transform how the world learns</p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Remote-first culture with global team</li>
                    <li>• Competitive compensation with equity upside</li>
                    <li>• Professional development budget</li>
                    <li>• Mission-driven work with real impact</li>
                  </ul>
                  <Link href="/careers" className="block bg-purple-600 text-white px-4 py-2 rounded-lg text-center hover:bg-purple-700 transition-colors">
                    View Open Positions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <blockquote className="text-2xl italic mb-6">
            "The best investment you can make is in your people. Tutora makes that investment effortless, effective, and economical."
          </blockquote>
          
          <Link 
            href="/register"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
          >
            <span>Ready to join the training revolution?</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <p className="text-sm opacity-75 mt-6">
            Start Your Free Trial Today and see why 500+ companies trust Tutora for their employee training.
          </p>
        </div>
      </div>
    </div>
  )
} 