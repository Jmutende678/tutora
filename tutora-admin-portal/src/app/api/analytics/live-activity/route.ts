import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '24h'
    
    // Calculate time filter
    const now = new Date()
    let startTime: Date
    
    switch (timeRange) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }
    
    try {
      console.log('🔍 Dashboard API: Connecting to Supabase...')
      console.log('📊 Supabase URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('🔑 Service key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
      
      // Connect to Supabase
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      console.log('✅ Supabase client created')
      
      console.log('🔍 Querying from:', startTime.toISOString(), 'to now')
      
      // Fetch contact form submissions
      const { data: contactSubmissions, error: contactError } = await supabase
        .from('contact_submissions')
        .select('*')
        .gte('created_at', startTime.toISOString())
        .order('created_at', { ascending: false })
        .limit(50)
      
      // Fetch activities from the activities table
      const { data: activities, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .gte('created_at', startTime.toISOString())
        .order('created_at', { ascending: false })
        .limit(50)
      
      // Combine and format the data
      const allActivities = []
      
      // Add contact submissions
      if (contactSubmissions) {
        contactSubmissions.forEach(submission => {
          allActivities.push({
            id: submission.id,
            type: 'contact_form_submission',
            user_email: submission.email,
            user_name: submission.name,
            company: submission.company,
            subject: submission.subject,
            message: submission.message,
            lead_score: {
              score: 75, // Default score for contact forms
              category: 'warm',
              reasons: ['Contact form submission', 'Direct inquiry']
            },
            data: {
              inquiry_type: 'contact',
              source: submission.source || 'website'
            },
            timestamp: submission.created_at,
            source: submission.source || '/contact',
            metadata: {
              form_data: submission,
              status: submission.status
            }
          })
        })
      }
      
      // Add other activities
      if (activities) {
        activities.forEach(activity => {
          allActivities.push({
            id: activity.id,
            type: activity.activity_type,
            user_email: activity.metadata?.email,
            user_name: activity.metadata?.name,
            company: activity.metadata?.company,
            data: activity.metadata || {},
            timestamp: activity.created_at,
            source: activity.metadata?.source || 'unknown',
            metadata: {
              details: activity.details,
              ip_address: activity.ip_address,
              user_agent: activity.user_agent
            }
          })
        })
      }
      
      // Sort by timestamp
      allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      
      const error = contactError || activitiesError
      
      console.log('📊 Query result - Total activities count:', allActivities.length)
      console.log('📊 Contact submissions:', contactSubmissions?.length || 0)
      console.log('📊 Other activities:', activities?.length || 0)
      console.log('❌ Query error:', error)
      
      if (allActivities.length > 0) {
        console.log('🔍 Sample activity data:', JSON.stringify(allActivities[0], null, 2))
        console.log('🎯 Activities with lead scores:', allActivities.filter(a => a.lead_score).length)
        console.log('🔥 Hot leads:', allActivities.filter(a => a.lead_score?.category === 'hot').length)
        console.log('🌡️ Warm leads:', allActivities.filter(a => a.lead_score?.category === 'warm').length)
        console.log('❄️ Cold leads:', allActivities.filter(a => a.lead_score?.category === 'cold').length)
      }
      
      if (error) {
        console.error('Supabase query error:', error)
        // Return empty data instead of mock data
        return NextResponse.json({
          success: true,
          data: {
            activities: [],
            stats: {
              totalVisitors: 0,
              totalLeads: 0,
              hotLeads: 0,
              warmLeads: 0,
              coldLeads: 0,
              conversionRate: '0'
            },
            timeRange,
            lastUpdated: new Date().toISOString(),
            note: 'Database query error - no mock data'
          }
        })
      }
      
      console.log('✅ Query successful! Found activities:', allActivities.length)
      
      // Calculate real-time stats
      const stats = {
        totalVisitors: allActivities.filter(a => a.type === 'page_view').length,
        totalLeads: allActivities.filter(a => a.type === 'contact_form_submission').length,
        hotLeads: allActivities.filter(a => a.lead_score?.category === 'hot').length,
        warmLeads: allActivities.filter(a => a.lead_score?.category === 'warm').length,
        coldLeads: allActivities.filter(a => a.lead_score?.category === 'cold').length,
        conversionRate: allActivities.length > 0 
          ? ((allActivities.filter(a => a.type === 'contact_form_submission').length / allActivities.length) * 100).toFixed(1)
          : '0'
      }
      
      return NextResponse.json({
        success: true,
        data: {
          activities: allActivities,
          stats,
          timeRange,
          lastUpdated: new Date().toISOString()
        }
      })
      
    } catch (dbError) {
      console.error('❌ Database connection error in dashboard API:', dbError)
      console.error('❌ Error details:', JSON.stringify(dbError, null, 2))
      
      // Return empty data instead of mock data
      return NextResponse.json({
        success: true,
        data: {
          activities: [],
          stats: {
            totalVisitors: 0,
            totalLeads: 0,
            hotLeads: 0,
            warmLeads: 0,
            coldLeads: 0,
            conversionRate: '0'
          },
          timeRange,
          lastUpdated: new Date().toISOString(),
          note: 'Database connection unavailable - no mock data'
        }
      })
    }
    
  } catch (error) {
    console.error('Live activity API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch activity data',
      data: {
        activities: [],
        stats: { totalVisitors: 0, totalLeads: 0, hotLeads: 0, warmLeads: 0, coldLeads: 0, conversionRate: '0' }
      }
    }, { status: 500 })
  }
}

// Real-time activity tracking - NO MOCK DATA
