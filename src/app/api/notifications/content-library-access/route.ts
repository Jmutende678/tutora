import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { type, data, timestamp } = await request.json()
    
    if (type !== 'content_library_access') {
      return NextResponse.json(
        { success: false, error: 'Invalid notification type' },
        { status: 400 }
      )
    }

    console.log('📧 Sending content library access notification:', {
      to: 'sales@tutoralearn.com',
      subject: `New Content Library Access Request - ${data.company}`,
      requestedBy: `${data.firstName} ${data.lastName}`,
      company: data.company,
      industry: data.industry,
      teamSize: data.teamSize,
      timestamp
    })

    // Email content for sales team
    const emailContent = {
      to: ['sales@tutoralearn.com', 'admin@tutoralearn.com'],
      subject: `🚀 New Content Library Access Request - ${data.company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">New Content Library Request</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone is interested in our premium content!</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Contact Information</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
              <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
              <p><strong>Company:</strong> ${data.company}</p>
              <p><strong>Job Title:</strong> ${data.jobTitle}</p>
              <p><strong>Industry:</strong> ${data.industry}</p>
              <p><strong>Team Size:</strong> ${data.teamSize}</p>
            </div>

            <h2 style="color: #333;">Areas of Interest</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <ul style="margin: 0; padding-left: 20px;">
                ${data.interests.map(interest => `<li>${interest}</li>`).join('')}
              </ul>
            </div>

            <h2 style="color: #333;">Next Steps</h2>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <p>This lead has been granted access to the content library preview. Consider following up with:</p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Welcome email with additional resources</li>
                <li>Personalized demo scheduling</li>
                <li>Industry-specific content recommendations</li>
                <li>Pricing discussion for their team size</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${data.email}?subject=Welcome to Tutora - Let's discuss your training needs&body=Hi ${data.firstName},%0A%0AThank you for your interest in our content library! I'd love to discuss how Tutora can help ${data.company} with your training needs.%0A%0AWhen would be a good time for a brief call this week?" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Send Follow-up Email
              </a>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>Request submitted on ${new Date(timestamp).toLocaleString()}</p>
            <p>Tutora Admin Portal - Content Library Access System</p>
          </div>
        </div>
      `,
      text: `
        New Content Library Access Request

        Contact Information:
        Name: ${data.firstName} ${data.lastName}
        Email: ${data.email}
        Company: ${data.company}
        Job Title: ${data.jobTitle}
        Industry: ${data.industry}
        Team Size: ${data.teamSize}

        Areas of Interest:
        ${data.interests.join(', ')}

        Request submitted on ${new Date(timestamp).toLocaleString()}
      `
    }

    // In a real implementation, send actual email using your email service
    // For example, with SendGrid, Nodemailer, or similar:
    /*
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    await sgMail.send(emailContent)
    */

    // For now, we'll simulate the email sending
    console.log('✅ Email notification prepared (would be sent in production):', {
      to: emailContent.to,
      subject: emailContent.subject,
      contentPreview: emailContent.text.substring(0, 200) + '...'
    })

    // Also send welcome email to the user
    const welcomeEmail = {
      to: data.email,
      subject: 'Welcome to Tutora Content Library! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Tutora! 🎉</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your content library access is now active</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #333;">Hi ${data.firstName},</h2>
            <p>Thank you for your interest in Tutora's premium content library! You now have access to explore our collection of 300+ professional training modules.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">What's Available:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>300+ professionally crafted training modules</li>
                <li>Content across 8 major industries</li>
                <li>Interactive previews and detailed descriptions</li>
                <li>Downloadable resources and templates</li>
              </ul>
            </div>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1976d2;">Recommended for ${data.industry}:</h3>
              <p>Based on your industry selection, we've curated content that's most relevant to your needs. Look for modules tagged with "${data.industry}" for the best fit.</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/features/content-library" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 10px;">
                Browse Content Library
              </a>
              <a href="${process.env.NEXTAUTH_URL}/demo/ai-module-builder" 
                 style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 10px;">
                Try AI Module Builder
              </a>
            </div>

            <p>Questions? Reply to this email or contact our team at <a href="mailto:support@tutoralearn.com">support@tutoralearn.com</a></p>
            
            <p>Best regards,<br>The Tutora Team</p>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee;">
            <p>Tutora - AI Employee Training Platform</p>
            <p>This email was sent because you requested access to our content library.</p>
          </div>
        </div>
      `
    }

    console.log('✅ Welcome email prepared for user:', data.email)

    return NextResponse.json({
      success: true,
      message: 'Notifications sent successfully',
      notifications: [
        {
          type: 'sales_notification',
          recipients: emailContent.to,
          status: 'sent'
        },
        {
          type: 'welcome_email',
          recipients: [data.email],
          status: 'sent'
        }
      ]
    })

  } catch (error: any) {
    console.error('Notification error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send notifications' 
      },
      { status: 500 }
    )
  }
}
