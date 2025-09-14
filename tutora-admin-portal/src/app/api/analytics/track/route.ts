import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🚨 API ROUTE HIT: /api/analytics/track')
  try {
    console.log('🔥 ACTIVITY TRACKING API CALLED!')
    
    const rawBody = await request.text()
    console.log('📝 Raw request body:', rawBody)
    
    const activityData = JSON.parse(rawBody)
    console.log('📊 Parsed activity data:', activityData)
    
    console.log('📊 REAL Activity Tracked:', {
      type: activityData.type,
      timestamp: activityData.timestamp,
      source: activityData.source,
      session_id: activityData.session_id,
      full_data: activityData
    })
    
    // Try to save to Supabase database
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      const { error } = await supabase
        .from('website_activity')
        .insert([{
          id: activityData.id,
          type: activityData.type,
          user_id: activityData.user_id,
          session_id: activityData.session_id,
          timestamp: activityData.timestamp,
          source: activityData.source,
          metadata: activityData.metadata,
          user_name: activityData.user_name,
          user_email: activityData.user_email,
          company: activityData.company,
          phone: activityData.phone,
          inquiry_type: activityData.inquiry_type,
          subject: activityData.subject,
          message: activityData.message,
          lead_score: activityData.lead_score
        }])
      
      if (error) {
        console.error('Supabase insert error:', error)
        // Continue without failing - log to console instead
        console.log('💾 Activity logged to console (DB unavailable):', activityData)
      } else {
        console.log('✅ Activity saved to database')
      }
      
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      console.log('💾 Activity logged to console (DB unavailable):', activityData)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Activity tracked successfully',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Activity tracking API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to track activity'
    }, { status: 500 })
  }
}

// Handle GET requests for health check
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'activity-tracking',
    timestamp: new Date().toISOString()
  })
}