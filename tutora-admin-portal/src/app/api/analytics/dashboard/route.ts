import { NextRequest, NextResponse } from 'next/server'
import { analyticsService } from '@/lib/analytics-service'

// GET /api/analytics/dashboard - Get dashboard metrics
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const companyId = url.searchParams.get('companyId')
    const refresh = url.searchParams.get('refresh') === 'true'

    // Get dashboard metrics
    const metrics = await analyticsService.getDashboardMetrics(companyId || undefined)

    // Add additional computed metrics
    const enhancedMetrics = {
      ...metrics,
      
      // Engagement indicators
      engagementHealth: metrics.completionRate > 80 ? 'excellent' : 
                       metrics.completionRate > 60 ? 'good' : 
                       metrics.completionRate > 40 ? 'fair' : 'poor',
      
      // Growth indicators  
      userGrowthHealth: metrics.userGrowthRate > 20 ? 'excellent' :
                       metrics.userGrowthRate > 10 ? 'good' :
                       metrics.userGrowthRate > 5 ? 'fair' : 'poor',

      // Performance indicators
      systemHealth: metrics.systemUptime > 99.5 ? 'excellent' :
                   metrics.systemUptime > 99 ? 'good' :
                   metrics.systemUptime > 98 ? 'fair' : 'poor',

      // Computed ratios
      revenuePerUser: metrics.totalUsers > 0 ? 
                     Math.round(metrics.totalRevenue / metrics.totalUsers) : 0,
      
      modulesPerUser: metrics.totalUsers > 0 ? 
                     Math.round(metrics.totalModules / metrics.totalUsers * 100) / 100 : 0,

      // Trends (mock data - implement with time series)
      trends: {
        users: [
          { date: '2024-01-01', value: metrics.totalUsers - 50 },
          { date: '2024-01-02', value: metrics.totalUsers - 30 },
          { date: '2024-01-03', value: metrics.totalUsers - 10 },
          { date: '2024-01-04', value: metrics.totalUsers }
        ],
        revenue: [
          { date: '2024-01-01', value: metrics.totalRevenue - 5000 },
          { date: '2024-01-02', value: metrics.totalRevenue - 3000 },
          { date: '2024-01-03', value: metrics.totalRevenue - 1000 },
          { date: '2024-01-04', value: metrics.totalRevenue }
        ],
        completions: [
          { date: '2024-01-01', value: metrics.completedModules - 200 },
          { date: '2024-01-02', value: metrics.completedModules - 120 },
          { date: '2024-01-03', value: metrics.completedModules - 50 },
          { date: '2024-01-04', value: metrics.completedModules }
        ]
      },

      // Real-time activity (mock data)
      recentActivity: [
        {
          type: 'module_completion',
          user: 'Sarah Johnson',
          module: 'Workplace Safety',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        },
        {
          type: 'certificate_earned',
          user: 'Mike Chen',
          certificate: 'Customer Service Excellence',
          timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString()
        },
        {
          type: 'new_user',
          user: 'Lisa Thompson',
          company: 'Tech Solutions Inc',
          timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString()
        }
      ],

      // Alerts and recommendations
      alerts: [
        ...(metrics.completionRate < 60 ? [{
          type: 'warning',
          message: 'Module completion rate is below 60%. Consider reviewing content difficulty.',
          priority: 'medium'
        }] : []),
        ...(metrics.userGrowthRate < 5 ? [{
          type: 'info',
          message: 'User growth rate has slowed. Consider marketing initiatives.',
          priority: 'low'
        }] : []),
        ...(metrics.systemUptime < 99 ? [{
          type: 'error',
          message: 'System uptime is below target. Check infrastructure.',
          priority: 'high'
        }] : [])
      ],

      recommendations: [
        'Implement gamification features to boost engagement',
        'Create department-specific learning tracks',
        'Add peer learning and collaboration features',
        'Optimize mobile app performance for better retention'
      ],

      // Metadata
      lastUpdated: new Date().toISOString(),
      dataFreshness: 'real-time',
      version: '2.0'
    }

    return NextResponse.json({
      success: true,
      metrics: enhancedMetrics,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error getting dashboard analytics:', error)
    return NextResponse.json(
      { error: 'Failed to get analytics data' },
      { status: 500 }
    )
  }
}

// POST /api/analytics/dashboard/track - Track analytics event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, userId, companyId, moduleId, metadata } = body

    if (!type || !userId || !companyId) {
      return NextResponse.json(
        { error: 'type, userId, and companyId are required' },
        { status: 400 }
      )
    }

    // Track the event
    await analyticsService.trackEvent({
      type,
      userId,
      companyId,
      moduleId,
      metadata
    })

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    })

  } catch (error) {
    console.error('❌ Error tracking analytics event:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
} 