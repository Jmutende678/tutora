import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { token, email, password } = await request.json()

    if (!token || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: token, email, password' },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json(
        { error: 'Company setup service not configured' },
        { status: 503 }
      )
    }

    // TODO: Implement token validation logic
    // For now, we'll assume the token is valid if it exists
    console.log('🔧 Company setup request:', { token, email })

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUser.users?.some(user => user.email === email)
    
    if (userExists) {
      // Update existing user's password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.users.find(user => user.email === email)!.id,
        { password }
      )

      if (updateError) {
        console.error('Password update error:', updateError)
        return NextResponse.json(
          { error: 'Failed to update password' },
          { status: 500 }
        )
      }
    } else {
      // Create new user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          setup_completed: true
        }
      })

      if (authError) {
        console.error('User creation error:', authError)
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        )
      }
    }

    // Track company setup completion
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'company_setup_completed',
          session_id: `setup_${Date.now()}`,
          timestamp: new Date().toISOString(),
          source: '/company/setup',
          metadata: {
            location: { country: 'Unknown', city: 'Unknown' },
            device: { type: 'unknown' }
          },
          data: {
            email: email,
            setup_token: token
          },
          user_email: email,
          lead_score: {
            score: 85, // Company setup is high intent
            category: 'hot',
            reasons: [
              'Completed company setup process',
              'Admin account configured',
              'Ready for platform use',
              'High engagement intent'
            ]
          }
        })
      })
      console.log('✅ Company setup tracked in database')
    } catch (trackingError) {
      console.error('❌ Failed to track company setup:', trackingError)
    }

    return NextResponse.json({
      success: true,
      message: 'Company setup completed successfully'
    })

  } catch (error) {
    console.error('Company setup API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
