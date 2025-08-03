import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, companyName, companyCode } = await request.json()

    if (!firstName || !lastName || !email || !password || !companyName) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUser.users?.some(user => user.email === email)
    if (userExists) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Generate company code if not provided
    const finalCompanyCode = companyCode || `TUT${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Check if company code already exists
    const { data: existingCompany } = await supabaseAdmin
      .from('companies')
      .select('id')
      .eq('company_code', finalCompanyCode)
      .single()

    if (existingCompany) {
      return NextResponse.json(
        { error: 'Company code already exists' },
        { status: 409 }
      )
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`
      }
    })

    if (authError) {
      console.error('User creation error:', authError)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      )
    }

    // Create company
    const { data: companyData, error: companyError } = await supabaseAdmin
      .from('companies')
      .insert({
        company_code: finalCompanyCode,
        name: companyName,
        plan: 'basic',
        max_users: 10,
        current_users: 1,
        admin_user_email: email,
        admin_user_name: `${firstName} ${lastName}`,
        billing_email: email,
        is_active: true
      })
      .select()
      .single()

    if (companyError) {
      console.error('Company creation error:', companyError)
      // Clean up created user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Failed to create company' },
        { status: 500 }
      )
    }

    // Create user record in database
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        company_id: companyData.id,
        email: email,
        name: `${firstName} ${lastName}`,
        role: 'admin',
        is_active: true
      })

    if (userError) {
      console.error('User record creation error:', userError)
      // Clean up created user and company
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      await supabaseAdmin.from('companies').delete().eq('id', companyData.id)
      return NextResponse.json(
        { error: 'Failed to create user record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      company_code: finalCompanyCode,
      user_id: authData.user.id
    })

  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 