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
      
      // Fetch ONLY real website visitor activity (public pages only)
      const { data: activities, error } = await supabase
        .from('website_activity')
        .select('*')
        .gte('timestamp', startTime.toISOString())
        .in('source', ['/', '/about', '/contact', '/pricing', '/features', '/register', '/demo/ai-module-builder', '/solutions', '/testimonials', '/blog', '/careers', '/faq'])
        .order('timestamp', { ascending: false })
        .limit(100)
      
      console.log('📊 Query result - Activities count:', activities?.length || 0)
      console.log('❌ Query error:', error)
      
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
      
      console.log('✅ Query successful! Found activities:', activities?.length || 0)
      
      // Return real activity data without mock enrichment
      const enrichedActivities = activities || []
      
      // Calculate real-time stats
      const stats = {
        totalVisitors: enrichedActivities.filter(a => a.type === 'page_view').length,
        totalLeads: enrichedActivities.filter(a => a.type === 'contact_form_submission').length,
        hotLeads: enrichedActivities.filter(a => a.lead_score?.category === 'hot').length,
        warmLeads: enrichedActivities.filter(a => a.lead_score?.category === 'warm').length,
        coldLeads: enrichedActivities.filter(a => a.lead_score?.category === 'cold').length,
        conversionRate: enrichedActivities.length > 0 
          ? ((enrichedActivities.filter(a => a.type === 'contact_form_submission').length / enrichedActivities.length) * 100).toFixed(1)
          : '0'
      }
      
      return NextResponse.json({
        success: true,
        data: {
          activities: enrichedActivities,
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
