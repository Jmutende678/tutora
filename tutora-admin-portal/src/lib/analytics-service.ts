// Advanced Analytics Service for Tutora Platform
import { firebaseAdminService, type Company, type User, type Module } from './firebase-admin'
import { mobileSyncService } from './mobile-sync'

export interface AnalyticsMetrics {
  // User Engagement Metrics
  totalUsers: number
  activeUsers: number
  newUsers: number
  userRetention: number
  averageSessionDuration: number
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number

  // Learning Metrics
  totalModules: number
  completedModules: number
  averageCompletionTime: number
  completionRate: number
  averageQuizScore: number
  certificatesEarned: number
  learningPaths: number

  // Business Metrics
  totalRevenue: number
  monthlyRecurringRevenue: number
  churnRate: number
  customerLifetimeValue: number
  planDistribution: Record<string, number>
  supportTickets: number

  // Performance Metrics
  systemUptime: number
  averageResponseTime: number
  errorRate: number
  apiCallsPerDay: number

  // Growth Metrics
  userGrowthRate: number
  revenueGrowthRate: number
  moduleUsageGrowth: number
  companyGrowthRate: number
}

export interface UserAnalytics {
  userId: string
  companyId: string
  engagementScore: number
  learningVelocity: number
  skillProgress: Record<string, number>
  timeSpentDaily: number[]
  moduleCompletions: Array<{
    moduleId: string
    completedAt: string
    score: number
    timeSpent: number
  }>
  streakDays: number
  lastActive: string
  preferredLearningTime: string
  deviceUsage: Record<'mobile' | 'web', number>
}

export interface CompanyAnalytics {
  companyId: string
  overallEngagement: number
  trainingEffectiveness: number
  knowledgeRetention: number
  departmentPerformance: Record<string, {
    averageScore: number
    completionRate: number
    engagementLevel: number
  }>
  learningTrends: Array<{
    date: string
    completions: number
    scores: number
    timeSpent: number
  }>
  topPerformers: Array<{
    userId: string
    userName: string
    score: number
    completions: number
  }>
  riskUsers: Array<{
    userId: string
    userName: string
    riskScore: number
    reason: string
  }>
}

export interface ModuleAnalytics {
  moduleId: string
  companyId: string
  viewsCount: number
  completionsCount: number
  averageScore: number
  averageTime: number
  completionRate: number
  userFeedback: number
  difficultyRating: number
  dropoffPoints: Array<{
    section: string
    dropoffRate: number
  }>
  improvementSuggestions: string[]
}

