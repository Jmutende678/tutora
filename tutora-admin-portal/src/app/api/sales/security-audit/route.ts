import { NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    
    // Validate required fields
    if (!formData.companyName || !formData.email || !formData.message) {
      return NextResponse.json(
        { error: 'Missing required fields: companyName, email, message' },
        { status: 400 }
      )
    }

    // Send instant email notification to sales team
    const emailSent = await emailService.sendSecurityAuditNotification({
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone || '',
      message: formData.message,
      urgency: formData.urgency || 'standard'
    })

    if (emailSent) {
      console.log('🔥 SECURITY AUDIT REQUEST - Email sent to sales@tutoralearn.com')
      console.log('Company:', formData.companyName)
      console.log('Email:', formData.email)
      console.log('Urgency:', formData.urgency)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Security audit request submitted successfully. Our team will contact you soon!' 
      })
    } else {
      console.error('❌ Failed to send security audit email notification')
      
      // Still return success to user, but log the email failure
      return NextResponse.json({ 
        success: true, 
        message: 'Security audit request submitted successfully. Our team will contact you soon!' 
      })
    }
  } catch (error) {
    console.error('❌ Error processing security audit request:', error)
    
    return NextResponse.json(
      { error: 'Failed to process security audit request' },
      { status: 500 }
    )
  }
} 