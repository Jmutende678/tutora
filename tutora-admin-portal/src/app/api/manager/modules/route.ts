import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({
        success: false,
        modules: [],
        message: 'Module service not configured'
      })
    }

    // TODO: Fetch real modules from Supabase
    // For now, return empty array
    const modules: any[] = []

    return NextResponse.json({
      success: true,
      modules: modules
    })

  } catch (error) {
    console.error('Modules fetch API error:', error)
    return NextResponse.json({
      success: false,
      modules: [],
      error: 'Failed to load modules'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const moduleData = await request.json()

    // Check if Supabase is configured
    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Module service not configured'
      }, { status: 503 })
    }

    // TODO: Save module to Supabase
    console.log('📚 Module save request:', moduleData)

    // Track module creation
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'training_module_created',
          session_id: `module_${Date.now()}`,
          timestamp: new Date().toISOString(),
          source: '/admin/module-builder',
          metadata: {
            location: { country: 'Unknown', city: 'Unknown' },
            device: { type: 'unknown' }
          },
          data: {
            moduleTitle: moduleData.title,
            moduleType: moduleData.type || 'custom',
            contentLength: moduleData.content?.length || 0
          },
          user_email: 'admin@tutoralearn.com',
          lead_score: {
            score: 80,
            category: 'hot',
            reasons: [
              'Created training module',
              'Active content creation',
              'Platform engagement',
              'Value creation activity'
            ]
          }
        })
      })
      console.log('✅ Module creation tracked in database')
    } catch (trackingError) {
      console.error('❌ Failed to track module creation:', trackingError)
    }

    return NextResponse.json({
      success: true,
      message: 'Module saved successfully',
      moduleId: `module_${Date.now()}`
    })

  } catch (error) {
    console.error('Module save API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to save module'
    }, { status: 500 })
  }
}
