import nodemailer from 'nodemailer'

interface EmailNotification {
  to: string
  subject: string
  html: string
  from?: string
}

class SimpleEmailService {
  private transporter: any
  private initialized = false

  constructor() {
    this.initializeTransporter()
  }

  private async initializeTransporter() {
    try {
      // Check if we have SMTP credentials
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('⚠️ SMTP credentials not configured, using console logging')
        return
      }

      // Create SMTP transporter with better Railway compatibility
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true, // true for 465, false for 587
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        connectionTimeout: 60000, // 60 seconds
        greetingTimeout: 30000,   // 30 seconds
        socketTimeout: 60000,     // 60 seconds
        tls: {
          rejectUnauthorized: false
        }
      })

      // Verify connection
      await this.transporter.verify()
      this.initialized = true
      console.log('✅ Email service initialized successfully')
      
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error)
      console.log('📧 Will log emails to console instead')
    }
  }

  async sendEmail({ to, subject, html, from }: EmailNotification): Promise<boolean> {
    const fromEmail = from || process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'noreply@tutoralearn.com'
    
    if (!this.initialized) {
      // Log to console if email not configured
      console.log('\n📧 EMAIL NOTIFICATION (would be sent):')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log(`To: ${to}`)
      console.log(`From: ${fromEmail}`)
      console.log(`Subject: ${subject}`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log(html.replace(/<[^>]*>/g, '')) // Strip HTML for console
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      return true
    }

    try {
      await this.transporter.sendMail({
        from: fromEmail,
        to: to,
        subject: subject,
        html: html
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🚀 New Contact Form Submission</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Contact Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
            <p style="margin: 8px 0;"><strong>👤 Name:</strong> ${formData.name}</p>
            <p style="margin: 8px 0;"><strong>📧 Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
            <p style="margin: 8px 0;"><strong>🏢 Company:</strong> ${formData.company || 'Not provided'}</p>
            <p style="margin: 8px 0;"><strong>📞 Phone:</strong> ${formData.phone || 'Not provided'}</p>
            <p style="margin: 8px 0;"><strong>📋 Type:</strong> ${formData.inquiryType}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">📝 Subject</h3>
            <p style="font-weight: bold; color: #667eea; margin: 10px 0;">${formData.subject}</p>
            
            <h3 style="color: #333; font-size: 18px;">💬 Message</h3>
            <p style="line-height: 1.6; color: #555; background: #f8f9fa; padding: 15px; border-radius: 6px;">${formData.message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${formData.email}?subject=Re: ${encodeURIComponent(formData.subject)}" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
               📧 Reply to ${formData.name}
            </a>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">This email was sent from your Tutora website contact form.</p>
          <p style="margin: 5px 0 0 0; opacity: 0.8;">🌐 tutoralearn.com</p>
        </div>
      </div>
    `

    return await this.sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@tutoralearn.com',
      subject: `🚀 New Contact: ${formData.subject}`,
      html
    })
  }

  // AI Module Builder notification
  async sendAIModuleNotification(moduleData: any, userEmail: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🤖 AI Module Created!</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #856404; font-weight: bold;">🔥 HOT LEAD ALERT: Someone is actively using your AI module builder!</p>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Module Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
            <p style="margin: 8px 0;"><strong>👤 User Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
            <p style="margin: 8px 0;"><strong>📚 Module Title:</strong> ${moduleData.title}</p>
            <p style="margin: 8px 0;"><strong>🏭 Industry:</strong> ${moduleData.industry}</p>
            <p style="margin: 8px 0;"><strong>📊 Difficulty:</strong> ${moduleData.difficulty}</p>
            <p style="margin: 8px 0;"><strong>⏱️ Duration:</strong> ${moduleData.estimatedDuration} minutes</p>
            <p style="margin: 8px 0;"><strong>🧩 Components:</strong> ${moduleData.totalComponents}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">📝 Description</h3>
            <p style="line-height: 1.6; color: #555; background: #f8f9fa; padding: 15px; border-radius: 6px;">${moduleData.description}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 16px; margin-bottom: 15px;">🎯 <strong>Follow up within 24 hours for best conversion!</strong></p>
            <a href="mailto:${userEmail}?subject=Your AI Training Module is Ready!" 
               style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin-right: 10px;">
               💬 Contact Lead
            </a>
            <a href="tel:${userEmail}" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
               📞 Call Now
            </a>
          </div>
        </div>
      </div>
    `

    return await this.sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@tutoralearn.com',
      subject: `🚀 HOT LEAD: AI Module Created by ${userEmail}`,
      html
    })
  }

  // Registration notification
  async sendRegistrationNotification(userData: any) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎉 New User Registration!</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #0c5460; font-weight: bold;">💰 New potential customer has registered!</p>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">User Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
            <p style="margin: 8px 0;"><strong>👤 Name:</strong> ${userData.name}</p>
            <p style="margin: 8px 0;"><strong>📧 Email:</strong> <a href="mailto:${userData.email}">${userData.email}</a></p>
            <p style="margin: 8px 0;"><strong>🏢 Company:</strong> ${userData.company || 'Not provided'}</p>
            <p style="margin: 8px 0;"><strong>👔 Role:</strong> ${userData.role || 'Not provided'}</p>
            <p style="margin: 8px 0;"><strong>👥 Team Size:</strong> ${userData.teamSize || 'Not provided'}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; margin-bottom: 15px;">🎯 Send a welcome email to get them started!</p>
            <a href="mailto:${userData.email}?subject=Welcome to Tutora, ${userData.name}!" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
               👋 Welcome ${userData.name}
            </a>
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
}

export const simpleEmailService = new SimpleEmailService()
