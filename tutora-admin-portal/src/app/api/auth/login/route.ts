import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
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