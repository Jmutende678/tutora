import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Plan limits configuration
const PLAN_LIMITS = {
  starter: {
    maxUsers: 10,
    maxModules: 10,
    features: {
      customBranding: false,
      whiteLabel: false,
      apiAccess: false,
      advancedAnalytics: false
    }
  },
  growth: {
    maxUsers: 25,
    maxModules: -1, // unlimited
    features: {
      customBranding: true,
      whiteLabel: false,
      apiAccess: true,
      advancedAnalytics: true
    }
  },
  professional: {
    maxUsers: 50,
    maxModules: -1, // unlimited
    features: {
      customBranding: true,
      whiteLabel: true,
      apiAccess: true,
      advancedAnalytics: true
    }
  },
  enterprise: {
    maxUsers: 100,
    maxModules: -1, // unlimited
    features: {
      customBranding: true,
      whiteLabel: true,
      apiAccess: true,
      advancedAnalytics: true
    }
  }
}

async function enforceUserLimits(request: NextRequest, companyId: string) {
  try {
    // Get company plan
    const { data: company, error } = await supabaseAdmin
      .from('companies')
      .select('plan, current_users, max_users')
      .eq('id', companyId)
      .single()

    if (error || !company) {
      return { allowed: false, error: 'Company not found' }
    }

    const planLimits = PLAN_LIMITS[company.plan as keyof typeof PLAN_LIMITS]
    if (!planLimits) {
      return { allowed: false, error: 'Invalid plan' }
    }

    // Check user limits for user creation endpoints
    if (request.url.includes('/api/users') && request.method === 'POST') {
      const currentUsers = company.current_users || 0
      const maxUsers = planLimits.maxUsers

      if (maxUsers !== -1 && currentUsers >= maxUsers) {
        return {
          allowed: false,
          error: `User limit exceeded. Current plan allows ${maxUsers} users. Upgrade your plan to add more users.`,
          currentUsers,
          maxUsers
        }
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error('❌ Error enforcing user limits:', error)
    return { allowed: false, error: 'Internal error checking plan limits' }
  }
}

async function enforceFeatureLimits(request: NextRequest, companyId: string) {
  try {
    // Get company plan
    const { data: company, error } = await supabaseAdmin
      .from('companies')
      .select('plan')
      .eq('id', companyId)
      .single()

    if (error || !company) {
      return { allowed: false, error: 'Company not found' }
    }

    const planLimits = PLAN_LIMITS[company.plan as keyof typeof PLAN_LIMITS]
    if (!planLimits) {
      return { allowed: false, error: 'Invalid plan' }
    }

    // Check feature access
    const url = new URL(request.url)
    
    // API access check
    if (url.pathname.startsWith('/api/v1/') && !planLimits.features.apiAccess) {
      return {
        allowed: false,
        error: 'API access not available on your plan. Upgrade to Growth or higher for API access.'
      }
    }

    // Advanced analytics check
    if (url.pathname.includes('/analytics/advanced') && !planLimits.features.advancedAnalytics) {
      return {
        allowed: false,
        error: 'Advanced analytics not available on your plan. Upgrade to Growth or higher.'
      }
    }

    // Custom branding check
    if (url.pathname.includes('/branding') && !planLimits.features.customBranding) {
      return {
        allowed: false,
        error: 'Custom branding not available on your plan. Upgrade to Growth or higher.'
      }
    }

    // White-label check
    if (url.pathname.includes('/white-label') && !planLimits.features.whiteLabel) {
      return {
        allowed: false,
        error: 'White-label features not available on your plan. Upgrade to Professional or higher.'
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error('❌ Error enforcing feature limits:', error)
    return { allowed: false, error: 'Internal error checking feature access' }
  }
}

export async function middleware(request: NextRequest) {
  // Only apply middleware to API routes that need plan enforcement
  const protectedPaths = [
    '/api/users',
    '/api/modules',
    '/api/analytics/advanced',
    '/api/branding',
    '/api/white-label',
    '/api/v1/'
  ]

  const shouldEnforce = protectedPaths.some(path => request.url.includes(path))
  
  if (!shouldEnforce) {
    return NextResponse.next()
  }

  // Extract company ID from request (you may need to adjust this based on your auth system)
  const companyId = request.headers.get('x-company-id') || 
                   request.cookies.get('companyId')?.value ||
                   new URL(request.url).searchParams.get('companyId')

  if (!companyId) {
    return NextResponse.json(
      { 
        error: 'Company ID required for plan enforcement',
        code: 'COMPANY_ID_MISSING'
      },
      { status: 400 }
    )
  }

  // Enforce user limits
  const userLimitsResult = await enforceUserLimits(request, companyId)
  if (!userLimitsResult.allowed) {
    return NextResponse.json(
      { 
        error: userLimitsResult.error,
        code: 'USER_LIMIT_EXCEEDED',
        details: {
          currentUsers: userLimitsResult.currentUsers,
          maxUsers: userLimitsResult.maxUsers
        }
      },
      { status: 403 }
    )
  }

  // Enforce feature limits
  const featureLimitsResult = await enforceFeatureLimits(request, companyId)
  if (!featureLimitsResult.allowed) {
    return NextResponse.json(
      { 
        error: featureLimitsResult.error,
        code: 'FEATURE_NOT_AVAILABLE'
      },
      { status: 403 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/users/:path*',
    '/api/modules/:path*',
    '/api/analytics/advanced/:path*',
    '/api/branding/:path*',
    '/api/white-label/:path*',
    '/api/v1/:path*'
  ]
} 