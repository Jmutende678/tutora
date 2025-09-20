import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { quizScore, timeSpent, perfectScore = false } = body

    // Update module status to completed
    const { error: moduleError } = await supabase
      .from('training_modules')
      .update({
        status: 'completed',
        progress: 100,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', session.user.id)

    if (moduleError) {
      console.error('Module update error:', moduleError)
      return NextResponse.json({ error: 'Failed to update module' }, { status: 400 })
    }

    // Calculate points based on performance
    let pointsEarned = 100 // Base completion points
    
    if (perfectScore) {
      pointsEarned += 50 // Bonus for perfect quiz score
    } else if (quizScore >= 80) {
      pointsEarned += 25 // Bonus for high quiz score
    }
    
    if (timeSpent && timeSpent < 900) { // Less than 15 minutes
      pointsEarned += 25 // Bonus for fast completion
    }

    // Award points
    const { error: pointsError } = await supabase
      .from('user_points')
      .insert({
        user_id: session.user.id,
        module_id: params.id,
        points_earned: pointsEarned,
        reason: `Module completion (${quizScore}% quiz score)`
      })

    if (pointsError) {
      console.error('Points error:', pointsError)
      // Don't fail the request if points can't be awarded
    }

    // Check for new badges
    const { data: userStats } = await supabase
      .from('profiles')
      .select('total_points, modules_completed')
      .eq('id', session.user.id)
      .single()

    const newBadges = []
    if (userStats) {
      // Check badge conditions
      const { data: availableBadges } = await supabase
        .from('badges')
        .select('*')

      const { data: earnedBadges } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', session.user.id)

      const earnedBadgeIds = earnedBadges?.map(b => b.badge_id) || []

      if (availableBadges) {
        for (const badge of availableBadges) {
          if (earnedBadgeIds.includes(badge.id)) continue

          let shouldAward = false
          
          switch (badge.condition_type) {
            case 'modules_completed':
              shouldAward = userStats.modules_completed >= badge.condition_value
              break
            case 'points':
              shouldAward = userStats.total_points >= badge.condition_value
              break
          }

          if (shouldAward) {
            const { error: badgeError } = await supabase
              .from('user_badges')
              .insert({
                user_id: session.user.id,
                badge_id: badge.id
              })

            if (!badgeError) {
              newBadges.push(badge)
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      pointsEarned,
      newBadges,
      message: 'Module completed successfully!'
    })

  } catch (error) {
    console.error('Module completion error:', error)
    return NextResponse.json(
      { error: 'Failed to complete module' },
      { status: 500 }
    )
  }
}

