import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sphkmvjfufrjbojfahar.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGttdmpmdWZyamJvamZhaGFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5NjU0MCwiZXhwIjoyMDY4NzcyNTQwfQ.78CLY_DNb6qVzZA050-JdqjpZ7Oq3aeWyKKnT2Ctcxc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug - Checking database structure and data')
    
    // Check companies table
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(10)

    // Check users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(10)

    // Check modules table
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*')
      .limit(10)

    const debugInfo: any = {
      companies: {
        error: companiesError?.message || null,
        count: companies?.length || 0,
        data: companies || [],
        searchResult: null
      },
      users: {
        error: usersError?.message || null,
        count: users?.length || 0,
        data: users || []
      },
      modules: {
        error: modulesError?.message || null,
        count: modules?.length || 0,
        data: modules || []
      }
    }

    // Try specific search for TUT2024LIVE
    try {
      const { data: specificCompany, error: specificError } = await supabase
        .from('companies')
        .select('*')
        .eq('company_code', 'TUT2024LIVE')

      debugInfo.companies.searchResult = {
        error: specificError?.message || null,
        found: specificCompany || []
      }
    } catch (e) {
      debugInfo.companies.searchResult = { error: 'Search failed', found: [] }
    }

    console.log('🔍 Debug results:', JSON.stringify(debugInfo, null, 2))

    return NextResponse.json({
      success: true,
      debug: debugInfo,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Debug error:', error)
    return NextResponse.json(
      { success: false, error: 'Debug failed', details: error.message },
      { status: 500 }
    )
  }
} 