import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    const {
      title,
      description,
      industry,
      difficulty = 'intermediate',
      duration = 25,
      trainingGoal,
      userDetails
    } = body

    // Get or create user session
    let userId: string
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      // Create new user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userDetails.email,
        password: `temp_${Date.now()}`, // Temporary password
        options: {
          data: {
            full_name: userDetails.fullName,
            business_name: userDetails.businessName,
            role: userDetails.role,
            industry: userDetails.industry
          }
        }
      })

      if (authError) {
        console.error('Auth error:', authError)
        return NextResponse.json({ error: 'Failed to create user account' }, { status: 400 })
      }

      if (!authData.user) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })
      }

      userId = authData.user.id

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userDetails.email,
          full_name: userDetails.fullName,
          business_name: userDetails.businessName,
          role: userDetails.role,
          industry: userDetails.industry
        })

      if (profileError) {
        console.error('Profile error:', profileError)
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 400 })
      }
    } else {
      userId = session.user.id
    }

    // Create training module
    const { data: moduleData, error: moduleError } = await supabase
      .from('training_modules')
      .insert({
        user_id: userId,
        title: title || `${industry} Training Module`,
        description: description || `AI-generated training module for ${trainingGoal}`,
        industry,
        difficulty,
        duration,
        progress: 0,
        engagement_score: 95,
        ai_quality: 'A+',
        status: 'draft'
      })
      .select()
      .single()

    if (moduleError) {
      console.error('Module creation error:', moduleError)
      return NextResponse.json({ error: 'Failed to create module' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      module: moduleData,
      userId
    })

  } catch (error) {
    console.error('Module creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create training module' },
      { status: 500 }
    )
  }
}

