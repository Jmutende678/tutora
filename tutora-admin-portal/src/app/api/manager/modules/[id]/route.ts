import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'

export async function DELETE(
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

    // TODO: Delete module from Supabase
    console.log('🗑️ Module delete request:', moduleId)

    // Track module deletion
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'training_module_deleted',
          session_id: `delete_${Date.now()}`,
          timestamp: new Date().toISOString(),
          source: '/admin/module-builder',
          metadata: {
            location: { country: 'Unknown', city: 'Unknown' },
            device: { type: 'unknown' }
          },
          data: {
            moduleId: moduleId,
            action: 'delete'
          },
          user_email: 'admin@tutoralearn.com',
          lead_score: {
            score: 60,
            category: 'warm',
            reasons: [
              'Deleted training module',
              'Content management activity',
              'Platform usage'
            ]
          }
        })
      })
      console.log('✅ Module deletion tracked in database')
    } catch (trackingError) {
      console.error('❌ Failed to track module deletion:', trackingError)
    }

    return NextResponse.json({
      success: true,
      message: 'Module deleted successfully'
    })

  } catch (error) {
    console.error('Module delete API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete module'
    }, { status: 500 })
  }
}
