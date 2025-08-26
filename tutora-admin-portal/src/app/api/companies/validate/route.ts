import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sphkmvjfufrjbojfahar.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGttdmpmdWZyamJvamZhaGFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5NjU0MCwiZXhwIjoyMDY4NzcyNTQwfQ.78CLY_DNb6qVzZA050-JdqjpZ7Oq3aeWyKKnT2Ctcxc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Company code is required' },
        { status: 400 }
      )
    }

    console.log('🏢 Validating company code with service role:', code)

    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('company_code', code.toUpperCase())
      .eq('status', 'active')
      .single()

    if (error || !company) {
      console.log('❌ Company not found for code:', code, 'Error:', error)
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      )
    }

    console.log('✅ Company found:', company.name)
    return NextResponse.json({
      success: true,
      company: {
        id: company.id,
        name: company.name,
        code: company.company_code
      }
    })

  } catch (error) {
    console.error('❌ Company validation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 