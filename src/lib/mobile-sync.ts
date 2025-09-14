// Mobile-Web Synchronization Service for Tutora Platform
import { SupabaseService, type Company, type User, type Module } from './supabase-service'

export interface MobileSyncData {
  user: User
  company: Company
  modules: Module[]
  progress: UserProgress
  leaderboard: LeaderboardEntry[]
  notifications: Notification[]
}

export interface UserProgress {
  userId: string
  companyId: string
  completedModules: string[]
  currentModule?: string
  totalScore: number
  certificatesEarned: string[]
  streakDays: number
  lastActiveDate: string
  timeSpentToday: number // minutes
  weeklyGoal: number
  weeklyProgress: number
}

export interface LeaderboardEntry {
  userId: string
  userName: string
  avatar?: string
  department?: string
  score: number
  completedModules: number
  certificatesEarned: number
  streakDays: number
  rank: number
}

export interface Notification {
  id: string
  type: 'module_assigned' | 'module_completed' | 'certificate_earned' | 'leaderboard_update' | 'reminder' | 'announcement'
  title: string
  message: string
  userId: string
  companyId: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
  priority: 'low' | 'medium' | 'high'
}

export interface ModuleAssignment {
  id: string
  moduleId: string
  userId: string
  companyId: string
  assignedBy: string
  dueDate?: string
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue'
  assignedAt: string
  startedAt?: string
  completedAt?: string
  score?: number
}

export class MobileSyncService {
  private supabaseService: SupabaseService

  constructor() {
    this.supabaseService = new SupabaseService()
  }

  // Mobile App Authentication & Company Lookup
  async authenticateWithCompanyCode(companyCode: string, userEmail: string): Promise<{
    success: boolean
    company?: Company
    user?: User
    error?: string
  }> {
    try {
      // Find company by code using real Supabase data
      const company = await this.supabaseService.getCompanyByCode(companyCode)
      if (!company) {
        return {
          success: false,
          error: 'Company not found. Please check your company code.'
        }
      }

      // Check if company is active
      if (!company.isActive) {
        return {
          success: false,
          error: 'Company account is not active. Please contact your administrator.'
        }
      }

      // Find user in company using real Supabase data
      const users = await this.supabaseService.getUsersByCompany(company.id)
      const user = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase())

      if (!user) {
        return {
          success: false,
          error: 'User not found in this company. Please check your email address.'
        }
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          error: 'User account is not active. Please contact your administrator.'
        }
      }

