// Real-time updates service for Tutora platform
import { mobileSyncService } from './mobile-sync'
import { firebaseAdminService } from './firebase-admin'

export interface RealTimeEvent {
  type: 'user_progress' | 'module_assignment' | 'notification' | 'leaderboard_update' | 'company_update' | 'system_message'
  userId?: string
  companyId: string
  data: any
  timestamp: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface ConnectionInfo {
  userId: string
  companyId: string
  connectionId: string
  platform: 'web' | 'mobile' | 'admin'
  lastPing: string
  userAgent?: string
}

export class RealTimeService {
  private connections: Map<string, ConnectionInfo> = new Map()
  private eventBuffer: Map<string, RealTimeEvent[]> = new Map()
  private readonly BUFFER_SIZE = 100
  private readonly PING_INTERVAL = 30000 // 30 seconds
  private pingInterval?: NodeJS.Timeout

  constructor() {
    this.startPingMonitoring()
  }

  // Connection management
  addConnection(connectionInfo: ConnectionInfo): void {
    this.connections.set(connectionInfo.connectionId, connectionInfo)
    console.log(`📱 Real-time connection added: ${connectionInfo.platform} - ${connectionInfo.userId}`)
    
    // Send buffered events to new connection
    this.sendBufferedEvents(connectionInfo.connectionId)
  }

  removeConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId)
    if (connection) {
      console.log(`📱 Real-time connection removed: ${connection.platform} - ${connection.userId}`)
      this.connections.delete(connectionId)
    }
  }

  updateConnectionPing(connectionId: string): void {
    const connection = this.connections.get(connectionId)
    if (connection) {
      connection.lastPing = new Date().toISOString()
    }
  }

  // Event broadcasting
  async broadcastEvent(event: RealTimeEvent): Promise<void> {
    try {
      // Add to event buffer for offline users
      this.addToBuffer(event)

      // Get target connections
      const targetConnections = this.getTargetConnections(event)

      // Send to connected clients
      for (const connection of targetConnections) {
        await this.sendEventToConnection(connection, event)
      }

      // Handle mobile push notifications for offline users
      await this.handleOfflineNotifications(event)

      console.log(`📡 Event broadcasted: ${event.type} to ${targetConnections.length} connections`)
    } catch (error) {
      console.error('❌ Error broadcasting real-time event:', error)
    }
  }

  // User progress updates
  async broadcastProgressUpdate(userId: string, companyId: string, progressData: any): Promise<void> {
    const event: RealTimeEvent = {
      type: 'user_progress',
      userId,
      companyId,
      data: {
        userId,
        progress: progressData,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString(),
      priority: 'medium'
    }

    await this.broadcastEvent(event)

    // Update leaderboard if significant progress
    if (progressData.completed || progressData.certificateEarned) {
      await this.broadcastLeaderboardUpdate(companyId)
    }
  }

  // Module assignments
  async broadcastModuleAssignment(moduleId: string, userIds: string[], companyId: string, assignedBy: string): Promise<void> {
    for (const userId of userIds) {
      const event: RealTimeEvent = {
        type: 'module_assignment',
        userId,
        companyId,
        data: {
          moduleId,
          assignedBy,
          dueDate: null, // TODO: Add due date logic
          message: 'You have been assigned a new training module'
        },
        timestamp: new Date().toISOString(),
        priority: 'high'
      }

      await this.broadcastEvent(event)

      // Create notification
      await mobileSyncService.createNotification({
        type: 'module_assigned',
        title: 'New Module Assigned',
        message: 'Complete your new training module',
        userId,
        companyId,
        priority: 'medium'
      })
    }
  }

  // Leaderboard updates
  async broadcastLeaderboardUpdate(companyId: string): Promise<void> {
    const event: RealTimeEvent = {
      type: 'leaderboard_update',
      companyId,
      data: {
        message: 'Leaderboard has been updated',
        refreshRequired: true
      },
      timestamp: new Date().toISOString(),
      priority: 'low'
    }

    await this.broadcastEvent(event)
  }

  // System-wide notifications
  async broadcastSystemMessage(message: string, companyIds?: string[], priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'): Promise<void> {
    const targetCompanies = companyIds || Array.from(new Set(Array.from(this.connections.values()).map(c => c.companyId)))

    for (const companyId of targetCompanies) {
      const event: RealTimeEvent = {
        type: 'system_message',
        companyId,
        data: {
          message,
          broadcast: true,
          action: 'show_notification'
        },
        timestamp: new Date().toISOString(),
        priority
      }

      await this.broadcastEvent(event)
    }
  }

  // Company updates (plan changes, settings, etc.)
  async broadcastCompanyUpdate(companyId: string, updateType: string, data: any): Promise<void> {
    const event: RealTimeEvent = {
      type: 'company_update',
      companyId,
      data: {
        updateType,
        changes: data,
        requiresRefresh: true
      },
      timestamp: new Date().toISOString(),
      priority: 'high'
    }

    await this.broadcastEvent(event)
  }

  // Private helper methods
  private getTargetConnections(event: RealTimeEvent): ConnectionInfo[] {
    return Array.from(this.connections.values()).filter(connection => {
      // Match company
      if (connection.companyId !== event.companyId) return false
      
      // Match user if event is user-specific
      if (event.userId && connection.userId !== event.userId) return false
      
      return true
    })
  }

  private async sendEventToConnection(connection: ConnectionInfo, event: RealTimeEvent): Promise<void> {
    try {
      // In a real implementation, this would send via WebSocket or SSE
      // For now, we'll log and potentially store for polling
      console.log(`📤 Sending event to ${connection.platform}:${connection.userId}`, {
        type: event.type,
        priority: event.priority,
        timestamp: event.timestamp
      })

      // TODO: Implement actual WebSocket/SSE sending
      // Example: connection.socket?.send(JSON.stringify(event))
    } catch (error) {
      console.error('❌ Error sending event to connection:', error)
    }
  }

  private addToBuffer(event: RealTimeEvent): void {
    const key = event.userId || event.companyId
    if (!this.eventBuffer.has(key)) {
      this.eventBuffer.set(key, [])
    }

    const buffer = this.eventBuffer.get(key)!
    buffer.push(event)

    // Keep buffer size manageable
    if (buffer.length > this.BUFFER_SIZE) {
      buffer.splice(0, buffer.length - this.BUFFER_SIZE)
    }
  }

  private sendBufferedEvents(connectionId: string): void {
    const connection = this.connections.get(connectionId)
    if (!connection) return

    const userBuffer = this.eventBuffer.get(connection.userId) || []
    const companyBuffer = this.eventBuffer.get(connection.companyId) || []
    
    // Combine and sort events
    const allEvents = [...userBuffer, ...companyBuffer]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-20) // Last 20 events

    // Send buffered events
    for (const event of allEvents) {
      this.sendEventToConnection(connection, event)
    }
  }

  private async handleOfflineNotifications(event: RealTimeEvent): Promise<void> {
    // Get all users in the company
    if (!event.companyId) return

    try {
      const users = await firebaseAdminService.getUsersByCompany(event.companyId)
      const connectedUserIds = new Set(Array.from(this.connections.values())
        .filter(c => c.companyId === event.companyId)
        .map(c => c.userId))

      // Find offline users
      const offlineUsers = users.filter(user => !connectedUserIds.has(user.id))

      // Send push notifications to offline users for high priority events
      if (event.priority === 'high' || event.priority === 'urgent') {
        for (const user of offlineUsers) {
          if (event.userId && event.userId !== user.id) continue // Skip if event is for specific user

          await mobileSyncService.createNotification({
            type: event.type as any,
            title: this.getNotificationTitle(event),
            message: this.getNotificationMessage(event),
            userId: user.id,
            companyId: event.companyId,
            priority: event.priority as any
          })
        }
      }
    } catch (error) {
      console.error('❌ Error handling offline notifications:', error)
    }
  }

  private getNotificationTitle(event: RealTimeEvent): string {
    switch (event.type) {
      case 'user_progress': return 'Progress Update'
      case 'module_assignment': return 'New Module Assigned'
      case 'leaderboard_update': return 'Leaderboard Updated'
      case 'company_update': return 'Company Update'
      case 'system_message': return 'System Notification'
      default: return 'Tutora Update'
    }
  }

  private getNotificationMessage(event: RealTimeEvent): string {
    switch (event.type) {
      case 'user_progress': return 'Your training progress has been updated'
      case 'module_assignment': return event.data.message || 'You have been assigned a new module'
      case 'leaderboard_update': return 'Check out the updated leaderboard rankings'
      case 'company_update': return 'Your company settings have been updated'
      case 'system_message': return event.data.message || 'System update available'
      default: return 'New update available in Tutora'
    }
  }

  private startPingMonitoring(): void {
    this.pingInterval = setInterval(() => {
      const now = new Date()
      const staleConnections: string[] = []

      for (const [connectionId, connection] of this.connections) {
        const lastPing = new Date(connection.lastPing)
        const timeDiff = now.getTime() - lastPing.getTime()

        // Remove connections that haven't pinged in 5 minutes
        if (timeDiff > 5 * 60 * 1000) {
          staleConnections.push(connectionId)
        }
      }

      // Clean up stale connections
      for (const connectionId of staleConnections) {
        this.removeConnection(connectionId)
      }

      if (staleConnections.length > 0) {
        console.log(`🧹 Cleaned up ${staleConnections.length} stale real-time connections`)
      }
    }, this.PING_INTERVAL)
  }

  // Cleanup
  destroy(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
    }
    this.connections.clear()
    this.eventBuffer.clear()
  }

  // Statistics
  getConnectionStats(): {
    totalConnections: number
    webConnections: number
    mobileConnections: number
    adminConnections: number
    companiesConnected: number
  } {
    const connections = Array.from(this.connections.values())
    
    return {
      totalConnections: connections.length,
      webConnections: connections.filter(c => c.platform === 'web').length,
      mobileConnections: connections.filter(c => c.platform === 'mobile').length,
      adminConnections: connections.filter(c => c.platform === 'admin').length,
      companiesConnected: new Set(connections.map(c => c.companyId)).size
    }
  }

  // Get events for a specific user/company (for polling fallback)
  getRecentEvents(userId: string, companyId: string, since?: string): RealTimeEvent[] {
    const userEvents = this.eventBuffer.get(userId) || []
    const companyEvents = this.eventBuffer.get(companyId) || []
    
    const allEvents = [...userEvents, ...companyEvents]
    
    if (since) {
      const sinceDate = new Date(since)
      return allEvents.filter(event => new Date(event.timestamp) > sinceDate)
    }
    
    return allEvents.slice(-20) // Last 20 events
  }
}

