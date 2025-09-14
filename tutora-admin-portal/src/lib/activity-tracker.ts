import { supabaseAdmin, isSupabaseConfigured } from './supabase'

export interface ActivityEvent {
  id?: string
  user_id?: string
  session_id: string
  event_type: string
  event_data: any
  page_url: string
  user_agent: string
  ip_address?: string
  country?: string
  city?: string
  device_type: 'desktop' | 'mobile' | 'tablet'
  browser: string
  timestamp: string
}

export interface UserSession {
  session_id: string
  user_id?: string
  start_time: string
  end_time?: string
  page_views: number
  total_time: number
  bounce_rate: number
  conversion_events: number
  device_info: any
  location_info: any
}

export class ActivityTracker {
  private sessionId: string
  private userId?: string
  private startTime: Date
  private events: ActivityEvent[] = []
  private isTracking: boolean = false

  constructor(userId?: string) {
    this.sessionId = this.generateSessionId()
    this.userId = userId
    this.startTime = new Date()
    this.initializeTracking()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`
  }

  private initializeTracking() {
    if (typeof window === 'undefined') return

    this.isTracking = true
    
    // Track page views
    this.trackPageView()
    
    // Track clicks
    document.addEventListener('click', this.handleClick.bind(this))
    
    // Track scroll depth
    window.addEventListener('scroll', this.handleScroll.bind(this))
    
    // Track time on page
    window.addEventListener('beforeunload', this.handlePageUnload.bind(this))
    
    // Track form interactions
    document.addEventListener('submit', this.handleFormSubmit.bind(this))
    
    // Track button clicks specifically
    document.addEventListener('click', this.handleButtonClick.bind(this))
    
    // Track mouse movements (heatmap data)
    document.addEventListener('mousemove', this.throttle(this.handleMouseMove.bind(this), 1000))
    
    // Track keyboard interactions
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    
    // Track window focus/blur
    window.addEventListener('focus', () => this.trackEvent('window_focus'))
    window.addEventListener('blur', () => this.trackEvent('window_blur'))
    
    // Track errors
    window.addEventListener('error', this.handleError.bind(this))
    
    console.log('🔍 Activity tracking initialized for session:', this.sessionId)
  }

  private async trackEvent(eventType: string, eventData: any = {}) {
    if (!this.isTracking) return

    const event: ActivityEvent = {
      session_id: this.sessionId,
      user_id: this.userId,
      event_type: eventType,
      event_data: eventData,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      device_type: this.getDeviceType(),
      browser: this.getBrowser(),
      timestamp: new Date().toISOString()
    }

    // Add location data if available
    try {
      const locationData = await this.getLocationData()
      event.country = locationData.country
      event.city = locationData.city
      event.ip_address = locationData.ip
    } catch (error) {
      console.warn('Could not get location data:', error)
    }

    this.events.push(event)
    
    // Send to backend immediately for critical events
    if (['purchase', 'signup', 'error', 'conversion'].includes(eventType)) {
      await this.sendEvent(event)
    }
    
    // Batch send other events every 10 seconds
    if (this.events.length >= 10) {
      await this.sendBatchEvents()
    }
  }

  private async sendEvent(event: ActivityEvent) {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: [event] })
      })
    } catch (error) {
      console.error('Failed to send activity event:', error)
    }
  }

  private async sendBatchEvents() {
    if (this.events.length === 0) return

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: this.events })
      })
      
      this.events = [] // Clear sent events
    } catch (error) {
      console.error('Failed to send batch events:', error)
    }
  }

  // Event Handlers
  private handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement
    const elementInfo = {
      tag: target.tagName,
      id: target.id,
      className: target.className,
      text: target.textContent?.substring(0, 100),
      href: target.getAttribute('href'),
      x: event.clientX,
      y: event.clientY
    }

    this.trackEvent('click', elementInfo)
  }

  private handleButtonClick(event: MouseEvent) {
    const target = event.target as HTMLElement
    
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      const button = target.tagName === 'BUTTON' ? target : target.closest('button')!
      
      this.trackEvent('button_click', {
        button_text: button.textContent?.trim(),
        button_id: button.id,
        button_class: button.className,
        button_type: button.getAttribute('type'),
        page_section: this.getPageSection(button)
      })
    }
  }

  private handleScroll() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    )
    
    this.trackEvent('scroll', { scroll_percent: scrollPercent })
  }

  private handleFormSubmit(event: SubmitEvent) {
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const formFields: any = {}
    
    for (const [key, value] of formData.entries()) {
      // Don't track sensitive data
      if (!['password', 'ssn', 'credit_card'].includes(key.toLowerCase())) {
        formFields[key] = typeof value === 'string' ? value.substring(0, 100) : 'file'
      }
    }

    this.trackEvent('form_submit', {
      form_id: form.id,
      form_action: form.action,
      form_method: form.method,
      field_count: Object.keys(formFields).length,
      fields: formFields
    })
  }

  private handleMouseMove(event: MouseEvent) {
    // Track mouse heatmap data (throttled)
    this.trackEvent('mouse_move', {
      x: event.clientX,
      y: event.clientY,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight
    })
  }

  private handleKeyDown(event: KeyboardEvent) {
    // Track keyboard shortcuts and interactions
    if (event.ctrlKey || event.metaKey) {
      this.trackEvent('keyboard_shortcut', {
        key: event.key,
        ctrl: event.ctrlKey,
        meta: event.metaKey,
        shift: event.shiftKey,
        alt: event.altKey
      })
    }
  }

  private handleError(event: ErrorEvent) {
    this.trackEvent('javascript_error', {
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      column: event.colno,
      stack: event.error?.stack?.substring(0, 500)
    })
  }

  private handlePageUnload() {
    const timeOnPage = Date.now() - this.startTime.getTime()
    
    this.trackEvent('page_unload', {
      time_on_page: timeOnPage,
      total_events: this.events.length
    })
    
    // Send any remaining events
    if (this.events.length > 0) {
      navigator.sendBeacon('/api/analytics/track', JSON.stringify({ events: this.events }))
    }
  }

  // Utility Methods
  private trackPageView() {
    this.trackEvent('page_view', {
      title: document.title,
      referrer: document.referrer,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      screen_width: screen.width,
      screen_height: screen.height,
      color_depth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet'
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile'
    return 'desktop'
  }

  private getBrowser(): string {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    if (userAgent.includes('Opera')) return 'Opera'
    return 'Unknown'
  }

  private getPageSection(element: HTMLElement): string {
    // Determine which section of the page the element is in
    const sections = ['header', 'nav', 'main', 'aside', 'footer']
    
    for (const section of sections) {
      if (element.closest(section)) return section
    }
    
    // Check for common class names
    const classList = element.className.toLowerCase()
    if (classList.includes('header')) return 'header'
    if (classList.includes('nav')) return 'navigation'
    if (classList.includes('sidebar')) return 'sidebar'
    if (classList.includes('footer')) return 'footer'
    if (classList.includes('hero')) return 'hero'
    if (classList.includes('pricing')) return 'pricing'
    if (classList.includes('cta')) return 'call-to-action'
    
    return 'main'
  }

  private async getLocationData() {
    try {
      const response = await fetch('https://ipapi.co/json/')
      return await response.json()
    } catch (error) {
      throw new Error('Failed to get location data')
    }
  }

  private throttle(func: Function, limit: number) {
    let inThrottle: boolean
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // Public Methods
  public trackConversion(conversionType: string, value?: number, metadata?: any) {
    this.trackEvent('conversion', {
      conversion_type: conversionType,
      value: value,
      metadata: metadata
    })
  }

  public trackPurchase(amount: number, currency: string, productId: string, metadata?: any) {
    this.trackEvent('purchase', {
      amount: amount,
      currency: currency,
      product_id: productId,
      metadata: metadata
    })
  }

  public trackSignup(method: string, metadata?: any) {
    this.trackEvent('signup', {
      signup_method: method,
      metadata: metadata
    })
  }

  public trackFeatureUsage(featureName: string, metadata?: any) {
    this.trackEvent('feature_usage', {
      feature_name: featureName,
      metadata: metadata
    })
  }

  public setUserId(userId: string) {
    this.userId = userId
    this.trackEvent('user_identified', { user_id: userId })
  }

  public stopTracking() {
    this.isTracking = false
    
    // Send final batch
    if (this.events.length > 0) {
      this.sendBatchEvents()
    }
    
    console.log('🛑 Activity tracking stopped for session:', this.sessionId)
  }
}

// Global tracker instance
let globalTracker: ActivityTracker | null = null

export function initializeActivityTracking(userId?: string) {
  if (typeof window === 'undefined') return null
  
  if (!globalTracker) {
    globalTracker = new ActivityTracker(userId)
  }
  
  return globalTracker
}

export function getActivityTracker(): ActivityTracker | null {
  return globalTracker
}

// Server-side analytics service
export class AnalyticsService {
  static async saveEvents(events: ActivityEvent[]) {
    if (!isSupabaseConfigured() || !supabaseAdmin) {
      console.warn('Supabase not configured - cannot save analytics events')
      return
    }

    try {
      const { error } = await supabaseAdmin
        .from('analytics')
        .insert(
          events.map(event => ({
            company_id: event.user_id ? 'company_from_user' : null, // TODO: Map user to company
            user_id: event.user_id,
            metric_type: event.event_type,
            metric_value: 1,
            metadata: {
              session_id: event.session_id,
              event_data: event.event_data,
              page_url: event.page_url,
              user_agent: event.user_agent,
              device_type: event.device_type,
              browser: event.browser,
              country: event.country,
              city: event.city,
              ip_address: event.ip_address
            },
            recorded_at: event.timestamp
          }))
        )

      if (error) {
        console.error('Failed to save analytics events:', error)
      } else {
        console.log(`✅ Saved ${events.length} analytics events`)
      }
    } catch (error) {
      console.error('Analytics service error:', error)
    }
  }

  static async getAnalytics(companyId?: string, startDate?: Date, endDate?: Date) {
    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return { events: [], summary: {} }
    }

    try {
      let query = supabaseAdmin
        .from('analytics')
        .select('*')
        .order('recorded_at', { ascending: false })

      if (companyId) {
        query = query.eq('company_id', companyId)
      }

      if (startDate) {
        query = query.gte('recorded_at', startDate.toISOString())
      }

      if (endDate) {
        query = query.lte('recorded_at', endDate.toISOString())
      }

      const { data: events, error } = await query.limit(1000)

      if (error) {
        console.error('Failed to fetch analytics:', error)
        return { events: [], summary: {} }
      }

      // Calculate summary metrics
      const summary = {
        total_events: events?.length || 0,
        unique_sessions: new Set(events?.map(e => e.metadata?.session_id)).size,
        page_views: events?.filter(e => e.metric_type === 'page_view').length || 0,
        conversions: events?.filter(e => e.metric_type === 'conversion').length || 0,
        button_clicks: events?.filter(e => e.metric_type === 'button_click').length || 0,
        form_submissions: events?.filter(e => e.metric_type === 'form_submit').length || 0
      }

      return { events: events || [], summary }
    } catch (error) {
      console.error('Analytics service error:', error)
      return { events: [], summary: {} }
    }
  }
}
