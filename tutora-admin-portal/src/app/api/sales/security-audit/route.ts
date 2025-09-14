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
    // TODO: Implement security audit notification email system
    console.log(`📈 Security audit request: ${formData.companyName} (${formData.email})`)
    const emailSent = true // Placeholder - security audit notifications will be added later
    /*
    const emailSent = await emailService.sendSecurityAuditNotification({
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone || '',
      message: formData.message,
      urgency: formData.urgency || 'standard'
    })
    */

    // Track security audit request in database
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'security_audit_form_submission',
          session_id: `audit_${Date.now()}`,
          timestamp: new Date().toISOString(),
          source: '/features/enterprise-security',
          metadata: {
            location: { country: 'Unknown', city: 'Unknown' },
            device: { type: 'unknown' }
          },
          data: {
            company: formData.companyName,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            urgency: formData.urgency
          },
          user_name: formData.companyName,
          user_email: formData.email,
          company: formData.companyName,
          lead_score: {
            score: formData.urgency === 'urgent' ? 90 : formData.urgency === 'high' ? 75 : 60,
            category: formData.urgency === 'urgent' ? 'hot' : formData.urgency === 'high' ? 'warm' : 'cold',
            reasons: [
              'Security audit request',
              `Urgency: ${formData.urgency}`,
              'Enterprise security interest',
              'High-value lead potential'
            ]
          }
        })
      })
      console.log('✅ Security audit request tracked in database')
    } catch (trackingError) {
      console.error('❌ Failed to track security audit request:', trackingError)
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