// Singleton instance
export const realTimeService = new RealTimeService()

// API endpoint helper for Server-Sent Events
export function createSSEResponse(userId: string, companyId: string): Response {
  const stream = new ReadableStream({
    start(controller) {
      // Add connection
      const connectionId = `sse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      realTimeService.addConnection({
        userId,
        companyId,
        connectionId,
        platform: 'web',
        lastPing: new Date().toISOString()
      })

      // Send initial connection event
      const data = `data: ${JSON.stringify({
        type: 'connection',
        message: 'Connected to real-time updates',
        connectionId
      })}\n\n`
      
      controller.enqueue(new TextEncoder().encode(data))

      // Set up periodic ping
      const pingInterval = setInterval(() => {
        try {
          realTimeService.updateConnectionPing(connectionId)
          const pingData = `data: ${JSON.stringify({
            type: 'ping',
            timestamp: new Date().toISOString()
          })}\n\n`
          controller.enqueue(new TextEncoder().encode(pingData))
        } catch (error) {
          clearInterval(pingInterval)
          realTimeService.removeConnection(connectionId)
          controller.close()
        }
      }, 30000)

      // TODO: Set up event listener for real events
      // This would integrate with the actual WebSocket/SSE implementation
    },
    cancel() {
      // Connection closed
      console.log('📱 SSE connection closed')
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
} 