import { NextRequest, NextResponse } from 'next/server'
import { performanceMonitor } from '@/lib/performance-monitor'

// GET /api/performance/health - Get system health status
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const includeHistory = url.searchParams.get('includeHistory') === 'true'
    const metric = url.searchParams.get('metric')

    // Get current performance metrics
    const currentMetrics = performanceMonitor.getCurrentMetrics()
    const healthChecks = performanceMonitor.getHealthChecks()
    const activeAlerts = performanceMonitor.getActiveAlerts()

    // Build response
    const response: any = {
      success: true,
      status: 'healthy',
      metrics: currentMetrics,
      healthChecks: healthChecks,
      alerts: activeAlerts,
      summary: {
        totalServices: healthChecks.length,
        healthyServices: healthChecks.filter(hc => hc.status === 'healthy').length,
        degradedServices: healthChecks.filter(hc => hc.status === 'degraded').length,
        unhealthyServices: healthChecks.filter(hc => hc.status === 'unhealthy').length,
        criticalAlerts: activeAlerts.filter(a => a.type === 'critical').length,
        averageResponseTime: currentMetrics.averageResponseTime,
        errorRate: currentMetrics.errorRate,
        systemLoad: {
          cpu: currentMetrics.cpuUsage,
          memory: currentMetrics.memoryUsage,
          disk: currentMetrics.diskUsage
        },
        uptime: {
          percentage: healthChecks.length > 0 
            ? healthChecks.reduce((sum, hc) => sum + hc.uptime, 0) / healthChecks.length 
            : 100,
          status: healthChecks.every(hc => hc.status === 'healthy') ? 'excellent' : 
                  healthChecks.some(hc => hc.status === 'unhealthy') ? 'degraded' : 'good'
        }
      },
      optimizationSuggestions: performanceMonitor.getOptimizationSuggestions(),
      lastUpdated: new Date().toISOString()
    }

    // Include metric history if requested
    if (includeHistory) {
      const metrics = ['cpuUsage', 'memoryUsage', 'averageResponseTime', 'errorRate']
      response.history = {}
      
      for (const metricName of metrics) {
        response.history[metricName] = performanceMonitor.getMetricHistory(metricName, 24) // Last 24 data points
      }
    }

    // Include specific metric history if requested
    if (metric) {
      response.metricHistory = {
        metric,
        data: performanceMonitor.getMetricHistory(metric, 50),
        latest: currentMetrics[metric as keyof typeof currentMetrics]
      }
    }

    // Determine overall status
    const hasUnhealthyServices = healthChecks.some(hc => hc.status === 'unhealthy')
    const hasCriticalAlerts = activeAlerts.some(a => a.type === 'critical')
    const highResourceUsage = currentMetrics.cpuUsage > 90 || currentMetrics.memoryUsage > 90

    if (hasUnhealthyServices || hasCriticalAlerts || highResourceUsage) {
      response.status = 'unhealthy'
    } else if (healthChecks.some(hc => hc.status === 'degraded') || activeAlerts.length > 0) {
      response.status = 'degraded'
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Error getting performance health:', error)
    return NextResponse.json(
      { 
        success: false,
        status: 'unhealthy',
        error: 'Failed to get performance metrics',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// POST /api/performance/health/alert - Create or resolve alerts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, alertId, type, category, message, affectedService, metadata } = body

    if (!action) {
      return NextResponse.json(
        { error: 'action is required (create or resolve)' },
        { status: 400 }
      )
    }

    if (action === 'create') {
      if (!type || !category || !message || !affectedService) {
        return NextResponse.json(
          { error: 'type, category, message, and affectedService are required for creating alerts' },
          { status: 400 }
        )
      }

      performanceMonitor.createAlert({
        type,
        category,
        message,
        affectedService,
        metadata
      })

      return NextResponse.json({
        success: true,
        message: 'Alert created successfully'
      })

    } else if (action === 'resolve') {
      if (!alertId) {
        return NextResponse.json(
          { error: 'alertId is required for resolving alerts' },
          { status: 400 }
        )
      }

      performanceMonitor.resolveAlert(alertId)

      return NextResponse.json({
        success: true,
        message: 'Alert resolved successfully'
      })

    } else {
      return NextResponse.json(
        { error: 'action must be either "create" or "resolve"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('❌ Error managing alert:', error)
    return NextResponse.json(
      { error: 'Failed to manage alert' },
      { status: 500 }
    )
  }
}

// PUT /api/performance/health/thresholds - Update monitoring thresholds
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { responseTime, errorRate, cpuUsage, memoryUsage, diskUsage } = body

    const thresholds: any = {}
    if (responseTime !== undefined) thresholds.responseTime = responseTime
    if (errorRate !== undefined) thresholds.errorRate = errorRate
    if (cpuUsage !== undefined) thresholds.cpuUsage = cpuUsage
    if (memoryUsage !== undefined) thresholds.memoryUsage = memoryUsage
    if (diskUsage !== undefined) thresholds.diskUsage = diskUsage

    performanceMonitor.updateThresholds(thresholds)

    return NextResponse.json({
      success: true,
      message: 'Thresholds updated successfully',
      thresholds
    })

  } catch (error) {
    console.error('❌ Error updating thresholds:', error)
    return NextResponse.json(
      { error: 'Failed to update thresholds' },
      { status: 500 }
    )
  }
} 