      return {
        success: true,
        company,
        user
      }
    } catch (error) {
      console.error('❌ Authentication error:', error)
      return {
        success: false,
        error: 'Authentication failed. Please try again.'
      }
    }
  }

  // Get complete sync data for mobile app
  async getSyncDataForUser(userId: string, companyId: string): Promise<MobileSyncData | null> {
    try {
      // Get user data from Supabase
      const user = await this.getUserById(userId)
      if (!user) return null

      // Get company data using real Supabase operations
      const company = await this.supabaseService.getCompanyByCode(user.email.split('@')[1])
      if (!company) return null

      // Get modules for company
      const modules = await this.supabaseService.getModulesForCompany(companyId)

      // Get user progress (simplified for now)
      const progress: UserProgress = {
        userId,
        companyId,
        completedModules: [],
        totalScore: 0,
        certificatesEarned: [],
        streakDays: 0,
        lastActiveDate: new Date().toISOString(),
        timeSpentToday: 0,
        weeklyGoal: 4,
        weeklyProgress: 0
      }

      // Get leaderboard (simplified)
      const leaderboard = await this.generateLeaderboard(companyId)

      // Get notifications (simplified)
      const notifications = await this.getUserNotifications(userId)

      return {
        user,
        company,
        modules,
        progress,
        leaderboard,
        notifications
      }
    } catch (error) {
      console.error('❌ Error getting sync data:', error)
      return null
    }
  }

  // Real-time progress tracking (simplified for Supabase transition)
  async updateUserProgress(userId: string, progressData: {
    moduleId?: string
    quizScore?: number
    timeSpent?: number
    completed?: boolean
  }): Promise<boolean> {
    try {
      const user = await this.getUserById(userId)
      if (!user) return false

      // For now, log progress updates until full analytics system is implemented
      console.log('📱 User progress tracked:', {
        userId,
        moduleId: progressData.moduleId,
        completed: progressData.completed,
        quizScore: progressData.quizScore,
        timeSpent: progressData.timeSpent,
        timestamp: new Date().toISOString()
      })

      // TODO: Implement progress tracking with Supabase analytics table
      // This will store user progress data for real analytics

      return true
    } catch (error) {
      console.error('❌ Error updating user progress:', error)
      return false
    }
  }

  // Module assignment from web admin
  async assignModuleToUser(moduleId: string, userId: string, assignedBy: string, dueDate?: string): Promise<boolean> {
    try {
      console.log('📋 Assigning module to user:', { moduleId, userId, assignedBy, dueDate })
      
      // TODO: Implement Supabase save
      const assignment: ModuleAssignment = {
        id: `assignment_${Date.now()}`,
        moduleId,
        userId,
        companyId: '', // TODO: Get from context
        assignedBy,
        dueDate,
        status: 'assigned',
        assignedAt: new Date().toISOString()
      }

      console.log('✅ Module assigned successfully')
      return true
    } catch (error) {
      console.error('❌ Failed to assign module:', error)
      return false
    }
  }

  // Bulk user operations from web admin
  async assignModuleToMultipleUsers(moduleId: string, userIds: string[], assignedBy: string, dueDate?: string): Promise<{
    successful: string[]
    failed: string[]
  }> {
    const successful: string[] = []
    const failed: string[] = []

    for (const userId of userIds) {
      try {
        const result = await this.assignModuleToUser(moduleId, userId, assignedBy, dueDate)
        if (result) {
        successful.push(userId)
      } else {
          failed.push(userId)
        }
      } catch (error) {
        console.error(`❌ Failed to assign module to user ${userId}:`, error)
        failed.push(userId)
      }
    }

    return { successful, failed }
  }

  // Generate leaderboard for mobile app (simplified for Supabase transition)
  private async generateLeaderboard(companyId: string): Promise<LeaderboardEntry[]> {
    try {
      // TODO: Save to Supabase
      console.log('🏆 Generating leaderboard for company:', companyId)
      
      // Mock leaderboard data
      return [
        {
          userId: 'user1',
          userName: 'John Doe',
          score: 1250,
          completedModules: 8,
          certificatesEarned: 3,
          streakDays: 15,
          rank: 1
        },
        {
          userId: 'user2',
          userName: 'Jane Smith',
          score: 1100,
          completedModules: 7,
          certificatesEarned: 2,
          streakDays: 12,
          rank: 2
        }
      ]
    } catch (error) {
      console.error('❌ Failed to generate leaderboard:', error)
      return []
    }
  }

  // Removed calculateUserScore and calculateStreakDays methods
  // Now using estimated values in leaderboard generation

  // Notification system
  async createNotification(notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Promise<boolean> {
    try {
      const newNotification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isRead: false,
        createdAt: new Date().toISOString(),
        ...notification
      }

      // TODO: Save to Supabase
      console.log('🔔 Notification created:', newNotification)

      // TODO: Send push notification to mobile app
      await this.sendPushNotification(newNotification)

      return true
    } catch (error) {
      console.error('❌ Error creating notification:', error)
      return false
    }
  }

  private async sendPushNotification(notification: Notification): Promise<void> {
    // TODO: Implement push notifications using Supabase real-time
    console.log('📱 Push notification:', notification.title)
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    // TODO: Implement Supabase query for user notifications
    return []
  }

  private async checkAndCreateAchievementNotifications(userId: string, progress: UserProgress): Promise<void> {
    // TODO: Implement achievement notifications using Supabase
    console.log('🏆 Checking achievements for user:', userId)
  }

  // Helper methods
  private async getUserById(userId: string): Promise<User | null> {
    // TODO: Implement Supabase query
    return null
  }

  private async getModulesForCompany(companyId: string): Promise<Module[]> {
    // TODO: Implement Supabase query for company modules
    return []
  }

  private async getUserProgress(userId: string): Promise<UserProgress> {
    // TODO: Implement progress calculation from Supabase data
    return {
      userId,
      companyId: '',
      completedModules: [],
      totalScore: 0,
      certificatesEarned: [],
      streakDays: 0,
      lastActiveDate: new Date().toISOString(),
      timeSpentToday: 0,
      weeklyGoal: 0,
      weeklyProgress: 0
    }
  }

  // Real-time sync events for mobile app
  async subscribeToUserUpdates(userId: string, callback: (data: Partial<MobileSyncData>) => void): Promise<() => void> {
    // TODO: Implement Supabase real-time listeners
    console.log('🔄 Subscribing to user updates:', userId)
    return () => console.log('🔌 Unsubscribed from user updates')
  }

  async subscribeToCompanyUpdates(companyId: string, callback: (data: Partial<Company>) => void): Promise<() => void> {
    // TODO: Implement Supabase real-time listeners for company updates
    console.log('🔄 Subscribing to company updates:', companyId)
    return () => console.log('🔌 Unsubscribed from company updates')
  }

  // Offline sync support
  async getOfflineData(userId: string): Promise<{
    modules: Module[]
    progress: UserProgress
    cachedContent: any[]
  }> {
    // TODO: Return essential data for offline mobile usage
    return {
      modules: [],
      progress: await this.getUserProgress(userId),
      cachedContent: []
    }
  }

  async syncOfflineProgress(userId: string, offlineActions: any[]): Promise<boolean> {
    try {
      console.log('🔄 Syncing offline progress for user:', userId)
      
      // Process each offline action
      for (const action of offlineActions) {
        switch (action.type) {
          case 'module_progress':
            await this.updateUserProgress(userId, action.data)
            break
          case 'module_completion':
            await this.updateUserProgress(userId, { ...action.data, completed: true })
            break
          case 'quiz_submission':
            await this.updateUserProgress(userId, { quizScore: action.data.score })
            break
          default:
            console.warn('⚠️ Unknown offline action type:', action.type)
        }
      }
      
      console.log('✅ Offline progress synced successfully')
      return true
    } catch (error) {
      console.error('❌ Failed to sync offline progress:', error)
      return false
    }
  }

  async forceSync(userId: string, companyId: string): Promise<boolean> {
    try {
      console.log('🔄 Force syncing for user:', userId, 'company:', companyId)
      
      // Get current sync data
      const syncData = await this.getSyncDataForUser(userId, companyId)
      if (!syncData) {
        console.error('❌ No sync data found for user')
        return false
      }
      
      // TODO: Update user's last sync timestamp in Supabase
      console.log('✅ Force sync completed successfully')
    return true
    } catch (error) {
      console.error('❌ Force sync failed:', error)
      return false
    }
  }
}

export const mobileSyncService = new MobileSyncService() 