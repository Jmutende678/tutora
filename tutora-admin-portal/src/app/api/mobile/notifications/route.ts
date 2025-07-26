import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService, type Notification } from '@/lib/supabase-service'

// POST /api/mobile/notifications - Send notification to mobile app
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      type, 
      title, 
      message, 
      userId, 
      companyId, 
      priority = 'medium',
      actionUrl,
      scheduleAt,
      userIds // for bulk notifications
    } = body

    // Validate required fields
    if (!title || !message || (!userId && !userIds)) {
      return NextResponse.json(
        { error: 'title, message, and userId (or userIds) are required' },
        { status: 400 }
      )
    }

    const supabaseService = new SupabaseService()
    let results = []

    // Handle bulk notifications
    if (userIds && Array.isArray(userIds)) {
      for (const uid of userIds) {
        const result = await supabaseService.createNotification({
          type: type || 'announcement',
          title,
          message,
          userId: uid,
          companyId,
          priority,
          actionUrl
        })
        results.push({ userId: uid, success: !!result })
      }
    } else {
      // Single notification
      const result = await supabaseService.createNotification({
        type: type || 'announcement',
        title,
        message,
        userId,
        companyId,
        priority,
        actionUrl
      })
      results.push({ userId, success: !!result })
    }

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      sent: successful,
      failed,
      results,
      message: `Notification sent to ${successful} users${failed > 0 ? `, failed for ${failed} users` : ''}`
    })

  } catch (error) {
    console.error('❌ Error sending mobile notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}

// GET /api/mobile/notifications - Get notifications for user
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const unreadOnly = url.searchParams.get('unreadOnly') === 'true'

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const supabaseService = new SupabaseService()

    // Get real notifications for user from Supabase
    const notifications = await supabaseService.getUserNotifications(userId, {
      limit,
      unreadOnly
    })
    
    const unreadCount = notifications.filter(n => !n.isRead).length

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      total: notifications.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error getting mobile notifications:', error)
    return NextResponse.json(
      { error: 'Failed to get notifications' },
      { status: 500 }
    )
  }
}

// PUT /api/mobile/notifications/read - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, notificationIds, markAllAsRead } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const supabaseService = new SupabaseService()

    // Mark notifications as read using real Supabase operations
    let updatedCount = 0
    
    if (markAllAsRead) {
      updatedCount = await supabaseService.markAllNotificationsAsRead(userId)
    } else if (notificationIds && Array.isArray(notificationIds)) {
      updatedCount = await supabaseService.markNotificationsAsRead(notificationIds)
    }

    console.log('📱 Marked notifications as read:', {
      userId,
      notificationIds,
      markAllAsRead,
      updatedCount
    })

    return NextResponse.json({
      success: true,
      message: `Marked ${updatedCount} notifications as read`,
      updatedCount
    })

  } catch (error) {
    console.error('❌ Error marking notifications as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    )
  }
} 