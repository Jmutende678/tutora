'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  DollarSign,
  TrendingUp,
  Building2,
  Users,
  BarChart3,
  Activity,
  Globe,
  Clock,
  Award,
  Zap,
  Brain,
  Target,
  Mail,
  Eye,
  Flame,
  Copy,
  Send,
  Phone
} from 'lucide-react'
import Chart from '@/components/Chart'

interface BusinessMetrics {
  revenue: number
  growth: number
  companies: number
  users: number
  retention: number
  satisfaction: number
}

interface RevenueData {
  name: string
  revenue: number
  users: number
  companies: number
}

export default function CEODashboard() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    revenue: 0,
    growth: 0,
    companies: 0,
    users: 0,
    retention: 0,
    satisfaction: 0
  })

  const [revenueData, setRevenueData] = useState<RevenueData[]>([])

  useEffect(() => {
    // Check authentication and role
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    const role = localStorage.getItem('admin_role')
    if (!isAuthenticated || role !== 'ceo') {
      router.push('/admin/login')
      return
    }

    // Load demo data
    setMetrics({
      revenue: 1250000,
      growth: 28,
      companies: 156,
      users: 3420,
      retention: 92,
      satisfaction: 4.8
    })

    setRevenueData([
      { name: 'Jan', revenue: 980000, users: 2800, companies: 120 },
      { name: 'Feb', revenue: 1050000, users: 3000, companies: 135 },
      { name: 'Mar', revenue: 1150000, users: 3200, companies: 142 },
      { name: 'Apr', revenue: 1250000, users: 3420, companies: 156 }
    ])
  }, [router])

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${(metrics.revenue / 1000).toFixed(1)}K`,
      change: `+${metrics.growth}%`,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Companies',
      value: metrics.companies.toString(),
      change: '+12%',
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Users',
      value: metrics.users.toLocaleString(),
      change: '+15%',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'User Retention',
      value: `${metrics.retention}%`,
      change: '+5%',
      icon: Target,
      color: 'bg-orange-500'
    }
  ]

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">CEO Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Welcome back! Here's your business performance overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <span className="ml-2 text-sm font-medium text-green-600">{stat.change}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-slate-900 rounded-xl shadow-xl border border-slate-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Revenue & Growth</h2>
              <p className="text-slate-400">Monthly performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">
                Monthly
              </button>
              <button className="text-slate-400 px-4 py-2 rounded-lg hover:bg-slate-800">
                Quarterly
              </button>
              <button className="text-slate-400 px-4 py-2 rounded-lg hover:bg-slate-800">
                Yearly
              </button>
            </div>
          </div>
          <Chart data={revenueData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Business Health */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Business Health</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Customer Satisfaction</p>
                      <p className="text-2xl font-bold text-slate-900">{metrics.satisfaction}/5.0</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">+0.3</p>
                    <p className="text-xs text-slate-500">vs last month</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Global Reach</p>
                      <p className="text-2xl font-bold text-slate-900">28</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">+3</p>
                    <p className="text-xs text-slate-500">new countries</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Avg. Contract Duration</p>
                      <p className="text-2xl font-bold text-slate-900">18 months</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">+2 months</p>
                    <p className="text-xs text-slate-500">vs last year</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Opportunities */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Growth Opportunities</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-medium text-blue-900">AI Integration</h3>
                    </div>
                    <span className="text-blue-600 font-medium">+45% growth potential</span>
                  </div>
                  <p className="text-sm text-blue-700">Expand AI-powered learning features to attract enterprise clients</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-medium text-purple-900">Market Expansion</h3>
                    </div>
                    <span className="text-purple-600 font-medium">5 target markets</span>
                  </div>
                  <p className="text-sm text-purple-700">Enter new geographic markets with localized content</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-medium text-green-900">Enterprise Solutions</h3>
                    </div>
                    <span className="text-green-600 font-medium">+60% revenue potential</span>
                  </div>
                  <p className="text-sm text-green-700">Develop custom enterprise learning solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Dashboard */}
        <LiveActivitySection />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="h-8 w-8" />
              <h3 className="text-lg font-semibold">Financial Reports</h3>
            </div>
            <p className="text-blue-100 mb-4">View detailed financial analytics</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
              View Reports
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Building2 className="h-8 w-8" />
              <h3 className="text-lg font-semibold">Company Overview</h3>
            </div>
            <p className="text-purple-100 mb-4">Monitor company performance</p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
              View Details
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="h-8 w-8" />
              <h3 className="text-lg font-semibold">Strategic Planning</h3>
            </div>
            <p className="text-green-100 mb-4">Update business strategies</p>
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
              Start Planning
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Live Activity Section Component
function LiveActivitySection() {
  const [activities, setActivities] = useState<any[]>([])
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [generatedEmail, setGeneratedEmail] = useState('')
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false)
  const [stats, setStats] = useState({
    hotLeads: 0,
    aiDemos: 0,
    registrations: 0,
    contacts: 0
  })

  // Fetch activities
  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/track-activity?limit=20')
      if (response.ok) {
        const data = await response.json()
        if (data.activities && data.activities.length > 0) {
          setActivities(data.activities)
        }
        
        if (data.stats) {
          setStats({
            hotLeads: data.stats.hotLeads,
            aiDemos: data.stats.aiDemos,
            registrations: data.stats.registrations,
            contacts: data.stats.contacts
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    }
  }

  useEffect(() => {
    fetchActivities()
    const interval = setInterval(fetchActivities, 30000)
    return () => clearInterval(interval)
  }, [])

  const generateFollowUpEmail = async (activity: any) => {
    setIsGeneratingEmail(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    let emailTemplate = ''
    
    if (activity.type === 'ai_demo_complete') {
      emailTemplate = `Subject: 🚀 Your AI Training Module is Ready - Let's Scale This!

