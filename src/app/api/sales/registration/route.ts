import { NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'
import { simpleEmailService } from '@/lib/simple-email-service'

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
    console.log(`📈 New registration: ${userData.companyName} (${userData.email})`)
    
    let emailSent = false
    try {
      await simpleEmailService.sendRegistrationNotification({
        name: userData.name,
        email: userData.email,
        company: userData.companyName,
        role: userData.jobTitle,
        teamSize: userData.teamSize,
        plan: userData.plan,
        industry: userData.industry,
        primaryGoal: userData.primaryGoal,
        urgency: userData.urgency
      })
      emailSent = true
    } catch (emailError) {
      console.error('Failed to send registration email:', emailError)
      emailSent = false
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