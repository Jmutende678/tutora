import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService, ActivityEvent } from '@/lib/activity-tracker'

export async function POST(request: NextRequest) {
  try {
    const { events } = await request.json()

    if (!events || !Array.isArray(events)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid events data'
      }, { status: 400 })
    }

    // Validate events
    const validEvents: ActivityEvent[] = events.filter(event => 
      event.session_id && 
      event.event_type && 
      event.timestamp
    )

    if (validEvents.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid events provided'
      }, { status: 400 })
    }

    // Add IP address from request
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'

    validEvents.forEach(event => {
      event.ip_address = clientIP
    })

    // Save events to database
    await AnalyticsService.saveEvents(validEvents)

    console.log(`📊 Tracked ${validEvents.length} analytics events`)

    return NextResponse.json({
      success: true,
      message: `Tracked ${validEvents.length} events`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Analytics tracking error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to track events',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('company_id')
    const startDate = searchParams.get('start_date') ? new Date(searchParams.get('start_date')!) : undefined
    const endDate = searchParams.get('end_date') ? new Date(searchParams.get('end_date')!) : undefined

    const analytics = await AnalyticsService.getAnalytics(companyId || undefined, startDate, endDate)

    return NextResponse.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Analytics fetch error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