Hi ${activity.user?.name || 'there'},

I saw you just completed our AI module builder demo - that's exactly the kind of innovative thinking we love to see!

With your team at ${activity.user?.company || 'your company'}, you're perfectly positioned to transform your entire training program.

🎯 **Immediate Next Steps:**
• 15-minute strategy call this week
• Custom demo with your actual content
• Pilot program for your team

💰 **ROI Calculator:**
• Current training cost: ~$${Math.floor(Math.random() * 50 + 20)}K/year
• Tutora savings: 65% cost reduction
• Time savings: 10x faster module creation

🔥 **Limited Time:**
I can offer you our "Early Adopter" package with:
• 50% off first year
• Free migration of existing content
• Dedicated success manager

Are you free for a quick call this week?

Best regards,
John Mutende
CEO, Tutora
📞 +61479087048`

    } else if (activity.type === 'contact_form') {
      emailTemplate = `Subject: Re: ${activity.data?.subject || 'Your Inquiry'}

Hi ${activity.user?.name || 'there'},

Thanks for reaching out! I personally review every inquiry, and yours caught my attention.

${activity.user?.company || 'Your company'} sounds like exactly the type of forward-thinking organization we love working with.

Based on your message, I think we can help you achieve:
✅ 65% reduction in training costs
✅ 10x faster content creation
✅ 92% higher learner engagement

I'd love to show you a personalized demo using your actual training content.

Are you available for a 15-minute call this week?

Best regards,
John Mutende
CEO, Tutora
📞 +61479087048`
    }
    
    setGeneratedEmail(emailTemplate)
    setIsGeneratingEmail(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Email copied to clipboard!')
  }

  return (
    <div className="mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            🔥 Live Website Activity
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              LIVE
            </span>
          </h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Hot Leads Today</p>
                <p className="text-2xl font-bold text-red-600">{stats.hotLeads}</p>
              </div>
              <Flame className="h-6 w-6 text-red-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">AI Demos</p>
                <p className="text-2xl font-bold text-purple-600">{stats.aiDemos}</p>
              </div>
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Registrations</p>
                <p className="text-2xl font-bold text-green-600">{stats.registrations}</p>
              </div>
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Contact Forms</p>
                <p className="text-2xl font-bold text-blue-600">{stats.contacts}</p>
              </div>
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Feed */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activities.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No activity yet. Activity will appear here as users interact with your website.</p>
                </div>
              ) : (
                activities.slice(0, 5).map((activity, index) => (
                  <div 
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {activity.type === 'contact_form' && <Mail className="h-4 w-4 text-blue-600 mt-1" />}
                        {activity.type === 'ai_demo_complete' && <Zap className="h-4 w-4 text-purple-600 mt-1" />}
                        {activity.type === 'registration' && <Users className="h-4 w-4 text-green-600 mt-1" />}
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900 text-sm">
                              {activity.user?.name || 'Anonymous User'}
                            </span>
                            {(activity.type === 'contact_form' || activity.type === 'ai_demo_complete') && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                🔥 HOT
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {activity.user?.email || 'No email'} • {activity.user?.company || 'No company'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Email Generator */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Management</h3>
            {selectedActivity ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {selectedActivity.user?.name || 'Anonymous User'}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3" />
                      <span>{selectedActivity.user?.email || 'No email'}</span>
                    </div>
                    {selectedActivity.user?.company && (
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-3 w-3" />
                        <span>{selectedActivity.user.company}</span>
                      </div>
                    )}
                    {selectedActivity.user?.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3" />
                        <span>{selectedActivity.user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => generateFollowUpEmail(selectedActivity)}
                  disabled={isGeneratingEmail}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isGeneratingEmail ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Generate Follow-up Email</span>
                    </>
                  )}
                </button>

                {generatedEmail && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-900">Generated Email:</h5>
                      <button
                        onClick={() => copyToClipboard(generatedEmail)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 max-h-48 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-xs text-gray-700">
                        {generatedEmail}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Select an activity to view lead details and generate follow-up emails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 