export class AnalyticsService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor() {}

  // Real-time Dashboard Metrics
  async getDashboardMetrics(companyId?: string): Promise<AnalyticsMetrics> {
    const cacheKey = `dashboard_${companyId || 'global'}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      const companies = companyId 
        ? [await firebaseAdminService.getCompany(companyId)].filter(Boolean) as Company[]
        : await firebaseAdminService.getAllCompanies()

      const allUsers = await Promise.all(
        companies.map(c => firebaseAdminService.getUsersByCompany(c.id))
      ).then(results => results.flat())

      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      // Calculate metrics
      const metrics: AnalyticsMetrics = {
        // User Engagement
        totalUsers: allUsers.length,
        activeUsers: this.calculateActiveUsers(allUsers, thirtyDaysAgo),
        newUsers: this.calculateNewUsers(allUsers, thirtyDaysAgo),
        userRetention: this.calculateRetention(allUsers),
        averageSessionDuration: this.calculateAverageSessionDuration(allUsers),
        dailyActiveUsers: this.calculateActiveUsers(allUsers, oneDayAgo),
        weeklyActiveUsers: this.calculateActiveUsers(allUsers, sevenDaysAgo),
        monthlyActiveUsers: this.calculateActiveUsers(allUsers, thirtyDaysAgo),

        // Learning Metrics
        totalModules: await this.getTotalModules(companies),
        completedModules: this.calculateCompletedModules(allUsers),
        averageCompletionTime: this.calculateAverageCompletionTime(allUsers),
        completionRate: this.calculateCompletionRate(allUsers),
        averageQuizScore: this.calculateAverageQuizScore(allUsers),
        certificatesEarned: this.calculateCertificatesEarned(allUsers),
        learningPaths: this.calculateLearningPaths(companies),

        // Business Metrics
        totalRevenue: this.calculateTotalRevenue(companies),
        monthlyRecurringRevenue: this.calculateMRR(companies),
        churnRate: this.calculateChurnRate(companies),
        customerLifetimeValue: this.calculateCLV(companies),
        planDistribution: this.calculatePlanDistribution(companies),
        supportTickets: await this.getSupportTicketCount(),

        // Performance Metrics
        systemUptime: 99.9, // Mock data - integrate with monitoring service
        averageResponseTime: 245, // Mock data - integrate with APM
        errorRate: 0.1, // Mock data
        apiCallsPerDay: 15420, // Mock data

        // Growth Metrics
        userGrowthRate: this.calculateUserGrowthRate(allUsers),
        revenueGrowthRate: this.calculateRevenueGrowthRate(companies),
        moduleUsageGrowth: this.calculateModuleUsageGrowth(allUsers),
        companyGrowthRate: this.calculateCompanyGrowthRate(companies)
      }

      this.setCachedData(cacheKey, metrics)
      return metrics

    } catch (error) {
      console.error('❌ Error calculating dashboard metrics:', error)
      return this.getDefaultMetrics()
    }
  }

  // User-specific Analytics
  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    const cacheKey = `user_analytics_${userId}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      // TODO: Implement with Firebase data
      const mockAnalytics: UserAnalytics = {
        userId,
        companyId: 'demo_company',
        engagementScore: 87,
        learningVelocity: 2.3, // modules per week
        skillProgress: {
          'Safety Protocols': 95,
          'Customer Service': 78,
          'Leadership': 45,
          'Technical Skills': 67
        },
        timeSpentDaily: [45, 32, 67, 23, 89, 34, 12], // last 7 days in minutes
        moduleCompletions: [
          {
            moduleId: 'safety_001',
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            score: 92,
            timeSpent: 45
          },
          {
            moduleId: 'customer_001',
            completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            score: 87,
            timeSpent: 67
          }
        ],
        streakDays: 12,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        preferredLearningTime: '09:00-11:00',
        deviceUsage: {
          mobile: 65,
          web: 35
        }
      }

      this.setCachedData(cacheKey, mockAnalytics)
      return mockAnalytics

    } catch (error) {
      console.error('❌ Error getting user analytics:', error)
      throw error
    }
  }

  // Company-specific Analytics
  async getCompanyAnalytics(companyId: string): Promise<CompanyAnalytics> {
    const cacheKey = `company_analytics_${companyId}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      const users = await firebaseAdminService.getUsersByCompany(companyId)
      const company = await firebaseAdminService.getCompany(companyId)

      const analytics: CompanyAnalytics = {
        companyId,
        overallEngagement: this.calculateOverallEngagement(users),
        trainingEffectiveness: this.calculateTrainingEffectiveness(users),
        knowledgeRetention: this.calculateKnowledgeRetention(users),
        departmentPerformance: this.calculateDepartmentPerformance(users),
        learningTrends: this.calculateLearningTrends(users),
        topPerformers: this.calculateTopPerformers(users),
        riskUsers: this.calculateRiskUsers(users)
      }

      this.setCachedData(cacheKey, analytics)
      return analytics

    } catch (error) {
      console.error('❌ Error getting company analytics:', error)
      throw error
    }
  }

  // Module-specific Analytics
  async getModuleAnalytics(moduleId: string): Promise<ModuleAnalytics> {
    const cacheKey = `module_analytics_${moduleId}`
    const cached = this.getCachedData(cacheKey)
    if (cached) return cached

    try {
      // TODO: Implement with Firebase data
      const mockAnalytics: ModuleAnalytics = {
        moduleId,
        companyId: 'demo_company',
        viewsCount: 245,
        completionsCount: 213,
        averageScore: 87,
        averageTime: 23,
        completionRate: 86.9,
        userFeedback: 4.2,
        difficultyRating: 3.5,
        dropoffPoints: [
          { section: 'Introduction', dropoffRate: 5 },
          { section: 'Technical Details', dropoffRate: 18 },
          { section: 'Assessment', dropoffRate: 12 }
        ],
        improvementSuggestions: [
          'Simplify technical section explanations',
          'Add more interactive examples',
          'Break down complex concepts into smaller segments'
        ]
      }

      this.setCachedData(cacheKey, mockAnalytics)
      return mockAnalytics

    } catch (error) {
      console.error('❌ Error getting module analytics:', error)
      throw error
    }
  }

  // Advanced Reports
  async generateEngagementReport(companyId: string, startDate: Date, endDate: Date): Promise<{
    summary: any
    userDetails: any[]
    trends: any[]
    recommendations: string[]
  }> {
    try {
      return {
        summary: {
          averageEngagement: 78,
          totalLearningHours: 1247,
          activeUsersPercent: 67,
          topPerformingDepartment: 'Sales'
        },
        userDetails: [], // TODO: Implement
        trends: [], // TODO: Implement
        recommendations: [
          'Increase gamification elements to boost engagement',
          'Implement peer learning features',
          'Create department-specific learning tracks'
        ]
      }
    } catch (error) {
      console.error('❌ Error generating engagement report:', error)
      throw error
    }
  }

  async generateLearningOutcomesReport(companyId: string): Promise<{
    skillsGained: Record<string, number>
    competencyGrowth: any[]
    certificationProgress: any[]
    businessImpact: any
  }> {
    try {
      return {
        skillsGained: {
          'Safety Awareness': 94,
          'Customer Service': 78,
          'Leadership': 56,
          'Technical Skills': 67
        },
        competencyGrowth: [], // TODO: Implement
        certificationProgress: [], // TODO: Implement
        businessImpact: {
          productivityIncrease: '12%',
          customerSatisfactionImprovement: '8%',
          safetyIncidentReduction: '23%'
        }
      }
    } catch (error) {
      console.error('❌ Error generating learning outcomes report:', error)
      throw error
    }
  }

  // Real-time Event Tracking
  async trackEvent(event: {
    type: 'module_start' | 'module_complete' | 'quiz_attempt' | 'login' | 'logout' | 'certificate_earned'
    userId: string
    companyId: string
    moduleId?: string
    metadata?: Record<string, any>
  }): Promise<void> {
    try {
      const eventData = {
        ...event,
        timestamp: new Date().toISOString(),
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      // TODO: Save to Firebase analytics collection
      console.log('📊 Analytics event tracked:', eventData)

      // Invalidate relevant caches
      this.invalidateCache(`user_analytics_${event.userId}`)
      this.invalidateCache(`company_analytics_${event.companyId}`)
      this.invalidateCache(`dashboard_${event.companyId}`)

    } catch (error) {
      console.error('❌ Error tracking analytics event:', error)
    }
  }

  // Helper Methods
  private calculateActiveUsers(users: User[], since: Date): number {
    return users.filter(user => {
      if (!user.lastLogin) return false
      const lastLogin = typeof user.lastLogin === 'string' 
        ? new Date(user.lastLogin) 
        : user.lastLogin.toDate()
      return lastLogin > since
    }).length
  }

  private calculateNewUsers(users: User[], since: Date): number {
    return users.filter(user => {
      const createdAt = typeof user.createdAt === 'string' 
        ? new Date(user.createdAt) 
        : user.createdAt.toDate()
      return createdAt > since
    }).length
  }

  private calculateRetention(users: User[]): number {
    // Mock calculation - implement with actual retention logic
    return 72.5
  }

  private calculateAverageSessionDuration(users: User[]): number {
    // Mock calculation - implement with session tracking
    return 28.5 // minutes
  }

  private async getTotalModules(companies: Company[]): Promise<number> {
    let total = 0
    for (const company of companies) {
      const modules = await firebaseAdminService.getModulesForCompany(company.id)
      total += modules.length
    }
    return total
  }

  private calculateCompletedModules(users: User[]): number {
    return users.reduce((total, user) => total + user.progress.completedModules, 0)
  }

  private calculateAverageCompletionTime(users: User[]): number {
    const totalTime = users.reduce((total, user) => total + user.progress.totalTimeSpent, 0)
    const totalModules = users.reduce((total, user) => total + user.progress.completedModules, 0)
    return totalModules > 0 ? totalTime / totalModules : 0
  }

  private calculateCompletionRate(users: User[]): number {
    const completed = users.reduce((total, user) => total + user.progress.completedModules, 0)
    const total = users.reduce((total, user) => total + user.progress.totalModules, 0)
    return total > 0 ? (completed / total) * 100 : 0
  }

  private calculateAverageQuizScore(users: User[]): number {
    const scores = users.map(user => user.progress.averageScore).filter(score => score > 0)
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
  }

  private calculateCertificatesEarned(users: User[]): number {
    return users.reduce((total, user) => total + user.progress.certificatesEarned, 0)
  }

  private calculateLearningPaths(companies: Company[]): number {
    // Mock calculation
    return companies.length * 3 // Average 3 learning paths per company
  }

  private calculateTotalRevenue(companies: Company[]): number {
    return companies.reduce((total, company) => {
      const planRevenue = this.getPlanPrice(company.plan) * company.currentUsers
      return total + planRevenue
    }, 0)
  }

  private calculateMRR(companies: Company[]): number {
    return this.calculateTotalRevenue(companies) // Assuming monthly billing
  }

  private calculateChurnRate(companies: Company[]): number {
    // Mock calculation - implement with actual churn tracking
    return 3.2
  }

  private calculateCLV(companies: Company[]): number {
    // Mock calculation
    return 2847
  }

  private calculatePlanDistribution(companies: Company[]): Record<string, number> {
    const distribution: Record<string, number> = {}
    companies.forEach(company => {
      distribution[company.plan] = (distribution[company.plan] || 0) + 1
    })
    return distribution
  }

  private async getSupportTicketCount(): Promise<number> {
    const tickets = await firebaseAdminService.getSupportTickets({ limit: 1000 })
    return tickets.length
  }

  private calculateUserGrowthRate(users: User[]): number {
    // Mock calculation - implement with time series data
    return 12.3
  }

  private calculateRevenueGrowthRate(companies: Company[]): number {
    // Mock calculation
    return 8.7
  }

  private calculateModuleUsageGrowth(users: User[]): number {
    // Mock calculation
    return 15.2
  }

  private calculateCompanyGrowthRate(companies: Company[]): number {
    // Mock calculation
    return 23.5
  }

  private calculateOverallEngagement(users: User[]): number {
    // Mock calculation
    return 78.4
  }

  private calculateTrainingEffectiveness(users: User[]): number {
    // Mock calculation
    return 83.2
  }

  private calculateKnowledgeRetention(users: User[]): number {
    // Mock calculation
    return 76.8
  }

  private calculateDepartmentPerformance(users: User[]): Record<string, any> {
    // Mock calculation
    return {
      'Sales': { averageScore: 87, completionRate: 92, engagementLevel: 89 },
      'Marketing': { averageScore: 83, completionRate: 88, engagementLevel: 85 },
      'Support': { averageScore: 91, completionRate: 95, engagementLevel: 93 }
    }
  }

  private calculateLearningTrends(users: User[]): any[] {
    // Mock calculation
    return []
  }

  private calculateTopPerformers(users: User[]): any[] {
    return users
      .sort((a, b) => b.progress.averageScore - a.progress.averageScore)
      .slice(0, 10)
      .map(user => ({
        userId: user.id,
        userName: user.name,
        score: user.progress.averageScore,
        completions: user.progress.completedModules
      }))
  }

  private calculateRiskUsers(users: User[]): any[] {
    // Mock calculation - users with low engagement
    return users
      .filter(user => user.progress.completedModules < 2)
      .slice(0, 5)
      .map(user => ({
        userId: user.id,
        userName: user.name,
        riskScore: 85,
        reason: 'Low module completion rate'
      }))
  }

  private getPlanPrice(plan: string): number {
    switch (plan) {
      case 'basic': return 12
      case 'growth': return 29
      case 'enterprise': return 79
      default: return 12
    }
  }

  private getDefaultMetrics(): AnalyticsMetrics {
    return {
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0,
      userRetention: 0,
      averageSessionDuration: 0,
      dailyActiveUsers: 0,
      weeklyActiveUsers: 0,
      monthlyActiveUsers: 0,
      totalModules: 0,
      completedModules: 0,
      averageCompletionTime: 0,
      completionRate: 0,
      averageQuizScore: 0,
      certificatesEarned: 0,
      learningPaths: 0,
      totalRevenue: 0,
      monthlyRecurringRevenue: 0,
      churnRate: 0,
      customerLifetimeValue: 0,
      planDistribution: {},
      supportTickets: 0,
      systemUptime: 0,
      averageResponseTime: 0,
      errorRate: 0,
      apiCallsPerDay: 0,
      userGrowthRate: 0,
      revenueGrowthRate: 0,
      moduleUsageGrowth: 0,
      companyGrowthRate: 0
    }
  }

  // Cache Management
  private getCachedData(key: string): any {
    const cached = this.cache.get(key)
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return cached.data
    }
    return null
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  private invalidateCache(key: string): void {
    this.cache.delete(key)
  }

  // Export functionality
  async exportAnalytics(companyId: string, format: 'csv' | 'json' | 'pdf'): Promise<{
    url: string
    filename: string
    size: number
  }> {
    try {
      // TODO: Implement actual export functionality
      const filename = `tutora_analytics_${companyId}_${new Date().toISOString().split('T')[0]}.${format}`
      
      return {
        url: `/exports/${filename}`,
        filename,
        size: 2048000 // Mock 2MB file
      }
    } catch (error) {
      console.error('❌ Error exporting analytics:', error)
      throw error
    }
  }
}

export const analyticsService = new AnalyticsService() 