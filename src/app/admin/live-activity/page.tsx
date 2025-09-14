'use client'

import { useState, useEffect } from 'react'
import CEOLogin from './login'
import { 
  Activity, 
  Users, 
  Mail, 
  Clock, 
  Eye, 
  MousePointer, 
  TrendingUp,
  Copy,
  Send,
  Zap,
  Building,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  Flame,
  Target,
  LogOut
} from 'lucide-react'

interface ActivityLog {
  id: string
  timestamp: Date
  type: 'contact' | 'registration' | 'ai_demo' | 'page_view' | 'pricing_click' | 'demo_start' | 'demo_complete'
  user: {
    name?: string
    email?: string
    company?: string
    phone?: string
    teamSize?: string
  }
  data: any
  priority: 'hot' | 'warm' | 'cold'
}

const mockActivityData: ActivityLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    type: 'ai_demo',
    user: {
      name: 'John Mutende',
      email: 'johnmutende2@gmail.com',
      company: 'Tutora',
      teamSize: '101-250'
    },
    data: {
      moduleTitle: 'Cybersecurity Training Module',
      duration: '8 minutes',
      completed: true
    },
    priority: 'hot'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    type: 'contact',
    user: {
      name: 'Sarah Johnson',
      email: 'sarah@techcorp.com',
      company: 'TechCorp Inc',
      phone: '+1 555-123-4567'
    },
    data: {
      subject: 'Enterprise Pricing Inquiry',
      message: 'We need training for 500+ employees...',
      inquiryType: 'sales'
    },
    priority: 'hot'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    type: 'registration',
    user: {
      name: 'Mike Chen',
      email: 'mike@startup.io',
      company: 'StartupIO',
      teamSize: '11-50'
    },
    data: {
      plan: 'Growth',
      urgency: 'immediately',
      industry: 'Technology'
    },
    priority: 'warm'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    type: 'pricing_click',
    user: {
      email: 'anonymous@visitor.com'
    },
    data: {
      plan: 'Professional',
      page: '/pricing',
      duration: '3 minutes'
    },
    priority: 'cold'
  }
]

