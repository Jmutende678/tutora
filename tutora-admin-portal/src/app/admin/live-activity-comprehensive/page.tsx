'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Button, Card, Badge, Section, typography } from '@/components/ui/DesignSystem'
import { cn } from '@/lib/utils'
import {
  Activity,
  Users,
  Mail,
  Phone,
  Building,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  MessageSquare,
  Globe,
  Smartphone,
  Monitor,
  MapPin,
  Calendar,
  Star,
  Zap,
  Target,
  Filter,
  Download,
  RefreshCw,
  Bot,
  Send
} from 'lucide-react'

interface ActivityEvent {
  id: string
  type: 'contact_form_submission' | 'registration_form_submission' | 'price_button_click' | 'ai_module_generation_started' | 'ai_module_generation_completed' | 'security_audit_form_submission' | 'account_registration_completed' | 'company_setup_completed' | 'user_profile_updated' | 'training_module_created' | 'training_module_published' | 'training_module_deleted' | 'page_view'
  user_email?: string
  user_name?: string
  company?: string
  phone?: string
  inquiry_type?: string
  subject?: string
  message?: string
  lead_score?: {
    score: number
    category: 'hot' | 'warm' | 'cold'
    reasons: string[]
  }
  data?: {
    plan_id?: string
    plan_name?: string
    billing_cycle?: string
    price?: string
    team_size?: string
    industry?: string
    urgency?: string
    primary_goal?: string
    job_title?: string
    company?: string
    email?: string
    name?: string
    recommended_plan?: string
    [key: string]: any
  }
  timestamp: string
  source: string
  metadata: {
    ip_address?: string
    user_agent?: string
    referrer?: string
    location?: {
      country?: string
      city?: string
    }
    device?: {
      type: 'desktop' | 'mobile' | 'tablet'
      os?: string
      browser?: string
    }
  }
}

interface LeadInsight {
  lead: ActivityEvent
  aiAnalysis: {
    urgency: 'high' | 'medium' | 'low'
    summary: string
    recommendedResponse: string
    nextSteps: string[]
    estimatedValue: number
  }
}

