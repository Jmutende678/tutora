import { NextRequest, NextResponse } from 'next/server'
import { mobileSyncService, type Notification } from '@/lib/mobile-sync'

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

    let results = []

    // Handle bulk notifications
    if (userIds && Array.isArray(userIds)) {
      for (const uid of userIds) {
        const result = await mobileSyncService.createNotification({
          type: type || 'announcement',
          title,
          message,
          userId: uid,
          companyId,
          priority,
          actionUrl
        })
        results.push({ userId: uid, success: result })
      }
    } else {
      // Single notification
      const result = await mobileSyncService.createNotification({
        type: type || 'announcement',
        title,
        message,
        userId,
        companyId,
        priority,
        actionUrl
      })
      results.push({ userId, success: result })
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

    // Get notifications for user
    const notifications = await mobileSyncService.getUserNotifications(userId)
    
    // Filter and limit results
    let filteredNotifications = notifications
    if (unreadOnly) {
      filteredNotifications = notifications.filter(n => !n.isRead)
    }
    
    filteredNotifications = filteredNotifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)

    // Generate mock notifications for demo
    if (filteredNotifications.length === 0) {
      const mockNotifications: Notification[] = [
        {
          id: 'notif_001',
          type: 'module_assigned',
          title: 'New Training Module Assigned',
          message: 'Complete "Workplace Safety Fundamentals" by Friday',
          userId,
          companyId: 'company_demo',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          priority: 'medium',
          actionUrl: '/modules/workplace-safety'
        },
        {
          id: 'notif_002',
          type: 'certificate_earned',
          title: 'Certificate Earned! 🏆',
          message: 'You\'ve earned the Customer Service Excellence certificate',
          userId,
          companyId: 'company_demo',
          isRead: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          priority: 'high'
        },
        {
          id: 'notif_003',
          type: 'leaderboard_update',
          title: 'Leaderboard Update',
          message: 'You\'re now #3 on the company leaderboard!',
          userId,
          companyId: 'company_demo',
          isRead: true,
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
          priority: 'low'
        },
        {
          id: 'notif_004',
          type: 'reminder',
          title: 'Training Reminder',
          message: 'Don\'t forget to complete your weekly training goal',
          userId,
          companyId: 'company_demo',
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          priority: 'low'
        }
      ]

      filteredNotifications = unreadOnly 
        ? mockNotifications.filter(n => !n.isRead)
        : mockNotifications
    }

    const unreadCount = filteredNotifications.filter(n => !n.isRead).length

    return NextResponse.json({
      success: true,
      notifications: filteredNotifications,
      unreadCount,
      total: filteredNotifications.length
    })

  } catch (error) {
    console.error('❌ Error getting mobile notifications:', error)
    return NextResponse.json(
      { error: 'Failed to get notifications' },
      { status: 500 }
    )
  }
}

// PUT /api/mobile/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationIds, userId, markAllAsRead } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    if (!markAllAsRead && (!notificationIds || !Array.isArray(notificationIds))) {
      return NextResponse.json(
        { error: 'notificationIds array is required when not marking all as read' },
        { status: 400 }
      )
    }

    // TODO: Implement Firebase update logic
    console.log('📱 Marking notifications as read:', {
      userId,
      notificationIds,
      markAllAsRead
    })

    return NextResponse.json({
      success: true,
      message: markAllAsRead 
        ? 'All notifications marked as read'
        : `${notificationIds.length} notifications marked as read`
    })

  } catch (error) {
    console.error('❌ Error marking notifications as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    )
  }
} 