import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  console.log('🔍 TESTING DATABASE CONNECTION...')
  
  try {
    // Connect to Supabase
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    console.log('📊 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('🔑 Service key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    
    // Test insert a simple record (let Supabase generate UUID)
    const testRecord = {
      type: 'database_test',
      session_id: 'test-session',
      timestamp: new Date().toISOString(),
      source: '/api/test-db',
      metadata: { test: true },
      data: { message: 'Database connection test' }
    }
    
    console.log('📝 Inserting test record:', testRecord)
    
    const { data: insertResult, error: insertError } = await supabase
      .from('website_activity')
      .insert([testRecord])
      .select()
    
    if (insertError) {
      console.error('❌ Insert failed:', insertError)
      return NextResponse.json({
        success: false,
        error: insertError.message,
        details: insertError
      })
    }
    
    console.log('✅ Insert successful:', insertResult)
    
    // Now try to read it back
    const { data: selectResult, error: selectError } = await supabase
      .from('website_activity')
      .select('*')
      .eq('type', 'database_test')
      .order('timestamp', { ascending: false })
      .limit(5)
    
    if (selectError) {
      console.error('❌ Select failed:', selectError)
      return NextResponse.json({
        success: false,
        error: selectError.message,
        details: selectError
      })
    }
    
    console.log('✅ Select successful:', selectResult)
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working!',
      inserted: insertResult,
      recent_records: selectResult,
      total_test_records: selectResult?.length || 0
    })
    
  } catch (error: any) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    })
  }
}

export async function POST() {
  // Force insert real tracking data
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const realData = {
      type: 'manual_test',
      session_id: `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: '/api/test-db',
      metadata: { 
        location: { country: 'Test Country', city: 'Test City' },
        device: { type: 'desktop' }
      },
      data: { 
        message: 'Manual test from API',
        page: '/test'
      }
    }
    
    const { data, error } = await supabase
      .from('website_activity')
      .insert([realData])
      .select()
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Manual test data inserted',
      data 
    })
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    })
  }
}
