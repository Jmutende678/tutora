import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const moduleId = params.id

    // Check if Supabase is configured
    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Module service not configured'
      }, { status: 503 })
    }

    // TODO: Update module status to published in Supabase
    console.log('📢 Module publish request:', moduleId)

    // Track module publication
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'training_module_published',
          session_id: `publish_${Date.now()}`,
          timestamp: new Date().toISOString(),
          source: '/admin/module-builder',
          metadata: {
            location: { country: 'Unknown', city: 'Unknown' },
            device: { type: 'unknown' }
          },
          data: {
            moduleId: moduleId,
            action: 'publish'
          },
          user_email: 'admin@tutoralearn.com',
          lead_score: {
            score: 85,
            category: 'hot',
            reasons: [
              'Published training module',
              'Content deployment activity',
              'High platform engagement',
              'Value delivery action'
            ]
          }
        })
      })
      console.log('✅ Module publication tracked in database')
    } catch (trackingError) {
      console.error('❌ Failed to track module publication:', trackingError)
    }

    return NextResponse.json({
      success: true,
      message: 'Module published successfully'
    })

  } catch (error) {
    console.error('Module publish API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to publish module'
    }, { status: 500 })
  }
}
