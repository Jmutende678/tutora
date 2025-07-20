// Plan enforcement logic for Tutora platform
export type PlanType = 'basic' | 'growth' | 'enterprise'

export interface PlanLimits {
  maxUsers: number
  maxAIModules: number // per month
  maxStorage: number // in GB
  features: {
    customBranding: boolean
    whiteLabel: boolean
    advancedAnalytics: boolean
    apiAccess: boolean
    prioritySupport: boolean
    ssoIntegration: boolean
    customIntegrations: boolean
    unlimitedModules: boolean
    leaderboards: boolean
    certificates: boolean
    mobileApp: boolean
    offlineAccess: boolean
  }
  supportSLA: {
    responseTime: number // in hours
    availability: '8x5' | '24x7'
    dedicatedManager: boolean
  }
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  basic: {
    maxUsers: 50,
    maxAIModules: 10,
    maxStorage: 5,
    features: {
      customBranding: false,
      whiteLabel: false,
      advancedAnalytics: false,
      apiAccess: false,
      prioritySupport: false,
      ssoIntegration: false,
      customIntegrations: false,
      unlimitedModules: false,
      leaderboards: true,
      certificates: true,
      mobileApp: true,
      offlineAccess: false
    },
    supportSLA: {
      responseTime: 24,
      availability: '8x5',
      dedicatedManager: false
    }
  },
  growth: {
    maxUsers: 200,
    maxAIModules: 50,
    maxStorage: 25,
    features: {
      customBranding: true,
      whiteLabel: false,
      advancedAnalytics: true,
      apiAccess: true,
      prioritySupport: true,
      ssoIntegration: true,
      customIntegrations: false,
      unlimitedModules: false,
      leaderboards: true,
      certificates: true,
      mobileApp: true,
      offlineAccess: true
    },
    supportSLA: {
      responseTime: 4,
      availability: '24x7',
      dedicatedManager: false
    }
  },
  enterprise: {
    maxUsers: -1, // unlimited
    maxAIModules: -1, // unlimited
    maxStorage: 100,
    features: {
      customBranding: true,
      whiteLabel: true,
      advancedAnalytics: true,
      apiAccess: true,
      prioritySupport: true,
      ssoIntegration: true,
      customIntegrations: true,
      unlimitedModules: true,
      leaderboards: true,
      certificates: true,
      mobileApp: true,
      offlineAccess: true
    },
    supportSLA: {
      responseTime: 1,
      availability: '24x7',
      dedicatedManager: true
    }
  }
}

export interface UsageStats {
  currentUsers: number
  currentAIModules: number // this month
  currentStorage: number // in GB
  lastResetDate: string // for monthly limits
}

export interface EnforcementResult {
  allowed: boolean
  reason?: string
  upgradeRequired?: PlanType[]
  currentUsage?: any
  limit?: any
}

export class PlanEnforcement {
  private planType: PlanType
  private limits: PlanLimits
  private usage: UsageStats

  constructor(planType: PlanType, usage: UsageStats) {
    this.planType = planType
    this.limits = PLAN_LIMITS[planType]
    this.usage = usage
  }

  // Check if user can be added to company
  canAddUser(): EnforcementResult {
    if (this.limits.maxUsers === -1) {
      return { allowed: true }
    }

    if (this.usage.currentUsers >= this.limits.maxUsers) {
      return {
        allowed: false,
        reason: `Your ${this.planType} plan is limited to ${this.limits.maxUsers} users. You currently have ${this.usage.currentUsers} users.`,
        upgradeRequired: this.planType === 'basic' ? ['growth', 'enterprise'] : ['enterprise'],
        currentUsage: this.usage.currentUsers,
        limit: this.limits.maxUsers
      }
    }

    return { allowed: true }
  }

  // Check if AI module can be created
  canCreateAIModule(): EnforcementResult {
    if (this.limits.maxAIModules === -1) {
      return { allowed: true }
    }

    // Check if monthly limit reached
    const currentMonth = new Date().getMonth()
    const lastResetMonth = new Date(this.usage.lastResetDate).getMonth()
    
    // Reset monthly usage if new month
    if (currentMonth !== lastResetMonth) {
      this.usage.currentAIModules = 0
      this.usage.lastResetDate = new Date().toISOString()
    }

    if (this.usage.currentAIModules >= this.limits.maxAIModules) {
      return {
        allowed: false,
        reason: `Your ${this.planType} plan is limited to ${this.limits.maxAIModules} AI modules per month. You've used ${this.usage.currentAIModules} this month.`,
        upgradeRequired: this.planType === 'basic' ? ['growth', 'enterprise'] : ['enterprise'],
        currentUsage: this.usage.currentAIModules,
        limit: this.limits.maxAIModules
      }
    }

    return { allowed: true }
  }

