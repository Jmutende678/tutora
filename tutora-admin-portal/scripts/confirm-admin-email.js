const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://sphkmvjfufrjbojfahar.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGttdmpmdWZyamJvamZhaGFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5NjU0MCwiZXhwIjoyMDY4NzcyNTQwfQ.78CLY_DNb6qVzZA050-JdqjpZ7Oq3aeWyKKnT2Ctcxc'
)

async function confirmAdminEmail() {
  try {
    // Get user by email
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    if (usersError) throw usersError

    const adminUser = users.find(u => u.email === 'admin@tutoralearn.com')
    if (!adminUser) throw new Error('Admin user not found')

    // Update user to confirm email
    const { data, error } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { email_confirm: true }
    )
    if (error) throw error
    console.log('Admin email confirmed:', data)

  } catch (error) {
    console.error('Error confirming admin email:', error)
  }
}

confirmAdminEmail() 