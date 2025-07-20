// Mobile-Web Synchronization Service for Tutora Platform
import { firebaseAdminService, type Company, type User, type Module } from './firebase-admin'

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
  constructor() {}

  // Mobile App Authentication & Company Lookup
  async authenticateWithCompanyCode(companyCode: string, userEmail: string): Promise<{
    success: boolean
    company?: Company
    user?: User
    error?: string
  }> {
    try {
      // Find company by code
      const company = await firebaseAdminService.getCompanyByCode(companyCode)
      if (!company) {
        return {
          success: false,
          error: 'Company not found. Please check your company code.'
        }
      }

      // Check if company is active
      if (company.status !== 'active') {
        return {
          success: false,
          error: 'Company account is not active. Please contact your administrator.'
        }
      }

      // Find user in company
      const users = await firebaseAdminService.getUsersByCompany(company.id)
      const user = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase())

      if (!user) {
        return {
          success: false,
          error: 'User not found in this company. Please check your email address.'
        }
      }

      // Check if user is active
      if (user.status !== 'active') {
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
      const [user, company, users] = await Promise.all([
        this.getUserById(userId),
        firebaseAdminService.getCompany(companyId),
        firebaseAdminService.getUsersByCompany(companyId)
      ])

      if (!user || !company) {
        throw new Error('User or company not found')
      }

      // Get modules for company
      const modules = await this.getModulesForCompany(companyId)

      // Get user progress
      const progress = await this.getUserProgress(userId)

      // Generate leaderboard
      const leaderboard = await this.generateLeaderboard(companyId, users)

      // Get notifications
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

  // Real-time progress tracking
  async updateUserProgress(userId: string, progressData: {
    moduleId?: string
    quizScore?: number
    timeSpent?: number
    completed?: boolean
  }): Promise<boolean> {
    try {
      const user = await this.getUserById(userId)
      if (!user) return false

      const updates: Partial<User> = {
        ...user
      }

      // Update progress
      if (progressData.moduleId && progressData.completed) {
        if (!user.progress.completedModules) {
          updates.progress = { ...user.progress, completedModules: 1 }
        } else {
          updates.progress = { ...user.progress, completedModules: user.progress.completedModules + 1 }
        }
      }

      if (progressData.quizScore !== undefined) {
        const totalScore = (user.progress.averageScore * user.progress.completedQuizzes) + progressData.quizScore
        const newQuizCount = user.progress.completedQuizzes + 1
        updates.progress = {
          ...updates.progress!,
          completedQuizzes: newQuizCount,
          averageScore: totalScore / newQuizCount
        }
      }

      if (progressData.timeSpent) {
        updates.progress = {
          ...updates.progress!,
          totalTimeSpent: user.progress.totalTimeSpent + progressData.timeSpent
        }
      }

      // Save to Firebase
      // TODO: Implement Firebase update
      console.log('📱 User progress updated:', userId, progressData)

      // Trigger notifications for achievements
      await this.checkAndCreateAchievementNotifications(userId, updates.progress!)

      return true
    } catch (error) {
      console.error('❌ Error updating user progress:', error)
      return false
    }
  }

  // Module assignment from web admin
  async assignModuleToUser(moduleId: string, userId: string, assignedBy: string, dueDate?: string): Promise<boolean> {
    try {
      const assignment: ModuleAssignment = {
        id: `assign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        moduleId,
        userId,
        companyId: '', // TODO: Get from user
        assignedBy,
        dueDate,
        status: 'assigned',
        assignedAt: new Date().toISOString()
      }

      // Save assignment
      // TODO: Implement Firebase save

      // Create notification
      await this.createNotification({
        type: 'module_assigned',
        title: 'New Module Assigned',
        message: 'You have been assigned a new training module',
        userId,
        companyId: assignment.companyId,
        priority: 'medium'
      })

      console.log('📚 Module assigned:', assignment)
      return true
    } catch (error) {
      console.error('❌ Error assigning module:', error)
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
      const success = await this.assignModuleToUser(moduleId, userId, assignedBy, dueDate)
      if (success) {
        successful.push(userId)
      } else {
        failed.push(userId)
      }
    }

    return { successful, failed }
  }

  // Generate leaderboard for mobile app
  private async generateLeaderboard(companyId: string, users: User[]): Promise<LeaderboardEntry[]> {
    try {
      const leaderboardEntries: LeaderboardEntry[] = users
        .filter(user => user.status === 'active')
        .map(user => ({
          userId: user.id,
          userName: user.name,
          avatar: user.profile?.avatar,
          department: user.profile?.department,
          score: this.calculateUserScore(user),
          completedModules: user.progress.completedModules,
          certificatesEarned: user.progress.certificatesEarned,
          streakDays: this.calculateStreakDays(user),
          rank: 0 // Will be set after sorting
        }))
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }))

      return leaderboardEntries.slice(0, 50) // Top 50
    } catch (error) {
      console.error('❌ Error generating leaderboard:', error)
      return []
    }
  }

  private calculateUserScore(user: User): number {
    const { completedModules, averageScore, certificatesEarned, totalTimeSpent } = user.progress
    
    // Scoring algorithm
    const modulePoints = completedModules * 100
    const scoreBonus = (averageScore / 100) * completedModules * 50
    const certificateBonus = certificatesEarned * 200
    const timeBonus = Math.min(totalTimeSpent / 60, 100) * 10 // Max 100 hours = 1000 points
    
    return Math.round(modulePoints + scoreBonus + certificateBonus + timeBonus)
  }

  private calculateStreakDays(user: User): number {
    // TODO: Implement streak calculation based on daily activity
    return Math.floor(Math.random() * 30) // Mock data
  }

  // Notification system
  async createNotification(notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Promise<boolean> {
    try {
      const newNotification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isRead: false,
        createdAt: new Date().toISOString(),
        ...notification
      }

      // TODO: Save to Firebase
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
    // TODO: Implement Firebase Cloud Messaging (FCM) for push notifications
    console.log('📱 Push notification sent:', notification.title)
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    // TODO: Implement Firebase query for user notifications
    return []
  }

  private async checkAndCreateAchievementNotifications(userId: string, progress: UserProgress): Promise<void> {
    // Check for achievements and create notifications
    const milestones = [5, 10, 25, 50, 100]
    
    if (milestones.includes(progress.completedModules)) {
      await this.createNotification({
        type: 'certificate_earned',
        title: 'Achievement Unlocked! 🏆',
        message: `Congratulations! You've completed ${progress.completedModules} modules.`,
        userId,
        companyId: '', // TODO: Get from context
        priority: 'high'
      })
    }
  }

  // Helper methods
  private async getUserById(userId: string): Promise<User | null> {
    // TODO: Implement Firebase query
    return null
  }

  private async getModulesForCompany(companyId: string): Promise<Module[]> {
    // TODO: Implement Firebase query for company modules
    return []
  }

  private async getUserProgress(userId: string): Promise<UserProgress> {
    // TODO: Implement progress calculation from Firebase data
    return {
      userId,
      companyId: '',
      completedModules: [],
      totalScore: 0,
      certificatesEarned: [],
      streakDays: 0,
      lastActiveDate: new Date().toISOString(),
      timeSpentToday: 0,
      weeklyGoal: 5, // modules per week
      weeklyProgress: 0
    }
  }

  // Real-time sync events for mobile app
  async subscribeToUserUpdates(userId: string, callback: (data: Partial<MobileSyncData>) => void): Promise<() => void> {
    // TODO: Implement Firebase real-time listeners
    console.log('📱 Subscribed to user updates:', userId)
    
    // Return unsubscribe function
    return () => {
      console.log('📱 Unsubscribed from user updates:', userId)
    }
  }

  async subscribeToCompanyUpdates(companyId: string, callback: (data: Partial<Company>) => void): Promise<() => void> {
    // TODO: Implement Firebase real-time listeners for company updates
    console.log('📱 Subscribed to company updates:', companyId)
    
    return () => {
      console.log('📱 Unsubscribed from company updates:', companyId)
    }
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
    // TODO: Process offline actions when mobile app comes back online
    console.log('📱 Syncing offline progress for user:', userId, offlineActions.length, 'actions')
    return true
  }
}

export const mobileSyncService = new MobileSyncService() 