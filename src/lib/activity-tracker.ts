// Client-side activity tracking for CEO dashboard

interface TrackingData {
  type: 'page_view' | 'contact_form' | 'ai_demo_start' | 'ai_demo_complete' | 'registration' | 'pricing_click' | 'button_click'
  user?: {
    name?: string
    email?: string
    company?: string
    phone?: string
    teamSize?: string
  }
  page?: string
  duration?: number
  data?: any
}

class ActivityTracker {
  private startTime: number = Date.now()
  private sessionId: string = Math.random().toString(36).substring(7)

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeTracking()
    }
  }

  private initializeTracking() {
    // Track page views
    this.trackPageView()
    
    // Track page duration when user leaves
    window.addEventListener('beforeunload', () => {
      this.trackPageDuration()
    })
    
    // Track clicks on important buttons
    this.setupButtonTracking()
  }

  private trackPageView() {
    this.track({
      type: 'page_view',
      page: window.location.pathname,
      data: {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId
      }
    })
  }

  private trackPageDuration() {
    const duration = Date.now() - this.startTime
    if (duration > 5000) { // Only track if user stayed more than 5 seconds
      this.track({
        type: 'page_view',
        page: window.location.pathname,
        duration: Math.floor(duration / 1000), // Duration in seconds
        data: {
          sessionId: this.sessionId,
          engaged: duration > 30000 // Engaged if stayed more than 30 seconds
        }
      })
    }
  }

  private setupButtonTracking() {
    // Track pricing button clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      
      // Track pricing buttons
      if (target.closest('[data-track="pricing"]') || 
          target.textContent?.includes('Start Trial') ||
          target.textContent?.includes('Get Started')) {
        this.track({
          type: 'pricing_click',
          page: window.location.pathname,
          data: {
            buttonText: target.textContent,
            sessionId: this.sessionId
          }
        })
      }
      
      // Track demo buttons
      if (target.textContent?.includes('Watch Demo') ||
          target.textContent?.includes('See Demo') ||
          target.textContent?.includes('Try Demo')) {
        this.track({
          type: 'button_click',
          page: window.location.pathname,
          data: {
            buttonType: 'demo',
            buttonText: target.textContent,
            sessionId: this.sessionId
          }
        })
      }
    })
  }

  // Public methods for manual tracking
  trackContactForm(userData: any, formData: any) {
    this.track({
      type: 'contact_form',
      user: userData,
      page: window.location.pathname,
      data: {
        ...formData,
        sessionId: this.sessionId
      }
    })
  }

  trackRegistration(userData: any, registrationData: any) {
    this.track({
      type: 'registration',
      user: userData,
      page: window.location.pathname,
      data: {
        ...registrationData,
        sessionId: this.sessionId
      }
    })
  }

  trackAIDemoStart(userData: any) {
    this.track({
      type: 'ai_demo_start',
      user: userData,
      page: window.location.pathname,
      data: {
        sessionId: this.sessionId,
        startTime: new Date().toISOString()
      }
    })
  }

  trackAIDemoComplete(userData: any, moduleData: any) {
    this.track({
      type: 'ai_demo_complete',
      user: userData,
      page: window.location.pathname,
      data: {
        ...moduleData,
        sessionId: this.sessionId,
        completedTime: new Date().toISOString()
      }
    })
  }

  private async track(data: TrackingData) {
    try {
      // Don't track in development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Activity Tracked:', data)
        return
      }

      await fetch('/api/track-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error('Failed to track activity:', error)
    }
  }
}

// Create global instance
export const activityTracker = new ActivityTracker()

// Helper functions for easy tracking
export const trackContactForm = (userData: any, formData: any) => {
  activityTracker.trackContactForm(userData, formData)
}

export const trackRegistration = (userData: any, registrationData: any) => {
  activityTracker.trackRegistration(userData, registrationData)
}

export const trackAIDemoStart = (userData: any) => {
  activityTracker.trackAIDemoStart(userData)
}

export const trackAIDemoComplete = (userData: any, moduleData: any) => {
  activityTracker.trackAIDemoComplete(userData, moduleData)
}