export default function LiveActivityDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activities, setActivities] = useState<ActivityLog[]>(mockActivityData)
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null)
  const [generatedEmail, setGeneratedEmail] = useState('')
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false)
  const [stats, setStats] = useState({
    hotLeads: 0,
    aiDemos: 0,
    registrations: 0,
    contacts: 0
  })

  // Check authentication on component mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem('ceo_authenticated') === 'true'
    setIsAuthenticated(isAuth)
  }, [])

  // Fetch real activity data
  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/track-activity?limit=50')
      if (response.ok) {
        const data = await response.json()
        if (data.activities && data.activities.length > 0) {
          // Convert API data to our format
          const convertedActivities = data.activities.map((activity: any) => ({
            id: activity.timestamp,
            timestamp: new Date(activity.timestamp),
            type: activity.type === 'contact_form' ? 'contact' : 
                  activity.type === 'ai_demo_complete' ? 'ai_demo' : 
                  activity.type,
            user: activity.user || {},
            data: activity.data || {},
            priority: activity.type === 'ai_demo_complete' || activity.type === 'contact_form' ? 'hot' :
                     activity.type === 'registration' ? 'warm' : 'cold'
          }))
          setActivities(convertedActivities)
        }
        
        if (data.stats) {
          setStats({
            hotLeads: data.stats.hotLeads,
            aiDemos: data.stats.aiDemos,
            registrations: data.stats.registrations,
            contacts: activities.filter(a => a.type === 'contact').length
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    }
  }

  // Real-time updates
  useEffect(() => {
    fetchActivities() // Initial load
    
    const interval = setInterval(() => {
      fetchActivities() // Refresh every 30 seconds
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <CEOLogin onLogin={() => setIsAuthenticated(true)} />
  }

  const generateFollowUpEmail = async (activity: ActivityLog) => {
    setIsGeneratingEmail(true)
    
    // Simulate AI email generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    let emailTemplate = ''
    
    if (activity.type === 'ai_demo' && activity.data.completed) {
      emailTemplate = `Subject: 🚀 Your AI Training Module is Ready - Let's Scale This!

Hi ${activity.user.name},

I saw you just completed our AI module builder demo and created "${activity.data.moduleTitle}" - that's exactly the kind of innovative thinking we love to see!

With ${activity.user.teamSize} employees at ${activity.user.company}, you're perfectly positioned to transform your entire training program. Here's what I'm thinking:

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

Are you free for a quick call tomorrow or Thursday? I'd love to show you how companies like yours are saving 6-figures annually.

Best regards,
John Mutende
CEO, Tutora
📞 +61479087048
🗓️ Book a call: calendly.com/tutora-ceo`

    } else if (activity.type === 'contact') {
      emailTemplate = `Subject: Re: ${activity.data.subject}

Hi ${activity.user.name},

Thanks for reaching out about ${activity.data.subject}. I personally review every inquiry, and yours caught my attention.

${activity.user.company} sounds like exactly the type of forward-thinking company we love working with. Based on your message, I think we can help you achieve:

✅ 65% reduction in training costs
✅ 10x faster content creation
✅ 92% higher learner engagement

I'd love to show you a personalized demo using your actual training content. 

Are you available for a 15-minute call this week? I can show you:
• Live demo with your content
• ROI calculator for your team size
• Case studies from similar companies

Best time to reach you at ${activity.user.phone || 'your preferred number'}?

Looking forward to helping ${activity.user.company} revolutionize your training!

John Mutende
CEO, Tutora
📞 +61479087048`

    } else if (activity.type === 'registration') {
      emailTemplate = `Subject: Welcome to Tutora, ${activity.user.name}! Let's Get You Started 🚀

Hi ${activity.user.name},

Welcome to the Tutora family! I'm John, the CEO, and I personally welcome every new member.

I see you're interested in our ${activity.data.plan} plan for ${activity.user.company}. With ${activity.user.teamSize} employees, you're going to see incredible results.

🎯 **Your Success Plan:**
Week 1: Upload your first training content
Week 2: Generate 5 AI modules
Week 3: Deploy to your team
Week 4: Measure engagement (expect 90%+ completion rates)

💡 **Pro Tip:** Companies your size typically see:
• $${Math.floor(Math.random() * 100 + 50)}K annual savings
• 75% faster onboarding
• 40% better compliance scores

Want to fast-track your success? I'm offering a free 30-minute strategy session where I'll:
• Review your current training challenges
• Create a custom implementation plan
• Show you advanced features

Book a time that works: calendly.com/tutora-ceo

Excited to see what you build!

John Mutende
CEO & Founder, Tutora`
    }
    
    setGeneratedEmail(emailTemplate)
    setIsGeneratingEmail(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Email copied to clipboard!')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'hot': return 'text-red-600 bg-red-50 border-red-200'
      case 'warm': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'cold': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'hot': return <Flame className="h-4 w-4" />
      case 'warm': return <Target className="h-4 w-4" />
      case 'cold': return <Eye className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact': return <Mail className="h-5 w-5 text-blue-600" />
      case 'registration': return <Users className="h-5 w-5 text-green-600" />
      case 'ai_demo': return <Zap className="h-5 w-5 text-purple-600" />
      case 'pricing_click': return <TrendingUp className="h-5 w-5 text-orange-600" />
      default: return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Website Activity</h1>
            <p className="text-gray-600">Real-time tracking of leads, demos, and website engagement</p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('ceo_authenticated')
              setIsAuthenticated(false)
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hot Leads Today</p>
                <p className="text-2xl font-bold text-red-600">{stats.hotLeads}</p>
                <p className="text-xs text-gray-500">AI demos + Contact forms</p>
              </div>
              <Flame className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Demos Completed</p>
                <p className="text-2xl font-bold text-purple-600">{stats.aiDemos}</p>
                <p className="text-xs text-gray-500">High-intent prospects</p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Registrations</p>
                <p className="text-2xl font-bold text-green-600">{stats.registrations}</p>
                <p className="text-xs text-gray-500">Warm prospects</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contact Forms</p>
                <p className="text-2xl font-bold text-blue-600">{stats.contacts}</p>
                <p className="text-xs text-gray-500">General inquiries</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity Feed */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Live Activity Feed
              </h2>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {activities.map((activity) => (
                <div 
                  key={activity.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {activity.user.name || 'Anonymous User'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs border flex items-center space-x-1 ${getPriorityColor(activity.priority)}`}>
                            {getPriorityIcon(activity.priority)}
                            <span className="capitalize">{activity.priority}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {activity.user.email} • {activity.user.company}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {activity.type.replace('_', ' ')} • {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Details & Email Generator */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Lead Management
              </h2>
            </div>
            
            {selectedActivity ? (
              <div className="p-6">
                {/* Lead Details */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedActivity.user.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm border flex items-center space-x-1 ${getPriorityColor(selectedActivity.priority)}`}>
                      {getPriorityIcon(selectedActivity.priority)}
                      <span className="capitalize">{selectedActivity.priority} Lead</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedActivity.user.email}</span>
                    </div>
                    {selectedActivity.user.company && (
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span>{selectedActivity.user.company}</span>
                      </div>
                    )}
                    {selectedActivity.user.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedActivity.user.phone}</span>
                      </div>
                    )}
                    {selectedActivity.user.teamSize && (
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{selectedActivity.user.teamSize} employees</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{selectedActivity.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Generate Email Button */}
                <button
                  onClick={() => generateFollowUpEmail(selectedActivity)}
                  disabled={isGeneratingEmail}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isGeneratingEmail ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating Email...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      <span>Generate Follow-up Email</span>
                    </>
                  )}
                </button>

                {/* Generated Email */}
                {generatedEmail && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Generated Email:</h4>
                      <button
                        onClick={() => copyToClipboard(generatedEmail)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                        {generatedEmail}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Select an activity to view lead details and generate follow-up emails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
