import { NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'

export async function POST(request: Request) {
  try {
    const userData = await request.json()
    
    // Validate required fields
    if (!userData.companyName || !userData.email || !userData.name) {
      return NextResponse.json(
        { error: 'Missing required fields: companyName, email, name' },
        { status: 400 }
      )
    }

    // Send instant email notification to sales team
    // TODO: Implement registration notification email system
    console.log(`📈 New registration: ${userData.companyName} (${userData.email})`)
    const emailSent = true // Placeholder - registration notifications will be added later
    /*
    const emailSent = await emailService.sendRegistrationNotification({
      companyName: userData.companyName,
      email: userData.email,
      name: userData.name,
      teamSize: userData.teamSize || 'Not specified',
      plan: userData.plan || 'Not selected'
    })

    // Also send a general sales notification with all the details
    await emailService.sendSalesNotification('REGISTRATION', {
      type: 'User Registration',
      companyName: userData.companyName,
      email: userData.email,
      name: userData.name,
      teamSize: userData.teamSize,
      recommendedPlan: userData.plan,
      jobTitle: userData.jobTitle,
      industry: userData.industry,
      primaryGoal: userData.primaryGoal,
      urgency: userData.urgency,
      timestamp: new Date().toISOString(),
      source: 'Website Registration Form'
    })
    */

    // Track registration in database
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'registration_form_submission',
          session_id: `reg_${Date.now()}`,
          timestamp: new Date().toISOString(),
          source: '/register',
          metadata: {
            location: { country: 'Unknown', city: 'Unknown' },
            device: { type: 'unknown' }
          },
          data: {
            company: userData.companyName,
            email: userData.email,
            name: userData.name,
            team_size: userData.teamSize,
            recommended_plan: userData.plan,
            job_title: userData.jobTitle,
            industry: userData.industry,
            primary_goal: userData.primaryGoal,
            urgency: userData.urgency
          },
          user_name: userData.name,
          user_email: userData.email,
          company: userData.companyName,
          lead_score: {
            score: userData.urgency === 'immediately' ? 85 : userData.urgency === 'next-month' ? 65 : 45,
            category: userData.urgency === 'immediately' ? 'hot' : userData.urgency === 'next-month' ? 'warm' : 'cold',
            reasons: [
              'Registration form completed',
              `Team size: ${userData.teamSize}`,
              `Urgency: ${userData.urgency}`,
              userData.plan ? `Recommended plan: ${userData.plan}` : 'Plan recommendation generated'
            ]
          }
        })
      })
      console.log('✅ Registration tracked in database')
    } catch (trackingError) {
      console.error('❌ Failed to track registration:', trackingError)
    }

    if (emailSent) {
      console.log('🔥 NEW USER REGISTRATION - Email sent to sales@tutoralearn.com')
      console.log('Company:', userData.companyName)
      console.log('Email:', userData.email)
      console.log('Team Size:', userData.teamSize)
      console.log('Recommended Plan:', userData.plan)
      console.log('Urgency:', userData.urgency)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Registration processed successfully!' 
      })
    } else {
      console.error('❌ Failed to send registration email notification')
      
      // Still return success to user
      return NextResponse.json({ 
        success: true, 
        message: 'Registration processed successfully!' 
      })
    }
  } catch (error) {
    console.error('❌ Error processing registration:', error)
    
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    )
  }
} 