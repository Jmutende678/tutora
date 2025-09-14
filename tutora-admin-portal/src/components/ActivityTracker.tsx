'use client'

import { useEffect } from 'react'

interface ActivityTrackerProps {
  userId?: string
  enableTracking?: boolean
}

export default function ActivityTracker({ userId, enableTracking = true }: ActivityTrackerProps) {
  useEffect(() => {
    if (!enableTracking || typeof window === 'undefined') return

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const startTime = Date.now()

    console.log('🎯 REAL ACTIVITY TRACKING STARTED - Session:', sessionId)

    // Real-time activity tracking function
    const trackActivity = async (activityData: any) => {
      try {
        const response = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: activityData.type,
            user_id: userId,
            session_id: sessionId,
            timestamp: new Date().toISOString(),
            source: window.location.pathname,
            metadata: {
              url: window.location.href,
              referrer: document.referrer,
              user_agent: navigator.userAgent,
              viewport: {
                width: window.innerWidth,
                height: window.innerHeight
              },
              ip_address: 'client-side',
              location: await getLocationData(),
              device: getDeviceInfo(),
              ...activityData.metadata
            },
            ...activityData.data
          })
        })

        if (response.ok) {
          console.log('✅ Activity tracked:', activityData.type)
        } else {
          console.error('❌ Failed to track activity:', response.status)
        }
      } catch (error) {
        console.error('❌ Activity tracking error:', error)
      }
    }

    // Get device information
    const getDeviceInfo = () => {
      const ua = navigator.userAgent
      let deviceType = 'desktop'
      let os = 'unknown'
      let browser = 'unknown'

      // Detect device type
      if (/tablet|ipad|playbook|silk/i.test(ua)) {
        deviceType = 'tablet'
      } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
        deviceType = 'mobile'
      }

      // Detect OS
      if (ua.includes('Windows')) os = 'Windows'
      else if (ua.includes('Mac')) os = 'macOS'
      else if (ua.includes('Linux')) os = 'Linux'
      else if (ua.includes('Android')) os = 'Android'
      else if (ua.includes('iOS')) os = 'iOS'

      // Detect browser
      if (ua.includes('Chrome')) browser = 'Chrome'
      else if (ua.includes('Firefox')) browser = 'Firefox'
      else if (ua.includes('Safari')) browser = 'Safari'
      else if (ua.includes('Edge')) browser = 'Edge'

      return { type: deviceType, os, browser }
    }

    // Get location data (approximate)
    const getLocationData = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        return {
          country: data.country_name,
          city: data.city,
          region: data.region
        }
      } catch (error) {
        return { country: 'Unknown', city: 'Unknown', region: 'Unknown' }
      }
    }

    // Track initial page view
    trackActivity({
      type: 'page_view',
      data: {
        page: window.location.pathname,
        title: document.title
      }
    })

    // Track button clicks - REAL tracking
    const handleButtonClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const button = target.closest('button') || (target.tagName === 'BUTTON' ? target : null)
      const link = target.closest('a') || (target.tagName === 'A' ? target : null)
      
      if (button || link) {
        const element = button || link
        const text = element?.textContent?.trim() || ''
        const href = link?.getAttribute('href') || ''
        
        trackActivity({
          type: 'button_click',
          data: {
            button_text: text,
            button_href: href,
            element_id: element?.id,
            element_class: element?.className
          }
        })

        // Special tracking for important buttons
        if (text.toLowerCase().includes('contact') || text.toLowerCase().includes('demo')) {
          trackActivity({
            type: 'high_intent_action',
            data: {
              action: 'contact_demo_interest',
              button_text: text,
              page: window.location.pathname
            }
          })
        } else if (text.toLowerCase().includes('get started') || text.toLowerCase().includes('sign up')) {
          trackActivity({
            type: 'high_intent_action',
            data: {
              action: 'signup_interest',
              button_text: text,
              page: window.location.pathname
            }
          })
        } else if (text.toLowerCase().includes('pricing') || href.includes('pricing')) {
          trackActivity({
            type: 'high_intent_action',
            data: {
              action: 'pricing_interest',
              button_text: text,
              page: window.location.pathname
            }
          })
        }
      }
    }

    document.addEventListener('click', handleButtonClick, true)

    // Track form submissions - REAL tracking
    const handleFormSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement
      const formData = new FormData(form)
      const formObject: any = {}
      
      formData.forEach((value, key) => {
        formObject[key] = value
      })

      trackActivity({
        type: 'form_submission',
        data: {
          form_id: form.id,
          form_class: form.className,
          form_action: form.action,
          form_method: form.method,
          field_count: formData.keys().length,
          has_email: formObject.email ? true : false,
          has_phone: formObject.phone ? true : false,
          has_company: formObject.company ? true : false
        }
      })
    }

    document.addEventListener('submit', handleFormSubmit, true)

    // Track scroll depth - REAL tracking
    let maxScrollPercent = 0
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      
      if (scrollPercent > maxScrollPercent) {
        maxScrollPercent = scrollPercent
        
        // Track scroll milestones
        const milestones = [25, 50, 75, 90, 100]
        for (const milestone of milestones) {
          if (scrollPercent >= milestone && maxScrollPercent < milestone) {
            trackActivity({
              type: 'scroll_milestone',
              data: {
                milestone: milestone,
                page: window.location.pathname
              }
            })
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Track time on page - REAL tracking
    let timeOnPageInterval = setInterval(() => {
      const timeSpent = Date.now() - startTime
      
      if (timeSpent > 0 && timeSpent % 30000 === 0) { // Every 30 seconds
        trackActivity({
          type: 'time_on_page',
          data: {
            time_spent: timeSpent,
            page: window.location.pathname,
            is_active: document.hasFocus()
          }
        })
      }
    }, 30000)

    // Track page visibility changes
    const handleVisibilityChange = () => {
      trackActivity({
        type: 'page_visibility',
        data: {
          visibility_state: document.visibilityState,
          page: window.location.pathname,
          time_since_load: Date.now() - startTime
        }
      })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Track navigation changes for SPA
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    const trackNavigation = (url: string, type: string) => {
      trackActivity({
        type: 'navigation',
        data: {
          navigation_type: type,
          from_page: window.location.pathname,
          to_page: url,
          time_since_load: Date.now() - startTime
        }
      })
    }

    history.pushState = function(...args) {
      trackNavigation(args[2] as string, 'pushState')
      return originalPushState.apply(history, args)
    }

    history.replaceState = function(...args) {
      trackNavigation(args[2] as string, 'replaceState')
      return originalReplaceState.apply(history, args)
    }

    window.addEventListener('popstate', () => {
      trackNavigation(window.location.pathname, 'popstate')
    })

    // Track when user leaves the page
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime
      
      // Use sendBeacon for reliable tracking on page unload
      const data = JSON.stringify({
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'page_exit',
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        source: window.location.pathname,
        metadata: {
          total_time_spent: timeSpent,
          max_scroll_percent: maxScrollPercent,
          url: window.location.href
        }
      })

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', data)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup function
    return () => {
      document.removeEventListener('click', handleButtonClick, true)
      document.removeEventListener('submit', handleFormSubmit, true)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', () => {})
      
      if (timeOnPageInterval) {
        clearInterval(timeOnPageInterval)
      }
      
      // Restore original history methods
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      
      console.log('🛑 REAL activity tracking stopped')
    }
  }, [userId, enableTracking])

  return null
}

// Hook for manual tracking in components
export function useActivityTracker() {
  const trackActivity = async (type: string, data: any) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type,
          timestamp: new Date().toISOString(),
          source: window.location.pathname,
          metadata: {
            url: window.location.href,
            user_agent: navigator.userAgent
          },
          ...data
        })
      })
    } catch (error) {
      console.error('Manual tracking error:', error)
    }
  }
  
  return {
    trackConversion: (type: string, value?: number, metadata?: any) => {
      trackActivity('conversion', { conversion_type: type, value, ...metadata })
    },
    trackFeatureUsage: (feature: string, metadata?: any) => {
      trackActivity('feature_usage', { feature, ...metadata })
    },
    trackPurchase: (amount: number, currency: string, productId: string, metadata?: any) => {
      trackActivity('purchase', { amount, currency, product_id: productId, ...metadata })
    },
    trackSignup: (method: string, metadata?: any) => {
      trackActivity('signup', { signup_method: method, ...metadata })
    }
  }
}