export default function ComprehensiveLiveActivityDashboard() {
  const router = useRouter()
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const [leadInsights, setLeadInsights] = useState<LeadInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all')
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [selectedLead, setSelectedLead] = useState<LeadInsight | null>(null)
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false)

  const loadActivityData = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Load website activity data
      const response = await fetch(`/api/analytics/live-activity?timeRange=${timeRange}`)
      const result = await response.json()
      
      if (result.success) {
        setActivities(result.data.activities || [])
        
        // Generate AI insights for high-value leads
        const highValueLeads = result.data.activities?.filter((activity: ActivityEvent) => 
          activity.type !== 'page_view' && 
          activity.lead_score && 
          activity.lead_score.score >= 40
        ) || []
        
        if (highValueLeads.length > 0) {
          generateLeadInsights(highValueLeads)
        }
      }
    } catch (error) {
      console.error('Failed to load activity data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    const role = localStorage.getItem('admin_role')
    if (!isAuthenticated || role !== 'ceo') {
      router.push('/admin/login')
      return
    }

    loadActivityData()
    
    // REAL auto-refresh every 5 seconds for live data
    const interval = setInterval(loadActivityData, 5000)
    return () => clearInterval(interval)
  }, [router, timeRange, loadActivityData])

  const generateLeadInsights = async (leads: ActivityEvent[]) => {
    try {
      const response = await fetch('/api/ai/lead-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads })
      })
      
      const result = await response.json()
      if (result.success) {
        setLeadInsights(result.insights)
      }
    } catch (error) {
      console.error('Failed to generate lead insights:', error)
    }
  }

  const generateAIResponse = async (lead: ActivityEvent) => {
    setIsGeneratingResponse(true)
    try {
      const response = await fetch('/api/ai/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead })
      })
      
      const result = await response.json()
      if (result.success) {
        // Update the selected lead with AI response
        setSelectedLead(prev => prev ? {
          ...prev,
          aiAnalysis: {
            ...prev.aiAnalysis,
            recommendedResponse: result.response
          }
        } : null)
      }
    } catch (error) {
      console.error('Failed to generate AI response:', error)
    } finally {
      setIsGeneratingResponse(false)
    }
  }

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true
    return activity.lead_score?.category === filter
  })

  const stats = {
    totalVisitors: activities.filter(a => a.type === 'page_view').length,
    totalLeads: activities.filter(a => a.type !== 'page_view' && a.lead_score).length, // All non-page-view activities with lead scores
    hotLeads: activities.filter(a => a.lead_score?.category === 'hot').length,
    warmLeads: activities.filter(a => a.lead_score?.category === 'warm').length,
    coldLeads: activities.filter(a => a.lead_score?.category === 'cold').length,
    conversionRate: activities.filter(a => a.type === 'page_view').length > 0 
      ? ((activities.filter(a => a.type !== 'page_view' && a.lead_score).length / activities.filter(a => a.type === 'page_view').length) * 100).toFixed(1)
      : '0'
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact_form_submission': return MessageSquare
      case 'registration_form_submission': return Users
      case 'price_button_click': return TrendingUp
      case 'ai_module_generation_started': return Bot
      case 'ai_module_generation_completed': return CheckCircle
      case 'security_audit_form_submission': return AlertCircle
      case 'account_registration_completed': return Users
      case 'company_setup_completed': return Building
      case 'user_profile_updated': return Users
      case 'training_module_created': return Target
      case 'training_module_published': return Send
      case 'training_module_deleted': return AlertCircle
      case 'page_view': return Globe
      case 'demo_request': return Eye
      case 'pricing_view': return Target
      case 'user_registration': return Users
      default: return Activity
    }
  }

  const getLeadCategoryColor = (category: string) => {
    switch (category) {
      case 'hot': return 'bg-red-100 text-red-800 border-red-200'
      case 'warm': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cold': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className={cn(typography.h2, "mb-2")}>
              Live Activity & Lead Intelligence
            </h1>
            <p className={cn(typography.body, "text-gray-600")}>
              Real-time visitor analytics, intelligent lead scoring, and automated response generation
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={loadActivityData}
              disabled={isLoading}
              icon={RefreshCw}
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalVisitors}</div>
              <div className="text-sm text-gray-600">Visitors</div>
            </div>
          </Card>
          
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalLeads}</div>
              <div className="text-sm text-gray-600">Total Leads</div>
            </div>
          </Card>
          
          <Card padding="sm">
            <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.hotLeads}</div>
                <div className="text-sm text-gray-600">Hot Leads</div>
            </div>
          </Card>
          
          <Card padding="sm">
            <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.warmLeads}</div>
                <div className="text-sm text-gray-600">Warm Leads</div>
            </div>
          </Card>
          
          <Card padding="sm">
            <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.coldLeads}</div>
                <div className="text-sm text-gray-600">Cold Leads</div>
            </div>
          </Card>
          
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.conversionRate}%</div>
              <div className="text-sm text-gray-600">Conversion</div>
            </div>
          </Card>
        </div>

        {/* Lead Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by lead temperature:</span>
          <div className="flex space-x-2">
            {(['all', 'hot', 'warm', 'cold'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium transition-all duration-200",
                  filter === filterType
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType !== 'all' && (
                  <span className="ml-1">
                    ({filterType === 'hot' ? stats.hotLeads : 
                      filterType === 'warm' ? stats.warmLeads : stats.coldLeads})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <Card padding="lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className={cn(typography.h3)}>Live Activity Feed</h2>
                <Badge variant="primary">
                  <Activity className="h-4 w-4 mr-1" />
                  {filteredActivities.length} activities
                </Badge>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type)
                  const isLead = activity.type !== 'page_view' // All activities except page views are leads
                  
                  return (
                    <div
                      key={activity.id}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md",
                        isLead && activity.lead_score?.category === 'hot' 
                          ? "border-red-200 bg-red-50"
                          : isLead && activity.lead_score?.category === 'warm'
                          ? "border-yellow-200 bg-yellow-50"
                          : isLead && activity.lead_score?.category === 'cold'
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200 bg-white"
                      )}
                      onClick={() => {
                        if (isLead) {
                          const insight = leadInsights.find(li => li.lead.id === activity.id)
                          if (insight) {
                            setSelectedLead(insight)
                          } else {
                            // Create a basic insight for activities without AI analysis
                            setSelectedLead({
                              lead: activity,
                              aiAnalysis: {
                                urgency: activity.lead_score?.score >= 70 ? 'high' : activity.lead_score?.score >= 40 ? 'medium' : 'low',
                                summary: `${activity.type.replace(/_/g, ' ')} from ${activity.source}`,
                                recommendedResponse: `Thank you for your interest in Tutora! We'll be in touch soon to discuss your ${activity.type.replace(/_/g, ' ')} needs.`,
                                nextSteps: [
                                  'Follow up within 24 hours',
                                  'Send personalized demo',
                                  'Schedule discovery call'
                                ],
                                estimatedValue: activity.lead_score?.score >= 90 ? 10000 : 
                                               activity.lead_score?.score >= 80 ? 7500 :
                                               activity.lead_score?.score >= 70 ? 5000 : 
                                               activity.lead_score?.score >= 60 ? 3000 :
                                               activity.lead_score?.score >= 40 ? 1500 : 750
                              }
                            })
                          }
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            isLead && activity.lead_score?.category === 'hot' 
                              ? "bg-red-600 text-white"
                              : isLead && activity.lead_score?.category === 'warm'
                              ? "bg-yellow-600 text-white"
                              : "bg-blue-600 text-white"
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {activity.user_name || 
                                 (activity.type === 'contact_form_submission' ? 'Contact Form Lead' :
                                  activity.type === 'registration_form_submission' ? 'Registration Lead' :
                                  activity.type === 'price_button_click' ? `${activity.data?.plan_name || 'Pricing'} Interest` :
                                  activity.type === 'ai_module_generation_started' ? 'AI Module Builder User' :
                                  activity.type === 'security_audit_form_submission' ? 'Security Audit Request' :
                                  'Anonymous Visitor')
                                }
                              </h3>
                              {isLead && activity.lead_score && (
                                <Badge
                                  variant={activity.lead_score.category === 'hot' ? 'warning' : 'primary'}
                                  size="sm"
                                >
                                  {activity.lead_score.category.toUpperCase()} ({activity.lead_score.score})
                                </Badge>
                              )}
                            </div>
                            
                            {activity.company && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <Building className="h-4 w-4 mr-1" />
                                {activity.company}
                              </p>
                            )}
                            
                            {activity.user_email && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                {activity.user_email}
                              </p>
                            )}
                            
                            {activity.phone && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {activity.phone}
                              </p>
                            )}
                            
                            {activity.subject && (
                              <p className="text-sm font-medium text-gray-800 mt-1">
                                "{activity.subject}"
                              </p>
                            )}
                            
                            {activity.message && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {activity.message}
                              </p>
                            )}

                            {/* Display rich form data */}
                            {activity.data && (
                              <div className="mt-2 space-y-1">
                                {activity.data.plan_name && (
                                  <p className="text-xs text-blue-600 font-medium">
                                    📋 Plan: {activity.data.plan_name} ({activity.data.billing_cycle}) - {activity.data.price}
                                  </p>
                                )}
                                {activity.data.team_size && (
                                  <p className="text-xs text-gray-600">
                                    👥 Team Size: {activity.data.team_size}
                                  </p>
                                )}
                                {activity.data.industry && (
                                  <p className="text-xs text-gray-600">
                                    🏢 Industry: {activity.data.industry}
                                  </p>
                                )}
                                {activity.data.urgency && (
                                  <p className="text-xs text-orange-600 font-medium">
                                    ⏰ Urgency: {activity.data.urgency}
                                  </p>
                                )}
                                {activity.data.primary_goal && (
                                  <p className="text-xs text-gray-600">
                                    🎯 Goal: {activity.data.primary_goal}
                                  </p>
                                )}
                                {activity.data.job_title && (
                                  <p className="text-xs text-gray-600">
                                    💼 Role: {activity.data.job_title}
                                  </p>
                                )}
                                {activity.inquiry_type && (
                                  <p className="text-xs text-purple-600 font-medium">
                                    📝 Inquiry: {activity.inquiry_type}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </div>
                          {activity.metadata.location && (
                            <div className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {activity.metadata.location.city}, {activity.metadata.location.country}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {filteredActivities.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No activity data for the selected time range.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* AI Lead Insights Panel */}
          <div>
            <Card padding="lg">
              <h2 className={cn(typography.h3, "mb-6")}>
                AI Lead Insights
              </h2>
              
              {selectedLead ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900">
                        {selectedLead.lead.user_name}
                      </h3>
                      <Badge
                        variant={selectedLead.lead.lead_score?.category === 'hot' ? 'warning' : 'primary'}
                        size="sm"
                      >
                        {selectedLead.lead.lead_score?.category.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong>Company:</strong> {selectedLead.lead.company}</p>
                      <p><strong>Email:</strong> {selectedLead.lead.user_email}</p>
                      <p><strong>Subject:</strong> {selectedLead.lead.subject}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {selectedLead.aiAnalysis.summary}
                    </p>
                    
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Estimated Value: </span>
                      <span className="text-lg font-bold text-green-600">
                        ${selectedLead.aiAnalysis.estimatedValue.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">Urgency: </span>
                      <Badge
                        variant={selectedLead.aiAnalysis.urgency === 'high' ? 'warning' : 'primary'}
                        size="sm"
                      >
                        {selectedLead.aiAnalysis.urgency.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Recommended Response</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateAIResponse(selectedLead.lead)}
                        disabled={isGeneratingResponse}
                        icon={Bot}
                      >
                        {isGeneratingResponse ? 'Generating...' : 'Regenerate'}
                      </Button>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm">
                      <pre className="whitespace-pre-wrap font-sans">
                        {selectedLead.aiAnalysis.recommendedResponse}
                      </pre>
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      <Button variant="primary" size="sm" icon={Send}>
                        Send Email
                      </Button>
                      <Button variant="outline" size="sm" icon={Phone}>
                        Schedule Call
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
                    <ul className="space-y-1">
                      {selectedLead.aiAnalysis.nextSteps.map((step, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-2">Select a lead to see AI insights</p>
                  <p className="text-sm">Click on any contact form submission to get AI-powered analysis and response recommendations.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
