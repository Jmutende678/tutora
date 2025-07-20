// Performance Monitoring Service for Tutora Platform
export interface PerformanceMetrics {
  // System Health
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkLatency: number
  
  // API Performance
  averageResponseTime: number
  p95ResponseTime: number
  p99ResponseTime: number
  requestsPerSecond: number
  errorRate: number
  
  // Database Performance
  dbConnectionPool: number
  dbQueryTime: number
  dbConnections: number
  
  // Application Performance
  renderTime: number
  bundleSize: number
  cacheHitRate: number
  
  // User Experience
  pageLoadTime: number
  timeToInteractive: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
}

export interface Alert {
  id: string
  type: 'warning' | 'error' | 'critical'
  category: 'performance' | 'security' | 'availability' | 'business'
  message: string
  timestamp: string
  resolved: boolean
  affectedService: string
  metadata?: Record<string, any>
}

export interface HealthCheck {
  service: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime: number
  lastChecked: string
  uptime: number
  version?: string
  dependencies?: HealthCheck[]
}

export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()
  private alerts: Alert[] = []
  private healthChecks: Map<string, HealthCheck> = new Map()
  private thresholds = {
    responseTime: 1000, // 1 second
    errorRate: 5, // 5%
    cpuUsage: 80, // 80%
    memoryUsage: 85, // 85%
    diskUsage: 90 // 90%
  }

  constructor() {
    this.initializeMonitoring()
  }

  // Initialize monitoring
  private initializeMonitoring(): void {
    // Start periodic health checks
    setInterval(() => {
      this.performHealthChecks()
    }, 30000) // Every 30 seconds

    // Start metric collection
    setInterval(() => {
      this.collectMetrics()
    }, 5000) // Every 5 seconds

    console.log('🔍 Performance monitoring initialized')
  }

  // Collect system metrics
  async collectMetrics(): Promise<void> {
    try {
      const metrics: PerformanceMetrics = {
        // System metrics (mock data - implement with actual system monitoring)
        cpuUsage: this.generateMetric('cpu', 20, 80),
        memoryUsage: this.generateMetric('memory', 30, 70),
        diskUsage: this.generateMetric('disk', 15, 60),
        networkLatency: this.generateMetric('network', 10, 50),

        // API metrics
        averageResponseTime: this.generateMetric('responseTime', 100, 500),
        p95ResponseTime: this.generateMetric('p95ResponseTime', 200, 800),
        p99ResponseTime: this.generateMetric('p99ResponseTime', 300, 1200),
        requestsPerSecond: this.generateMetric('rps', 50, 200),
        errorRate: this.generateMetric('errorRate', 0, 3),

        // Database metrics
        dbConnectionPool: this.generateMetric('dbPool', 5, 20),
        dbQueryTime: this.generateMetric('dbQuery', 10, 100),
        dbConnections: this.generateMetric('dbConnections', 10, 50),

        // Application metrics
        renderTime: this.generateMetric('render', 50, 200),
        bundleSize: 1024, // KB
        cacheHitRate: this.generateMetric('cacheHit', 80, 95),

        // User experience metrics
        pageLoadTime: this.generateMetric('pageLoad', 800, 2000),
        timeToInteractive: this.generateMetric('tti', 1000, 3000),
        firstContentfulPaint: this.generateMetric('fcp', 400, 1200),
        largestContentfulPaint: this.generateMetric('lcp', 800, 2500),
        cumulativeLayoutShift: this.generateMetric('cls', 0, 0.25)
      }

      // Store metrics for trend analysis
      this.storeMetrics(metrics)

      // Check for threshold violations
      this.checkThresholds(metrics)

    } catch (error) {
      console.error('❌ Error collecting metrics:', error)
    }
  }

  // Perform health checks on critical services
  async performHealthChecks(): Promise<void> {
    const services = [
      'database',
      'authentication',
      'storage',
      'email',
      'analytics',
      'mobile-api'
    ]

    for (const service of services) {
      try {
        const healthCheck = await this.checkServiceHealth(service)
        this.healthChecks.set(service, healthCheck)

        // Create alerts for unhealthy services
        if (healthCheck.status === 'unhealthy') {
          this.createAlert({
            type: 'error',
            category: 'availability',
            message: `Service ${service} is unhealthy`,
            affectedService: service,
            metadata: { responseTime: healthCheck.responseTime }
          })
        }
      } catch (error) {
        console.error(`❌ Error checking ${service} health:`, error)
      }
    }
  }

  // Check individual service health
  private async checkServiceHealth(service: string): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      // Mock health check - implement actual service checks
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
      
      const responseTime = Date.now() - startTime
      const isHealthy = responseTime < 1000 && Math.random() > 0.05 // 95% success rate

      return {
        service,
        status: isHealthy ? 'healthy' : 'degraded',
        responseTime,
        lastChecked: new Date().toISOString(),
        uptime: 99.5 + Math.random() * 0.5, // Mock uptime
        version: '1.0.0'
      }
    } catch (error) {
      return {
        service,
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        uptime: 0
      }
    }
  }

  // Store metrics for historical analysis
  private storeMetrics(metrics: PerformanceMetrics): void {
    Object.entries(metrics).forEach(([key, value]) => {
      if (typeof value === 'number') {
        if (!this.metrics.has(key)) {
          this.metrics.set(key, [])
        }
        const metricArray = this.metrics.get(key)!
        metricArray.push(value)
        
        // Keep only last 100 data points
        if (metricArray.length > 100) {
          metricArray.shift()
        }
      }
    })
  }

  // Check metric thresholds and create alerts
  private checkThresholds(metrics: PerformanceMetrics): void {
    const checks = [
      {
        metric: 'averageResponseTime',
        value: metrics.averageResponseTime,
        threshold: this.thresholds.responseTime,
        message: `Average response time is ${metrics.averageResponseTime}ms (threshold: ${this.thresholds.responseTime}ms)`
      },
      {
        metric: 'errorRate',
        value: metrics.errorRate,
        threshold: this.thresholds.errorRate,
        message: `Error rate is ${metrics.errorRate}% (threshold: ${this.thresholds.errorRate}%)`
      },
      {
        metric: 'cpuUsage',
        value: metrics.cpuUsage,
        threshold: this.thresholds.cpuUsage,
        message: `CPU usage is ${metrics.cpuUsage}% (threshold: ${this.thresholds.cpuUsage}%)`
      },
      {
        metric: 'memoryUsage',
        value: metrics.memoryUsage,
        threshold: this.thresholds.memoryUsage,
        message: `Memory usage is ${metrics.memoryUsage}% (threshold: ${this.thresholds.memoryUsage}%)`
      }
    ]

    for (const check of checks) {
      if (check.value > check.threshold) {
        this.createAlert({
          type: check.metric === 'errorRate' || check.value > check.threshold * 1.2 ? 'error' : 'warning',
          category: 'performance',
          message: check.message,
          affectedService: 'system',
          metadata: { metric: check.metric, value: check.value, threshold: check.threshold }
        })
      }
    }
  }

  // Create performance alert
  createAlert(alertData: Omit<Alert, 'id' | 'timestamp' | 'resolved'>): void {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      resolved: false,
      ...alertData
    }

    this.alerts.push(alert)

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts.shift()
    }

    console.log(`🚨 Performance alert created: ${alert.message}`)

    // Send notification for critical alerts
    if (alert.type === 'critical') {
      this.sendCriticalAlertNotification(alert)
    }
  }

  // Send critical alert notification
  private async sendCriticalAlertNotification(alert: Alert): Promise<void> {
    try {
      // TODO: Implement email/Slack/SMS notification
      console.log('🚨 CRITICAL ALERT:', alert.message)
      
      // Example: Send to monitoring service
      // await monitoringService.sendAlert(alert)
    } catch (error) {
      console.error('❌ Error sending critical alert notification:', error)
    }
  }

  // Get current performance metrics
  getCurrentMetrics(): PerformanceMetrics {
    return {
      cpuUsage: this.getLatestMetric('cpuUsage') || 0,
      memoryUsage: this.getLatestMetric('memoryUsage') || 0,
      diskUsage: this.getLatestMetric('diskUsage') || 0,
      networkLatency: this.getLatestMetric('networkLatency') || 0,
      averageResponseTime: this.getLatestMetric('averageResponseTime') || 0,
      p95ResponseTime: this.getLatestMetric('p95ResponseTime') || 0,
      p99ResponseTime: this.getLatestMetric('p99ResponseTime') || 0,
      requestsPerSecond: this.getLatestMetric('requestsPerSecond') || 0,
      errorRate: this.getLatestMetric('errorRate') || 0,
      dbConnectionPool: this.getLatestMetric('dbConnectionPool') || 0,
      dbQueryTime: this.getLatestMetric('dbQueryTime') || 0,
      dbConnections: this.getLatestMetric('dbConnections') || 0,
      renderTime: this.getLatestMetric('renderTime') || 0,
      bundleSize: 1024,
      cacheHitRate: this.getLatestMetric('cacheHitRate') || 0,
      pageLoadTime: this.getLatestMetric('pageLoadTime') || 0,
      timeToInteractive: this.getLatestMetric('timeToInteractive') || 0,
      firstContentfulPaint: this.getLatestMetric('firstContentfulPaint') || 0,
      largestContentfulPaint: this.getLatestMetric('largestContentfulPaint') || 0,
      cumulativeLayoutShift: this.getLatestMetric('cumulativeLayoutShift') || 0
    }
  }

  // Get metric history for trends
  getMetricHistory(metric: string, limit: number = 50): number[] {
    const metricArray = this.metrics.get(metric) || []
    return metricArray.slice(-limit)
  }

  // Get active alerts
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.resolved)
  }

  // Get all health checks
  getHealthChecks(): HealthCheck[] {
    return Array.from(this.healthChecks.values())
  }

  // Resolve alert
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolved = true
      console.log(`✅ Alert resolved: ${alert.message}`)
    }
  }

  // Update thresholds
  updateThresholds(newThresholds: Partial<typeof this.thresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds }
    console.log('⚙️ Performance thresholds updated:', this.thresholds)
  }

  // Generate mock metric value
  private generateMetric(metricName: string, min: number, max: number): number {
    const base = min + Math.random() * (max - min)
    
    // Add some variation based on time (simulate daily patterns)
    const hour = new Date().getHours()
    const dailyVariation = Math.sin((hour / 24) * 2 * Math.PI) * 0.3
    
    return Math.max(min, Math.min(max, base + dailyVariation * (max - min)))
  }

  // Get latest metric value
  private getLatestMetric(metric: string): number | undefined {
    const metricArray = this.metrics.get(metric)
    return metricArray ? metricArray[metricArray.length - 1] : undefined
  }

  // Performance optimization suggestions
  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = []
    const metrics = this.getCurrentMetrics()

    if (metrics.averageResponseTime > 800) {
      suggestions.push('Consider implementing API response caching')
    }
    
    if (metrics.errorRate > 2) {
      suggestions.push('Review error handling and implement circuit breakers')
    }
    
    if (metrics.cpuUsage > 70) {
      suggestions.push('Consider scaling horizontally or optimizing CPU-intensive operations')
    }
    
    if (metrics.memoryUsage > 80) {
      suggestions.push('Investigate memory leaks and optimize memory usage')
    }
    
    if (metrics.cacheHitRate < 85) {
      suggestions.push('Optimize caching strategy to improve hit rate')
    }
    
    if (metrics.pageLoadTime > 1500) {
      suggestions.push('Optimize frontend bundle size and implement lazy loading')
    }

    return suggestions
  }

  // Export performance report
  generatePerformanceReport(): {
    summary: any
    metrics: PerformanceMetrics
    alerts: Alert[]
    healthChecks: HealthCheck[]
    suggestions: string[]
    timestamp: string
  } {
    const metrics = this.getCurrentMetrics()
    
    return {
      summary: {
        overallHealth: this.calculateOverallHealth(),
        criticalIssues: this.getActiveAlerts().filter(a => a.type === 'critical').length,
        averageUptime: this.calculateAverageUptime(),
        performanceScore: this.calculatePerformanceScore()
      },
      metrics,
      alerts: this.getActiveAlerts(),
      healthChecks: this.getHealthChecks(),
      suggestions: this.getOptimizationSuggestions(),
      timestamp: new Date().toISOString()
    }
  }

  // Calculate overall system health
  private calculateOverallHealth(): 'excellent' | 'good' | 'fair' | 'poor' {
    const healthyServices = this.getHealthChecks().filter(hc => hc.status === 'healthy').length
    const totalServices = this.getHealthChecks().length
    const healthPercentage = totalServices > 0 ? (healthyServices / totalServices) * 100 : 100

    if (healthPercentage >= 95) return 'excellent'
    if (healthPercentage >= 85) return 'good'
    if (healthPercentage >= 70) return 'fair'
    return 'poor'
  }

  // Calculate average uptime
  private calculateAverageUptime(): number {
    const healthChecks = this.getHealthChecks()
    if (healthChecks.length === 0) return 100

    const totalUptime = healthChecks.reduce((sum, hc) => sum + hc.uptime, 0)
    return totalUptime / healthChecks.length
  }

  // Calculate performance score
  private calculatePerformanceScore(): number {
    const metrics = this.getCurrentMetrics()
    let score = 100

    // Deduct points for poor performance
    if (metrics.averageResponseTime > 1000) score -= 20
    if (metrics.errorRate > 3) score -= 15
    if (metrics.cpuUsage > 80) score -= 10
    if (metrics.memoryUsage > 85) score -= 10
    if (metrics.pageLoadTime > 2000) score -= 15

    return Math.max(0, score)
  }
}

export const performanceMonitor = new PerformanceMonitor() 