import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sphkmvjfufrjbojfahar.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGttdmpmdWZyamJvamZhaGFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5NjU0MCwiZXhwIjoyMDY4NzcyNTQwfQ.78CLY_DNb6qVzZA050-JdqjpZ7Oq3aeWyKKnT2Ctcxc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    console.log('👥 GET /api/users - Fetching users')
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching users:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch users', details: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Found ${users?.length || 0} users`)
    return NextResponse.json({
      success: true,
      users: users || []
    })

  } catch (error) {
    console.error('❌ Users fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('👥 POST /api/users - Creating user:', body)

    // Get the demo company ID
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('company_code', 'TUT2024LIVE')
      .single()

    if (companyError || !company) {
      console.error('❌ Demo company not found:', companyError)
      return NextResponse.json(
        { success: false, error: 'Demo company not found' },
        { status: 404 }
      )
    }

    // Create user in Supabase Auth first
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password || 'temppassword123',
      email_confirm: true,
      user_metadata: {
        name: body.name
      }
    })

    if (authError) {
      console.error('❌ Error creating auth user:', authError)
      return NextResponse.json(
        { success: false, error: 'Failed to create user account', details: authError.message },
        { status: 500 }
      )
    }

    // Create user profile
    const userData = {
      id: authData.user.id,
      email: body.email,
      name: body.name || 'New User',
      company_id: company.id,
      role: body.role || 'user',
      position: body.position || '',
      points: 0,
      streak_days: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: user, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating user profile:', error)
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { success: false, error: 'Failed to create user profile', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ User created successfully:', user.id)
    return NextResponse.json({
      success: true,
      user
    })

  } catch (error) {
    console.error('❌ User creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 