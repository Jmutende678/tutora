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
      
      // Save to activities table
      const activityRecord = {
        activity_type: activityData.type,
        details: `Activity: ${activityData.type} from ${activityData.source}`,
        metadata: {
          ...activityData.metadata,
          session_id: activityData.session_id,
          timestamp: activityData.timestamp,
          source: activityData.source,
          data: activityData.data,
          user_name: activityData.user_name,
          user_email: activityData.user_email,
          company: activityData.company,
          phone: activityData.phone,
          inquiry_type: activityData.inquiry_type,
          subject: activityData.subject,
          message: activityData.message,
          lead_score: activityData.lead_score
        },
        ip_address: activityData.metadata?.ip_address || 'unknown',
        user_agent: activityData.metadata?.user_agent || 'unknown'
      }
      
      const { error } = await supabase
        .from('activities')
        .insert([activityRecord])
      
      if (error) {
        console.error('Supabase insert error:', error)
        // Continue without failing - log to console instead
        console.log('💾 Activity logged to console (DB unavailable):', activityData)
      } else {
        console.log('✅ Activity saved to database')
      }
      
      // If it's a contact form submission, also save to contact_submissions table
      if (activityData.type === 'contact_form_submission' && activityData.user_email) {
        const contactRecord = {
          name: activityData.user_name || 'Unknown',
          email: activityData.user_email,
          company: activityData.company,
          subject: activityData.subject || 'Contact Form Submission',
          message: activityData.message || 'No message provided',
          status: 'new',
          source: activityData.source || 'website'
        }
        
        const { error: contactError } = await supabase
          .from('contact_submissions')
          .insert([contactRecord])
        
        if (contactError) {
          console.error('Contact submission insert error:', contactError)
        } else {
          console.log('✅ Contact submission saved to database')
        }
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