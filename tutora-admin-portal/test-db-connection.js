const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...')
  console.log('📊 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
  console.log('🔑 Service key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase environment variables')
    return
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    console.log('✅ Supabase client created')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('companies')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error)
      return
    }
    
    console.log('✅ Database connection successful')
    
    // Check if website_activity table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('website_activity')
      .select('count')
      .limit(1)
    
    if (tableError) {
      console.log('❌ website_activity table does not exist:', tableError.message)
      console.log('📝 Need to create the table using the SQL schema')
    } else {
      console.log('✅ website_activity table exists')
    }
    
    // Check contact_submissions table
    const { data: contactCheck, error: contactError } = await supabase
      .from('contact_submissions')
      .select('count')
      .limit(1)
    
    if (contactError) {
      console.log('❌ contact_submissions table does not exist:', contactError.message)
    } else {
      console.log('✅ contact_submissions table exists')
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error)
  }
}

testDatabaseConnection()
