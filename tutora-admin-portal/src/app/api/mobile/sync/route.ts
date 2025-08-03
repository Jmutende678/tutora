import { NextRequest, NextResponse } from 'next/server'
import { mobileSyncService, type MobileSyncData } from '@/lib/mobile-sync'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/mobile/sync - Get sync data for mobile app
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const companyId = url.searchParams.get('companyId')
    const includeOffline = url.searchParams.get('includeOffline') === 'true'

    if (!userId || !companyId) {
      return NextResponse.json(
        { error: 'userId and companyId are required' },
        { status: 400 }
      )
    }

    // Get complete sync data for mobile app
    const syncData = await mobileSyncService.getSyncDataForUser(userId, companyId)
    
    if (!syncData) {
      return NextResponse.json(
        { error: 'User or company not found' },
        { status: 404 }
      )
    }

    // Include offline data if requested
    let offlineData = null
    if (includeOffline) {
      offlineData = await mobileSyncService.getOfflineData(userId)
    }

    return NextResponse.json({
      success: true,
      data: syncData,
      offlineData,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    console.error('❌ Error in mobile sync GET:', error)
    return NextResponse.json(
      { error: 'Failed to get sync data' },
      { status: 500 }
    )
  }
}

// POST /api/mobile/sync - Update user progress from mobile app
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, progressData, offlineActions } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Process offline actions if provided
    if (offlineActions && offlineActions.length > 0) {
      const syncResult = await mobileSyncService.syncOfflineProgress(userId, offlineActions)
      if (!syncResult) {
        return NextResponse.json(
          { error: 'Failed to sync offline progress' },
          { status: 500 }
        )
      }
    }

    // Update user progress
    if (progressData) {
      const updateResult = await mobileSyncService.updateUserProgress(userId, progressData)
      if (!updateResult) {
        return NextResponse.json(
          { error: 'Failed to update user progress' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error in mobile sync POST:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}

// PUT /api/mobile/sync - Force sync for specific user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, companyId, forceSync } = body

    if (!userId || !companyId) {
      return NextResponse.json(
        { error: 'userId and companyId are required' },
        { status: 400 }
      )
    }

    // Force sync if requested
    if (forceSync) {
      const syncResult = await mobileSyncService.forceSync(userId, companyId)
      if (!syncResult) {
      return NextResponse.json(
          { error: 'Failed to force sync' },
          { status: 500 }
      )
    }
    }

    return NextResponse.json({
      success: true,
      message: 'Sync completed successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error in mobile sync PUT:', error)
    return NextResponse.json(
      { error: 'Failed to sync' },
      { status: 500 }
    )
  }
} 