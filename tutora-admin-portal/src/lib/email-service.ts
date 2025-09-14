import nodemailer from 'nodemailer'
import { SupportTicket } from './supabase-service'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface WelcomeEmailData {
  companyName: string
  companyCode: string
  adminName: string
  adminEmail: string
  loginUrl: string
  supportEmail: string
}

interface SupportTicketEmailData {
  ticket: SupportTicket
  companyName?: string
  isNotification: boolean // true for support team, false for user confirmation
}

// Main email service class
export class EmailService {
  private transporter: nodemailer.Transporter | null = null
  private isConfigured: boolean = false

  constructor() {
    this.initializeTransporter()
  }

  private initializeTransporter() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    }

    if (config.auth.user && config.auth.pass) {
      try {
        this.transporter = nodemailer.createTransport(config)
        this.isConfigured = true
        console.log('✅ Email service configured successfully')
      } catch (error) {
        console.error('❌ Failed to configure email service:', error)
        this.isConfigured = false
      }
    } else {
      console.log('⚠️ Email service not configured - missing SMTP credentials')
      console.log('📝 To enable email:')
      console.log('   Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env.local')
      this.isConfigured = false
    }
  }

  // Core email sending method
  async sendEmail(options: {
    to: string | string[]
    subject: string
    html: string
    text: string
  }): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.log('📧 Email service not configured, skipping email')
      return false
    }

    try {
      await this.transporter.sendMail({
        from: `"Tutora" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      })
      return true
    } catch (error) {
      console.error('❌ Email sending failed:', error)
      return false
    }
  }

  // Welcome email for new companies
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    const template = this.getWelcomeEmailTemplate(data)
    return await this.sendEmail({
      to: data.adminEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    })
  }

  // Send support ticket notification emails
  async sendSupportTicketNotification(data: SupportTicketEmailData): Promise<boolean> {
    if (!this.isConfigured) {
      console.log('📧 Email service not configured, skipping support ticket notification')
      return false
    }

    try {
      const { ticket, companyName, isNotification } = data

      // Simple email notification for now - full templating will be added later
      const subject = isNotification 
        ? `New Support Ticket: ${ticket.title}`
        : `Support Ticket Created: ${ticket.title}`
      
      const recipientEmail = isNotification 
        ? (process.env.SUPPORT_EMAIL || 'support@tutoralearn.com')
        : 'support@tutoralearn.com' // Default for now

      const html = `
        <h2>${subject}</h2>
        <p><strong>Ticket ID:</strong> ${ticket.id}</p>
        <p><strong>Title:</strong> ${ticket.title}</p>
        <p><strong>Description:</strong> ${ticket.description}</p>
        <p><strong>Priority:</strong> ${ticket.priority}</p>
        <p><strong>Status:</strong> ${ticket.status}</p>
        <p><strong>Company:</strong> ${companyName || 'Unknown'}</p>
        <p><strong>Created:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
      `

      const text = `
        ${subject}
        Ticket ID: ${ticket.id}
        Title: ${ticket.title}
        Description: ${ticket.description}
        Priority: ${ticket.priority}
        Status: ${ticket.status}
        Company: ${companyName || 'Unknown'}
        Created: ${new Date(ticket.createdAt).toLocaleString()}
      `

      const result = await this.sendEmail({
        to: recipientEmail,
        subject: subject,
        html: html,
        text: text
      })

      console.log(`✅ Support ticket email sent successfully to ${recipientEmail}`)
      return result

    } catch (error) {
      console.error('❌ Error sending support ticket notification:', error)
      return false
    }
  }

  // Email template for welcome emails
  private getWelcomeEmailTemplate(data: WelcomeEmailData): EmailTemplate {
    const subject = `Welcome to Tutora! Your company code: ${data.companyCode}`
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Welcome to Tutora</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Tutora! 🚀</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">Your AI-powered training platform is ready</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Hi ${data.adminName}! 👋</h2>
            
            <p>Congratulations! Your company <strong>${data.companyName}</strong> has been successfully set up on Tutora.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #495057;">🔑 Your Company Details:</h3>
                <p style="margin: 5px 0;"><strong>Company Code:</strong> <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-weight: bold;">${data.companyCode}</span></p>
                <p style="margin: 5px 0;"><strong>Admin Email:</strong> ${data.adminEmail}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${data.loginUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Access Your Dashboard</a>
            </div>
            
            <p><strong>Need help?</strong> Contact us at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a></p>
            
            <p style="margin-top: 30px;">Welcome to the future of training!</p>
            <p><strong>The Tutora Team</strong></p>
        </div>
        
        <div style="text-align: center; color: #6c757d; font-size: 12px; margin-top: 20px;">
            <p>© 2024 Tutora. All rights reserved.</p>
        </div>
    </body>
    </html>`

    const text = `
Welcome to Tutora! 🚀

Hi ${data.adminName}!

Congratulations! Your company ${data.companyName} has been successfully set up on Tutora.

Your Company Details:
- Company Code: ${data.companyCode}
- Admin Email: ${data.adminEmail}

Access your dashboard: ${data.loginUrl}

Need help? Contact us at ${data.supportEmail}

Welcome to the future of training!
The Tutora Team`

    return { subject, html, text }
  }
}

// Export singleton instance
export const emailService = new EmailService() 