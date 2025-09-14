'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Activity,
  Users,
  MousePointer,
  Eye,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  TrendingUp,
  BarChart3,
  Zap
} from 'lucide-react'

interface ActivityEvent {
  id: string
  event_type: string
  event_data: any
  page_url: string
  country?: string
  city?: string
  device_type: string
  browser: string
  timestamp: string
  user_id?: string
}

interface ActivitySummary {
  total_events: number
  unique_sessions: number
  page_views: number
  conversions: number
  button_clicks: number
  form_submissions: number
}

interface LiveStats {
  activeUsers: number
  pageViews: number
  topPages: Array<{ page: string; views: number }>
  topCountries: Array<{ country: string; users: number }>
  deviceBreakdown: { desktop: number; mobile: number; tablet: number }
  recentEvents: ActivityEvent[]
}

export default function LiveActivityDashboard() {
  const router = useRouter()
  const [liveStats, setLiveStats] = useState<LiveStats>({
    activeUsers: 0,
    pageViews: 0,
    topPages: [],
    topCountries: [],
    deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
    recentEvents: []
  })
  const [summary, setSummary] = useState<ActivitySummary>({
    total_events: 0,
    unique_sessions: 0,
    page_views: 0,
    conversions: 0,
    button_clicks: 0,
    form_submissions: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    const role = localStorage.getItem('admin_role')
    if (!isAuthenticated || (role !== 'ceo' && role !== 'admin')) {
      router.push('/admin/login')
      return
    }

    loadActivityData()
    
    // Set up real-time updates every 10 seconds
    const interval = setInterval(loadActivityData, 10000)
    return () => clearInterval(interval)
  }, [router, selectedTimeframe])

  const loadActivityData = async () => {
    try {
      console.log('🔍 Loading live activity data...')
      
      const endDate = new Date()
      const startDate = new Date()
      
      // Set time range based on selection
      switch (selectedTimeframe) {
        case '1h':
          startDate.setHours(startDate.getHours() - 1)
          break
        case '24h':
          startDate.setDate(startDate.getDate() - 1)
          break
        case '7d':
          startDate.setDate(startDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(startDate.getDate() - 30)
          break
      }

      const response = await fetch(
        `/api/analytics/live-activity?timeRange=${selectedTimeframe}`
      )
      const result = await response.json()

      if (result.success && result.data) {
        const { activities, stats: statsData } = result.data
        
        // Convert activities to events format for compatibility
        const events = activities.map((activity: any) => ({
          id: activity.id,
          event_type: activity.type,
          event_data: activity.data || {},
          page_url: activity.source || '/',
          country: activity.metadata?.location?.country,
          city: activity.metadata?.location?.city,
          device_type: activity.metadata?.device?.type || 'desktop',
          browser: activity.metadata?.device?.browser || 'unknown',
          timestamp: activity.timestamp,
          user_id: activity.metadata?.user_id
        }))
        
        // Create summary from stats
        const summaryData = {
          total_events: events.length,
          unique_sessions: new Set(events.map(e => e.event_data?.session_id).filter(Boolean)).size,
          page_views: events.filter(e => e.event_type === 'page_view').length,
          conversions: events.filter(e => e.event_type === 'contact_form_submission').length,
          button_clicks: events.filter(e => e.event_type === 'button_click').length,
          form_submissions: events.filter(e => e.event_type === 'contact_form_submission').length
        }
        
        setSummary(summaryData)
        
        // Process events for live stats
        const processedStats = processEventsForLiveStats(events)
        setLiveStats(processedStats)
        
        console.log('✅ Live activity data loaded:', {
          totalEvents: summaryData.total_events,
          uniqueSessions: summaryData.unique_sessions,
          activeUsers: processedStats.activeUsers,
          activities: activities.length
        })
      } else {
        console.error('❌ Failed to load activity data:', result.error)
      }
    } catch (error) {
      console.error('❌ Activity data loading error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const processEventsForLiveStats = (events: ActivityEvent[]): LiveStats => {
    const now = Date.now()
    const oneHourAgo = now - (60 * 60 * 1000)
    
    // Filter recent events (last hour for "active" users)
    const recentEvents = events.filter(event => 
      new Date(event.timestamp).getTime() > oneHourAgo
    )

    // Calculate active users (unique sessions in last hour)
    const activeSessions = new Set(
      recentEvents.map(event => event.event_data?.session_id).filter(Boolean)
    )

    // Calculate page views
    const pageViews = events.filter(event => event.event_type === 'page_view').length

    // Top pages
    const pageViewCounts: { [key: string]: number } = {}
    events.filter(event => event.event_type === 'page_view').forEach(event => {
      const page = new URL(event.page_url).pathname
      pageViewCounts[page] = (pageViewCounts[page] || 0) + 1
    })
    
    const topPages = Object.entries(pageViewCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([page, views]) => ({ page, views }))

    // Top countries
    const countryCounts: { [key: string]: Set<string> } = {}
    events.forEach(event => {
      if (event.country && event.event_data?.session_id) {
        if (!countryCounts[event.country]) {
          countryCounts[event.country] = new Set()
        }
        countryCounts[event.country].add(event.event_data.session_id)
      }
    })
    
    const topCountries = Object.entries(countryCounts)
      .map(([country, sessions]) => ({ country, users: sessions.size }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 5)

    // Device breakdown
    const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 }
    const deviceSessions = new Set()
    
    events.forEach(event => {
      const sessionId = event.event_data?.session_id
      if (sessionId && !deviceSessions.has(sessionId)) {
        deviceSessions.add(sessionId)
        if (event.device_type in deviceCounts) {
          deviceCounts[event.device_type as keyof typeof deviceCounts]++
        }
      }
    })

    // Recent events (last 20)
    const sortedRecentEvents = events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20)

    return {
      activeUsers: activeSessions.size,
      pageViews,
      topPages,
      topCountries,
      deviceBreakdown: deviceCounts,
      recentEvents: sortedRecentEvents
    }
  }

  const formatEventType = (eventType: string) => {
    return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'page_view': return <Eye className="h-4 w-4" />
      case 'click': return <MousePointer className="h-4 w-4" />
      case 'button_click': return <MousePointer className="h-4 w-4" />
      case 'form_submit': return <Zap className="h-4 w-4" />
      case 'contact_form_submission': return <Zap className="h-4 w-4" />
      case 'registration_form_submission': return <Users className="h-4 w-4" />
      case 'ai_module_generation_started': return <Activity className="h-4 w-4" />
      case 'ai_module_generation_completed': return <TrendingUp className="h-4 w-4" />
      case 'conversion': return <TrendingUp className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-5 w-5" />
      case 'tablet': return <Tablet className="h-5 w-5" />
      default: return <Monitor className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading live activity data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Live Activity Dashboard</h1>
              <p className="text-slate-600 mt-2">
                Real-time website activity and user behavior analytics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{liveStats.activeUsers}</p>
                <p className="text-sm text-green-600 mt-1">Currently online</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">{liveStats.pageViews}</p>
                <p className="text-sm text-blue-600 mt-1">Total views</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{summary.total_events}</p>
                <p className="text-sm text-purple-600 mt-1">All interactions</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Conversions</p>
                <p className="text-2xl font-bold text-gray-900">{summary.conversions}</p>
                <p className="text-sm text-orange-600 mt-1">Goal completions</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Pages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Top Pages</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {liveStats.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="text-sm text-gray-900">{page.page}</span>
                    </div>
                    <span className="text-sm font-medium text-blue-600">{page.views} views</span>
                  </div>
                ))}
                {liveStats.topPages.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No page data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Device Breakdown</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(liveStats.deviceBreakdown).map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getDeviceIcon(device)}
                      <span className="text-sm text-gray-900 capitalize">{device}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{count} users</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-600">Live user interactions on your website</p>
          </div>
          <div className="divide-y divide-gray-200">
            {liveStats.recentEvents.map((event, index) => (
              <div key={`${event.id}-${index}`} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getEventIcon(event.event_type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatEventType(event.event_type)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new URL(event.page_url).pathname}
                      </p>
                      {event.event_data?.button_text && (
                        <p className="text-xs text-blue-600">
                          Button: "{event.event_data.button_text}"
                        </p>
                      )}
                      {event.event_data?.user_name && (
                        <p className="text-xs text-green-600">
                          User: {event.event_data.user_name}
                        </p>
                      )}
                      {event.event_data?.user_email && (
                        <p className="text-xs text-blue-600">
                          Email: {event.event_data.user_email}
                        </p>
                      )}
                      {event.event_data?.company && (
                        <p className="text-xs text-purple-600">
                          Company: {event.event_data.company}
                        </p>
                      )}
                      {event.event_data?.team_size && (
                        <p className="text-xs text-orange-600">
                          Team Size: {event.event_data.team_size}
                        </p>
                      )}
                      {event.event_data?.industry && (
                        <p className="text-xs text-indigo-600">
                          Industry: {event.event_data.industry}
                        </p>
                      )}
                      {event.event_data?.urgency && (
                        <p className="text-xs text-red-600">
                          Urgency: {event.event_data.urgency}
                        </p>
                      )}
                      {event.event_data?.subject && (
                        <p className="text-xs text-gray-600">
                          Subject: {event.event_data.subject}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {event.country && (
                        <>
                          <MapPin className="h-3 w-3" />
                          <span>{event.country}</span>
                        </>
                      )}
                      {getDeviceIcon(event.device_type)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {liveStats.recentEvents.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No recent activity data available
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
