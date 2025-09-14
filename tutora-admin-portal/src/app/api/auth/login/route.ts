import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if Supabase is configured, fallback to demo credentials
    if (!isSupabaseConfigured() || !supabaseAdmin) {
      console.log('Using fallback authentication for demo')
      
      // Demo credentials for testing
      const demoCredentials = {
        'admin@tutora.com': { password: 'ceo123', role: 'ceo', name: 'CEO Admin' },
        'manager@tutora.com': { password: 'manager123', role: 'manager', name: 'Manager Admin' },
        'demo@tutora.com': { password: 'demo123', role: 'ceo', name: 'Demo User' }
      }
      
      const userCreds = demoCredentials[email as keyof typeof demoCredentials]
      
      if (!userCreds || userCreds.password !== password) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }
      
      return NextResponse.json({
        success: true,
        user: {
          id: 'demo-user-' + Date.now(),
          email: email,
          role: userCreds.role,
          company_id: 'demo-company',
          name: userCreds.name
        },
        token: 'demo-token-' + Date.now(),
        demo: true
      })
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Authentication error:', authError)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    // Get user data from database
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (userError) {
      console.error('User data fetch error:', userError)
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      )
    }

    // Update last login
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', authData.user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: userData.role,
        company_id: userData.company_id,
        name: userData.name
      },
      token: authData.session?.access_token
    })

  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 