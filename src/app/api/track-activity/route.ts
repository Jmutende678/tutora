import { NextRequest, NextResponse } from 'next/server'

interface ActivityEvent {
  type: 'page_view' | 'contact_form' | 'ai_demo_start' | 'ai_demo_complete' | 'registration' | 'pricing_click' | 'button_click'
  user?: {
    name?: string
    email?: string
    company?: string
    phone?: string
    teamSize?: string
  }
  page?: string
  duration?: number
  data?: any
  timestamp: string
  userAgent: string
  ip: string
}

// In-memory storage for demo (in production, use Redis or database)
let activityLog: ActivityEvent[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const ip = request.headers.get('x-forwarded-for') || 'Unknown'
    
    const activity: ActivityEvent = {
      ...body,
      timestamp: new Date().toISOString(),
      userAgent,
      ip
    }
    
    // Add to activity log
    activityLog.unshift(activity)
    
    // Keep only last 1000 activities
    if (activityLog.length > 1000) {
      activityLog = activityLog.slice(0, 1000)
    }
    
    // Log important activities
    if (['contact_form', 'ai_demo_complete', 'registration'].includes(activity.type)) {
      console.log(`🔥 HIGH VALUE ACTIVITY: ${activity.type}`)
      console.log(`User: ${activity.user?.name || 'Anonymous'} (${activity.user?.email || 'No email'})`)
      console.log(`Company: ${activity.user?.company || 'Unknown'}`)
      console.log(`Data:`, activity.data)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Activity tracked successfully',
      activityId: Date.now().toString()
    })
    
  } catch (error) {
    console.error('❌ Error tracking activity:', error)
    return NextResponse.json(
      { error: 'Failed to track activity' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const type = url.searchParams.get('type')
    
    let filteredActivities = activityLog
    
    if (type) {
      filteredActivities = activityLog.filter(activity => activity.type === type)
    }
    
    const activities = filteredActivities.slice(0, limit)
    
    // Calculate stats
    const stats = {
      total: activityLog.length,
      today: activityLog.filter(a => 
        new Date(a.timestamp).toDateString() === new Date().toDateString()
      ).length,
      hotLeads: activityLog.filter(a => 
        ['ai_demo_complete', 'contact_form'].includes(a.type) &&
        new Date(a.timestamp).toDateString() === new Date().toDateString()
      ).length,
      registrations: activityLog.filter(a => a.type === 'registration').length,
      aiDemos: activityLog.filter(a => a.type === 'ai_demo_complete').length
    }
    
    return NextResponse.json({
      success: true,
      activities,
      stats,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}
