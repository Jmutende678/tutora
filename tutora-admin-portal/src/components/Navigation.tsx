import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ChevronDown, BarChart3, Users, Brain, Shield, Laptop, BookOpen, Award } from 'lucide-react'

export default function Navigation() {
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)

  const features = [
    { icon: Brain, title: 'AI Course Creation', description: 'Generate courses from your content', href: '/features/ai-course-creation' },
    { icon: BarChart3, title: 'Analytics Dashboard', description: 'Track team progress and ROI', href: '/features/analytics-dashboard' },
    { icon: Users, title: 'Team Management', description: 'Organize and assign training', href: '/features/team-management' },
    { icon: Shield, title: 'Enterprise Security', description: 'SOC2 and GDPR compliant', href: '/features/enterprise-security' },
    { icon: Laptop, title: 'Mobile Learning', description: 'Learn anywhere, anytime', href: '/features/mobile-learning' },
    { icon: BookOpen, title: 'Content Library', description: 'Pre-built courses and templates', href: '/features/content-library' }
  ]

  const solutions = [
    { title: 'HR Teams', description: 'Streamline onboarding and compliance training', href: '/solutions/hr-teams' },
    { title: 'Operations', description: 'Standardize processes and procedures', href: '/solutions/operations' },
    { title: 'Remote Teams', description: 'Keep distributed teams aligned and productive', href: '/solutions/remote-teams' },
    { title: 'Sales Teams', description: 'Accelerate sales enablement and product knowledge', href: '/solutions/sales-teams' }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-40 border-b border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-sm text-center">
          🎉 New: AI Module Builder now available! <Link href="/register" className="underline">Try it free</Link>
        </div>
      </div>
      
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-10 h-10">
            <Image 
              src="/tutora_logo.png" 
              alt="Tutora" 
              fill 
              className="object-contain" 
              priority 
            />
          </div>
          <span className="text-xl font-semibold">Tutora</span>
        </Link>
        
        <div className="hidden lg:flex items-center space-x-8">
          <div 
            className="relative group"
            onMouseEnter={() => setFeaturesOpen(true)}
            onMouseLeave={() => setFeaturesOpen(false)}
          >
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
              <span>Features</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {featuresOpen && (
              <div className="absolute top-full left-0 w-[600px] bg-white rounded-xl shadow-xl border border-gray-100 p-6 grid grid-cols-2 gap-4 z-50">
                {features.map((feature) => (
                  <Link 
                    key={feature.title}
                    href={feature.href}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <feature.icon className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">{feature.title}</div>
                      <div className="text-sm text-gray-600">{feature.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div 
            className="relative group"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
              <span>Solutions</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {solutionsOpen && (
              <div className="absolute top-full left-0 w-[400px] bg-white rounded-xl shadow-xl border border-gray-100 p-6 z-50">
                {solutions.map((solution) => (
                  <Link 
                    key={solution.title}
                    href={solution.href}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{solution.title}</div>
                    <div className="text-sm text-gray-600">{solution.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
          <Link href="/testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/admin/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
          <Link 
            href="/register" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>
    </header>
  )
} 