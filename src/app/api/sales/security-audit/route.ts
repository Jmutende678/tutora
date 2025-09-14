import { NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'
import { simpleEmailService } from '@/lib/simple-email-service'

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
    console.log(`📈 Security audit request: ${formData.companyName} (${formData.email})`)
    
    let emailSent = false
    try {
      await simpleEmailService.sendContactFormNotification({
        name: formData.contactName || 'Security Audit Request',
        email: formData.email,
        company: formData.companyName,
        phone: formData.phone || 'Not provided',
        subject: `🔒 SECURITY AUDIT REQUEST from ${formData.companyName}`,
        message: `Security Audit Request Details:

Company: ${formData.companyName}
Urgency: ${formData.urgency || 'Standard'}

Message:
${formData.message}

This is a high-priority security audit request. Please follow up within 24 hours.`,
        inquiryType: 'security-audit'
      })
      emailSent = true
    } catch (emailError) {
      console.error('Failed to send security audit email:', emailError)
      emailSent = false
    }

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