import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sphkmvjfufrjbojfahar.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGttdmpmdWZyamJvamZhaGFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5NjU0MCwiZXhwIjoyMDY4NzcyNTQwfQ.78CLY_DNb6qVzZA050-JdqjpZ7Oq3aeWyKKnT2Ctcxc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    console.log('📚 GET /api/modules - Fetching modules with service role')
    
    const { data: modules, error } = await supabase
      .from('modules')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching modules:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch modules', details: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Found ${modules?.length || 0} modules`)
    return NextResponse.json({
      success: true,
      modules: modules || []
    })

  } catch (error) {
    console.error('❌ Modules fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📚 POST /api/modules - Creating module:', body)

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

    // Create the module
    const moduleData = {
      title: body.title || 'Untitled Module',
      description: body.description || '',
      category: body.category || 'General',
      difficulty: body.difficulty || 'beginner',
      estimated_minutes: body.estimated_minutes || 0,
      points_value: body.points_value || 0,
      content_type: body.content_type || 'document',
      status: body.status || 'draft',
      company_id: company.id,
      is_ai_generated: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: module, error } = await supabase
      .from('modules')
      .insert([moduleData])
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating module:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create module', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Module created successfully:', module.id)
    return NextResponse.json({
      success: true,
      module
    })

  } catch (error) {
    console.error('❌ Module creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 