const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://sphkmvjfufrjbojfahar.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGttdmpmdWZyamJvamZhaGFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5NjU0MCwiZXhwIjoyMDY4NzcyNTQwfQ.78CLY_DNb6qVzZA050-JdqjpZ7Oq3aeWyKKnT2Ctcxc'
)

async function signInAdmin() {
  try {
    // Sign in as super admin
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@tutoralearn.com',
      password: 'admin123456'
    })
    if (authError) throw authError
    console.log('Signed in as super admin:', authData)

    // Get user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@tutoralearn.com')
      .single()
    if (userError) throw userError
    console.log('User profile:', userData)

  } catch (error) {
    console.error('Error signing in:', error)
  }
}

signInAdmin() 