  // Check if feature is available
  canUseFeature(feature: keyof PlanLimits['features']): EnforcementResult {
    if (this.limits.features[feature]) {
      return { allowed: true }
    }

    const featureNames: Record<keyof PlanLimits['features'], string> = {
      customBranding: 'Custom Branding',
      whiteLabel: 'White Label',
      advancedAnalytics: 'Advanced Analytics',
      apiAccess: 'API Access',
      prioritySupport: 'Priority Support',
      ssoIntegration: 'SSO Integration',
      customIntegrations: 'Custom Integrations',
      unlimitedModules: 'Unlimited Modules',
      leaderboards: 'Leaderboards',
      certificates: 'Certificates',
      mobileApp: 'Mobile App',
      offlineAccess: 'Offline Access'
    }

    return {
      allowed: false,
      reason: `${featureNames[feature]} is not available on your ${this.planType} plan.`,
      upgradeRequired: this.getUpgradeOptions(feature)
    }
  }

  // Get storage usage enforcement
  canUploadFile(fileSizeGB: number): EnforcementResult {
    const totalAfterUpload = this.usage.currentStorage + fileSizeGB

    if (totalAfterUpload > this.limits.maxStorage) {
      return {
        allowed: false,
        reason: `Upload would exceed your storage limit of ${this.limits.maxStorage}GB. Current usage: ${this.usage.currentStorage}GB.`,
        upgradeRequired: this.planType === 'basic' ? ['growth', 'enterprise'] : ['enterprise'],
        currentUsage: this.usage.currentStorage,
        limit: this.limits.maxStorage
      }
    }

    return { allowed: true }
  }

  // Get support SLA for current plan
  getSupportSLA() {
    return this.limits.supportSLA
  }

  // Get plan overview
  getPlanOverview() {
    return {
      plan: this.planType,
      limits: this.limits,
      usage: this.usage,
      utilizationPercentages: {
        users: this.limits.maxUsers === -1 ? 0 : (this.usage.currentUsers / this.limits.maxUsers) * 100,
        aiModules: this.limits.maxAIModules === -1 ? 0 : (this.usage.currentAIModules / this.limits.maxAIModules) * 100,
        storage: (this.usage.currentStorage / this.limits.maxStorage) * 100
      }
    }
  }

  // Get upgrade recommendations
  getUpgradeRecommendations(): { plan: PlanType; benefits: string[] }[] {
    if (this.planType === 'enterprise') return []

    const recommendations = []
    
    if (this.planType === 'basic') {
      recommendations.push({
        plan: 'growth' as PlanType,
        benefits: [
          '4x more users (200 vs 50)',
          '5x more AI modules (50 vs 10)',
          'Custom branding',
          'Advanced analytics',
          'API access',
          'SSO integration',
          'Priority support (4hr vs 24hr response)'
        ]
      })
    }

    recommendations.push({
      plan: 'enterprise' as PlanType,
      benefits: [
        'Unlimited users',
        'Unlimited AI modules',
        'White label solution',
        'Custom integrations',
        'Dedicated success manager',
        '1-hour support response time',
        '100GB storage'
      ]
    })

    return recommendations
  }

  private getUpgradeOptions(feature: keyof PlanLimits['features']): PlanType[] {
    const options: PlanType[] = []
    
    if (this.planType === 'basic') {
      if (PLAN_LIMITS.growth.features[feature]) options.push('growth')
      if (PLAN_LIMITS.enterprise.features[feature]) options.push('enterprise')
    } else if (this.planType === 'growth') {
      if (PLAN_LIMITS.enterprise.features[feature]) options.push('enterprise')
    }

    return options
  }

  // Static helper to check plan enforcement without instance
  static checkLimit(
    planType: PlanType, 
    usage: UsageStats, 
    action: 'addUser' | 'createAIModule' | 'uploadFile',
    params?: any
  ): EnforcementResult {
    const enforcement = new PlanEnforcement(planType, usage)
    
    switch (action) {
      case 'addUser':
        return enforcement.canAddUser()
      case 'createAIModule':
        return enforcement.canCreateAIModule()
      case 'uploadFile':
        return enforcement.canUploadFile(params?.fileSizeGB || 0)
      default:
        return { allowed: false, reason: 'Unknown action' }
    }
  }
}

// Helper function for frontend components
export function getUpgradeMessage(result: EnforcementResult): string {
  if (result.allowed) return ''
  
  let message = result.reason || 'Action not allowed on your current plan.'
  
  if (result.upgradeRequired && result.upgradeRequired.length > 0) {
    const plans = result.upgradeRequired.map(plan => plan.charAt(0).toUpperCase() + plan.slice(1)).join(' or ')
    message += ` Upgrade to ${plans} to continue.`
  }
  
  return message
}

// Usage tracking helper
export function trackUsage(planType: PlanType, action: string, metadata?: any) {
  // In production, this would send to analytics
  console.log('Usage tracked:', {
    plan: planType,
    action,
    metadata,
    timestamp: new Date().toISOString()
  })
} 