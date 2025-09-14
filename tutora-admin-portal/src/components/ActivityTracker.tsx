'use client'

import { useEffect } from 'react'
import { initializeActivityTracking, getActivityTracker } from '@/lib/activity-tracker'

interface ActivityTrackerProps {
  userId?: string
  enableTracking?: boolean
}

export default function ActivityTracker({ userId, enableTracking = true }: ActivityTrackerProps) {
  useEffect(() => {
    if (!enableTracking || typeof window === 'undefined') return

    console.log('🔍 Initializing comprehensive activity tracking...')
    
    // Initialize the global activity tracker
    const tracker = initializeActivityTracking(userId)
    
    if (tracker && userId) {
      tracker.setUserId(userId)
    }

    // Track specific business events
    const trackBusinessEvents = () => {
      // Track pricing page interactions
      if (window.location.pathname.includes('/pricing')) {
        tracker?.trackFeatureUsage('pricing_page_visit')
      }

      // Track demo interactions
      if (window.location.pathname.includes('/demo')) {
        tracker?.trackFeatureUsage('demo_page_visit')
      }

      // Track admin dashboard access
      if (window.location.pathname.includes('/admin')) {
        tracker?.trackFeatureUsage('admin_dashboard_access')
      }

      // Track contact form interactions
      if (window.location.pathname.includes('/contact')) {
        tracker?.trackFeatureUsage('contact_page_visit')
      }
    }

    trackBusinessEvents()

    // Track route changes for SPA navigation
    const handleRouteChange = () => {
      setTimeout(() => {
        trackBusinessEvents()
      }, 100)
    }

    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange)
    
    // Override pushState and replaceState to catch programmatic navigation
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function(...args) {
      originalPushState.apply(history, args)
      handleRouteChange()
    }

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args)
      handleRouteChange()
    }

    // Track specific button clicks with business context
    const trackBusinessButtons = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const button = target.closest('button') || (target.tagName === 'BUTTON' ? target : null)
      const link = target.closest('a') || (target.tagName === 'A' ? target : null)
      
      if (button || link) {
        const element = button || link
        const text = element?.textContent?.trim().toLowerCase() || ''
        const href = link?.getAttribute('href') || ''
        
        // Track important business actions
        if (text.includes('get started') || text.includes('start free trial')) {
          tracker?.trackConversion('trial_signup_intent')
        } else if (text.includes('contact') || text.includes('demo')) {
          tracker?.trackConversion('contact_intent')
        } else if (text.includes('pricing') || text.includes('plans')) {
          tracker?.trackFeatureUsage('pricing_interest')
        } else if (text.includes('login') || text.includes('sign in')) {
          tracker?.trackFeatureUsage('login_attempt')
        } else if (text.includes('register') || text.includes('sign up')) {
          tracker?.trackConversion('signup_intent')
        } else if (href.includes('stripe') || text.includes('subscribe') || text.includes('upgrade')) {
          tracker?.trackConversion('payment_intent')
        }
      }
    }

    document.addEventListener('click', trackBusinessButtons)

    // Track form submissions with business context
    const trackBusinessForms = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement
      const formId = form.id || form.className
      
      if (formId.includes('contact')) {
        tracker?.trackConversion('contact_form_submit')
      } else if (formId.includes('signup') || formId.includes('register')) {
        tracker?.trackConversion('signup_form_submit')
      } else if (formId.includes('login')) {
        tracker?.trackFeatureUsage('login_form_submit')
      } else if (formId.includes('support')) {
        tracker?.trackFeatureUsage('support_form_submit')
      }
    }

    document.addEventListener('submit', trackBusinessForms)

    // Track scroll depth milestones
    let scrollMilestones = [25, 50, 75, 100]
    let trackedMilestones = new Set()

    const trackScrollMilestones = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )

      for (const milestone of scrollMilestones) {
        if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
          tracker?.trackFeatureUsage('scroll_milestone', { milestone, page: window.location.pathname })
          trackedMilestones.add(milestone)
        }
      }
    }

    window.addEventListener('scroll', trackScrollMilestones)

    // Track time spent on important pages
    const startTime = Date.now()
    const trackTimeOnPage = () => {
      const timeSpent = Date.now() - startTime
      const pathname = window.location.pathname
      
      if (timeSpent > 30000) { // 30 seconds
        if (pathname.includes('/pricing')) {
          tracker?.trackFeatureUsage('pricing_page_engagement', { time_spent: timeSpent })
        } else if (pathname.includes('/demo')) {
          tracker?.trackFeatureUsage('demo_page_engagement', { time_spent: timeSpent })
        } else if (pathname.includes('/admin')) {
          tracker?.trackFeatureUsage('admin_dashboard_engagement', { time_spent: timeSpent })
        }
      }
    }

    const timeTrackingInterval = setInterval(trackTimeOnPage, 30000)

    // Cleanup function
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      document.removeEventListener('click', trackBusinessButtons)
      document.removeEventListener('submit', trackBusinessForms)
      window.removeEventListener('scroll', trackScrollMilestones)
      clearInterval(timeTrackingInterval)
      
      // Restore original history methods
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      
      console.log('🛑 Activity tracking cleanup completed')
    }
  }, [userId, enableTracking])

  // This component doesn't render anything
  return null
}

// Hook for manual tracking in components
export function useActivityTracker() {
  const tracker = getActivityTracker()
  
  return {
    trackConversion: (type: string, value?: number, metadata?: any) => {
      tracker?.trackConversion(type, value, metadata)
    },
    trackFeatureUsage: (feature: string, metadata?: any) => {
      tracker?.trackFeatureUsage(feature, metadata)
    },
    trackPurchase: (amount: number, currency: string, productId: string, metadata?: any) => {
      tracker?.trackPurchase(amount, currency, productId, metadata)
    },
    trackSignup: (method: string, metadata?: any) => {
      tracker?.trackSignup(method, metadata)
    }
  }
}
