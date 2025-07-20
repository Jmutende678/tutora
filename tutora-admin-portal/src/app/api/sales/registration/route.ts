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