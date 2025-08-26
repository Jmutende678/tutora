const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://sphkmvjfufrjbojfahar.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGttdmpmdWZyamJvamZhaGFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5NjU0MCwiZXhwIjoyMDY4NzcyNTQwfQ.78CLY_DNb6qVzZA050-JdqjpZ7Oq3aeWyKKnT2Ctcxc'
)

async function disableRLS() {
  try {
    const tables = [
      'companies', 'users', 'modules', 'module_assignments', 'quizzes',
      'questions', 'quiz_attempts', 'certificates', 'leaderboards',
      'leaderboard_entries', 'notifications', 'analytics', 'support_tickets',
      'ticket_messages', 'subscriptions', 'usage_tracking'
    ]

    for (const table of tables) {
      const { error } = await supabase.rpc('disable_rls', {
        table_name: table
      })
      if (error) {
        console.error(`Error disabling RLS on ${table}:`, error)
      } else {
        console.log(`RLS disabled on ${table}`)
      }
    }

    console.log('RLS disabled on all tables')

  } catch (error) {
    console.error('Error disabling RLS:', error)
  }
}

disableRLS() 