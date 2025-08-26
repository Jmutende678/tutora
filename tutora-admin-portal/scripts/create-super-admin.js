const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://sphkmvjfufrjbojfahar.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGttdmpmdWZyamJvamZhaGFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5NjU0MCwiZXhwIjoyMDY4NzcyNTQwfQ.78CLY_DNb6qVzZA050-JdqjpZ7Oq3aeWyKKnT2Ctcxc'
)

async function createSuperAdmin() {
  try {
    // Create super admin user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@tutoralearn.com',
      password: 'admin123456',
      email_confirm: true,
      user_metadata: {
        role: 'super_admin'
      }
    })
    if (authError) throw authError
    console.log('Super admin created in auth:', authData)

    // Create super admin profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email: 'admin@tutoralearn.com',
        name: 'Super Admin',
        role: 'super_admin',
        position: 'Super Admin',
        points: 0,
        streak_days: 0
      }])
      .select()
    if (userError) throw userError
    console.log('Super admin profile created:', userData)

  } catch (error) {
    console.error('Error creating super admin:', error)
  }
}

createSuperAdmin() 