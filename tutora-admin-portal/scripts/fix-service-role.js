const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://sphkmvjfufrjbojfahar.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGttdmpmdWZyamJvamZhaGFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5NjU0MCwiZXhwIjoyMDY4NzcyNTQwfQ.78CLY_DNb6qVzZA050-JdqjpZ7Oq3aeWyKKnT2Ctcxc'
)

async function fixServiceRole() {
  try {
    // Drop existing policies
    const tables = [
      'companies', 'users', 'modules', 'module_assignments', 'quizzes',
      'questions', 'quiz_attempts', 'certificates', 'leaderboards',
      'leaderboard_entries', 'notifications', 'analytics', 'support_tickets',
      'ticket_messages', 'subscriptions', 'usage_tracking'
    ]

    for (const table of tables) {
      // Drop existing policy
      await supabase.rpc('drop_policy', {
        policy_name: `Service role has full access to ${table}`,
        table_name: table
      })

      // Create new policy
      await supabase.rpc('create_policy', {
        policy_name: `Service role has full access to ${table}`,
        table_name: table,
        using_expression: 'true'
      })
    }

    console.log('Service role policies added successfully')

  } catch (error) {
    console.error('Error fixing service role:', error)
  }
}

fixServiceRole() 