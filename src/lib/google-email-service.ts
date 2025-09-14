import { google } from 'googleapis'

interface EmailNotification {
  to: string
  subject: string
  html: string
  from?: string
}

class GoogleEmailService {
  private gmail: any
  private initialized = false

  constructor() {
    this.initializeGmail()
  }

  private async initializeGmail() {
    try {
      if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CLIENT_EMAIL) {
        console.log('⚠️ Google Workspace API credentials not configured')
        return
      }

      // Create JWT client for service account
      const auth = new google.auth.JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/gmail.send'],
        subject: process.env.ADMIN_EMAIL || process.env.GOOGLE_CLIENT_EMAIL
      })

      // Initialize Gmail API
      this.gmail = google.gmail({ version: 'v1', auth })
      this.initialized = true
      
      console.log('✅ Google Gmail API initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Google Gmail API:', error)
    }
  }

  async sendEmail({ to, subject, html, from }: EmailNotification): Promise<boolean> {
    if (!this.initialized) {
      console.log('⚠️ Gmail API not initialized, skipping email')
      return false
    }

    try {
      const fromEmail = from || process.env.ADMIN_EMAIL || 'noreply@tutoralearn.com'
      
      // Create email message
      const message = [
        `To: ${to}`,
        `From: ${fromEmail}`,
        `Subject: ${subject}`,
        'Content-Type: text/html; charset=utf-8',
        '',
        html
      ].join('\n')

      // Encode message in base64
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

      // Send email
      await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      })

      console.log(`✅ Email sent successfully to ${to}`)
      return true
    } catch (error) {
      console.error('❌ Failed to send email:', error)
      return false
    }
  }

  // Contact form notification
  async sendContactFormNotification(formData: any) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Contact Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
            <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
            <p><strong>Inquiry Type:</strong> ${formData.inquiryType}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Subject</h3>
            <p style="font-weight: bold; color: #667eea;">${formData.subject}</p>
            
            <h3 style="color: #333;">Message</h3>
            <p style="line-height: 1.6; color: #555;">${formData.message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${formData.email}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reply to ${formData.name}</a>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p>This email was sent from your Tutora website contact form.</p>
        </div>
      </div>
    `

    return await this.sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@tutoralearn.com',
      subject: `New Contact: ${formData.subject}`,
      html
    })
  }

  // AI Module Builder notification
  async sendAIModuleNotification(moduleData: any, userEmail: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🤖 AI Module Created!</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Module Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>User Email:</strong> ${userEmail}</p>
            <p><strong>Module Title:</strong> ${moduleData.title}</p>
            <p><strong>Industry:</strong> ${moduleData.industry}</p>
            <p><strong>Difficulty:</strong> ${moduleData.difficulty}</p>
            <p><strong>Duration:</strong> ${moduleData.estimatedDuration} minutes</p>
            <p><strong>Components:</strong> ${moduleData.totalComponents}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Description</h3>
            <p style="line-height: 1.6; color: #555;">${moduleData.description}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">A potential customer is actively using your AI module builder!</p>
          </div>
        </div>
      </div>
    `

    return await this.sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@tutoralearn.com',
      subject: `🚀 New AI Module Created by ${userEmail}`,
      html
    })
  }

  // Registration notification
  async sendRegistrationNotification(userData: any) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎉 New User Registration!</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">User Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Name:</strong> ${userData.name}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Company:</strong> ${userData.company || 'Not provided'}</p>
            <p><strong>Role:</strong> ${userData.role || 'Not provided'}</p>
            <p><strong>Team Size:</strong> ${userData.teamSize || 'Not provided'}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">A new user has registered for Tutora!</p>
            <a href="mailto:${userData.email}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Welcome ${userData.name}</a>
          </div>
        </div>
      </div>
    `

    return await this.sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@tutoralearn.com',
      subject: `🎉 New Registration: ${userData.name}`,
      html
    })
  }

  // Quote request notification
  async sendQuoteRequestNotification(quoteData: any) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">💰 Quote Request</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Quote Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Company:</strong> ${quoteData.company}</p>
            <p><strong>Contact:</strong> ${quoteData.name}</p>
            <p><strong>Email:</strong> ${quoteData.email}</p>
            <p><strong>Phone:</strong> ${quoteData.phone || 'Not provided'}</p>
            <p><strong>Team Size:</strong> ${quoteData.teamSize}</p>
            <p><strong>Plan Interest:</strong> ${quoteData.planInterest}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Requirements</h3>
            <p style="line-height: 1.6; color: #555;">${quoteData.requirements || 'No specific requirements provided'}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-weight: bold;">🔥 Hot lead! Follow up within 24 hours.</p>
            <a href="mailto:${quoteData.email}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Send Quote to ${quoteData.name}</a>
          </div>
        </div>
      </div>
    `

    return await this.sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@tutoralearn.com',
      subject: `💰 Quote Request from ${quoteData.company}`,
      html
    })
  }
}

export const googleEmailService = new GoogleEmailService()
