import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
  name: string
  email: string
  company: string
  phone?: string
  subject: string
  message: string
  inquiryType: 'general' | 'sales' | 'support' | 'demo'
  timestamp: string
  source: string
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json()
    
    // Validate required fields
    if (!data.name || !data.email || !data.company || !data.subject || !data.message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    // Prepare email content based on inquiry type
    const inquiryTypeMap = {
      general: { subject: '🔔 General Inquiry', team: 'support@tutoralearn.com' },
      sales: { subject: '💰 Sales Inquiry', team: 'sales@tutoralearn.com' },
      support: { subject: '🛠️ Support Request', team: 'support@tutoralearn.com' },
      demo: { subject: '🎯 Demo Request', team: 'sales@tutoralearn.com' }
    }
    
    const inquiryInfo = inquiryTypeMap[data.inquiryType] || inquiryTypeMap.general
    
    // Create professional email content
    const emailContent = {
      to: inquiryInfo.team,
      subject: `${inquiryInfo.subject} from ${data.company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h2>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1f2937; margin-top: 0;">Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Name:</td>
                <td style="padding: 8px 0; color: #6b7280;">${data.name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 8px 0; color: #6b7280;"><a href="mailto:${data.email}" style="color: #3b82f6;">${data.email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Company:</td>
                <td style="padding: 8px 0; color: #6b7280;">${data.company}</td>
              </tr>
              ${data.phone ? `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td>
                <td style="padding: 8px 0; color: #6b7280;"><a href="tel:${data.phone}" style="color: #3b82f6;">${data.phone}</a></td>
              </tr>
              ` : ''}
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Inquiry Type:</td>
                <td style="padding: 8px 0; color: #6b7280; text-transform: capitalize;">${data.inquiryType}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Subject:</td>
                <td style="padding: 8px 0; color: #6b7280;">${data.subject}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Submitted:</td>
                <td style="padding: 8px 0; color: #6b7280;">${new Date(data.timestamp).toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #1f2937; margin-top: 0;">Message</h3>
            <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #ecfdf5; border: 1px solid #d1fae5; border-radius: 8px;">
            <p style="margin: 0; color: #065f46; font-size: 14px;">
              <strong>Quick Actions:</strong>
              <a href="mailto:${data.email}?subject=Re: ${data.subject}" style="color: #059669; margin-left: 10px;">Reply to ${data.name}</a> |
              <a href="tel:${data.phone || ''}" style="color: #059669; margin-left: 10px;">Call ${data.phone || 'No phone'}</a>
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>This message was sent from the Tutora contact form at ${data.source}</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Contact Information:
- Name: ${data.name}
- Email: ${data.email}
- Company: ${data.company}
${data.phone ? `- Phone: ${data.phone}` : ''}
- Inquiry Type: ${data.inquiryType}
- Subject: ${data.subject}
- Submitted: ${new Date(data.timestamp).toLocaleString()}

Message:
${data.message}

Reply to: ${data.email}
${data.phone ? `Call: ${data.phone}` : ''}
      `
    }
    
    // Send email using your email service
    try {
      // Use your existing email service
      const emailService = await import('@/lib/email-service')
      
      await emailService.default.sendEmail({
        to: inquiryInfo.team,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      })
      
      console.log(`✅ Contact form email sent to ${inquiryInfo.team} for ${data.inquiryType} inquiry from ${data.company}`)
      
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError)
      // Continue with success response even if email fails - we have the data logged
    }
    
    // Send auto-reply to user
    try {
      const emailService = await import('@/lib/email-service')
      
      const autoReplyContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Contacting Tutora!</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hi ${data.name},</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
              Thank you for reaching out to us! We've received your ${data.inquiryType} inquiry and our team will get back to you within <strong>24 hours</strong>.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Your Message Summary:</h3>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Company:</strong> ${data.company}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Inquiry Type:</strong> ${data.inquiryType.charAt(0).toUpperCase() + data.inquiryType.slice(1)}</p>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              In the meantime, feel free to explore our platform:
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="https://tutora-production.up.railway.app/demo/ai-module-builder" 
                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0 10px;">
                Try AI Demo
              </a>
              <a href="https://tutora-production.up.railway.app/pricing" 
                 style="display: inline-block; background: white; color: #3b82f6; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; border: 2px solid #3b82f6; margin: 0 10px;">
                View Pricing
              </a>
            </div>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>Best regards,<br><strong>The Tutora Team</strong></p>
            <p>
              <a href="mailto:hello@tutoralearn.com" style="color: #3b82f6;">hello@tutoralearn.com</a> | 
              <a href="tel:+15551234567" style="color: #3b82f6;">+1 (555) 123-4567</a>
            </p>
          </div>
        </div>
      `
      
      await emailService.default.sendEmail({
        to: data.email,
        subject: `Thank you for contacting Tutora - We'll be in touch soon!`,
        html: autoReplyContent,
        text: `Hi ${data.name},

Thank you for reaching out to us! We've received your ${data.inquiryType} inquiry and our team will get back to you within 24 hours.

Your Message Summary:
- Subject: ${data.subject}
- Company: ${data.company}
- Inquiry Type: ${data.inquiryType}

In the meantime, feel free to explore our platform at https://tutora-production.up.railway.app

Best regards,
The Tutora Team
hello@tutoralearn.com | +1 (555) 123-4567`
      })
      
      console.log(`✅ Auto-reply sent to ${data.email}`)
      
    } catch (autoReplyError) {
      console.error('❌ Auto-reply failed:', autoReplyError)
    }
    
    // Log the successful contact form submission
    console.log(`📧 Contact Form Submission:`, {
      name: data.name,
      email: data.email,
      company: data.company,
      inquiryType: data.inquiryType,
      subject: data.subject,
      timestamp: data.timestamp,
      source: data.source
    })
    
    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you within 24 hours.',
      data: {
        inquiryType: data.inquiryType,
        timestamp: data.timestamp,
        reference: `TUT-${Date.now()}`
      }
    })
    
  } catch (error) {
    console.error('❌ Contact form API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process your message. Please try again or contact us directly at hello@tutoralearn.com' 
      },
      { status: 500 }
    )
  }
}
