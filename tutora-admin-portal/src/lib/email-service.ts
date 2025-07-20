import nodemailer from 'nodemailer'
import { SupportTicket } from './firebase-admin'

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

export class EmailService {
  private transporter: nodemailer.Transporter | null = null
  private isConfigured = false

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

  async sendEmail(to: string | string[], subject: string, html: string, text?: string): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.log('⚠️ Email not sent - service not configured')
      return false
    }

    try {
      const mailOptions = {
        from: {
          name: 'Tutora Support',
          address: process.env.SMTP_USER || 'support@tutoralearn.com'
        },
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
        text: text || this.htmlToText(html)
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('✅ Email sent successfully:', result.messageId)
      return true
    } catch (error) {
      console.error('❌ Failed to send email:', error)
      return false
    }
  }

  // Welcome email for new companies
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    const template = this.getWelcomeEmailTemplate(data)
    
    return await this.sendEmail(
      data.adminEmail,
      template.subject,
      template.html,
      template.text
    )
  }

  // Support ticket notifications
  async sendSupportTicketNotification(data: SupportTicketEmailData): Promise<boolean> {
    const template = data.isNotification 
      ? this.getSupportNotificationTemplate(data)
      : this.getSupportConfirmationTemplate(data)

    const recipient = data.isNotification 
      ? (process.env.SUPPORT_EMAIL || 'support@tutoralearn.com')
      : data.ticket.userEmail

    return await this.sendEmail(
      recipient,
      template.subject,
      template.html,
      template.text
    )
  }

  // Module assignment notification
  async sendModuleAssignmentEmail(userEmail: string, userName: string, moduleName: string, dueDate?: string): Promise<boolean> {
    const template = this.getModuleAssignmentTemplate(userName, moduleName, dueDate)
    
    return await this.sendEmail(
      userEmail,
      template.subject,
      template.html,
      template.text
    )
  }

  // Achievement/Certificate email
  async sendAchievementEmail(userEmail: string, userName: string, achievement: string, certificateUrl?: string): Promise<boolean> {
    const template = this.getAchievementTemplate(userName, achievement, certificateUrl)
    
    return await this.sendEmail(
      userEmail,
      template.subject,
      template.html,
      template.text
    )
  }

  // Password reset email
  async sendPasswordResetEmail(userEmail: string, userName: string, resetUrl: string): Promise<boolean> {
    const template = this.getPasswordResetTemplate(userName, resetUrl)
    
    return await this.sendEmail(
      userEmail,
      template.subject,
      template.html,
      template.text
    )
  }

  // Bulk email for announcements
  async sendAnnouncementEmail(recipients: string[], subject: string, message: string, companyName?: string): Promise<{
    successful: number
    failed: number
  }> {
    const template = this.getAnnouncementTemplate(message, companyName)
    
    let successful = 0
    let failed = 0

    // Send in batches to avoid rate limiting
    const batchSize = 50
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)
      
      try {
        const success = await this.sendEmail(batch, subject, template.html, template.text)
        if (success) {
          successful += batch.length
        } else {
          failed += batch.length
        }
      } catch (error) {
        failed += batch.length
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return { successful, failed }
  }

  // Email Templates
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
        
        <p>Congratulations! Your company <strong>${data.companyName}</strong> has been successfully set up on Tutora. You're now ready to revolutionize your team's training experience.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #495057;">🔑 Your Company Details:</h3>
            <p style="margin: 5px 0;"><strong>Company Code:</strong> <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-weight: bold;">${data.companyCode}</span></p>
            <p style="margin: 5px 0;"><strong>Admin Email:</strong> ${data.adminEmail}</p>
        </div>
        
        <h3 style="color: #495057;">🚀 Getting Started:</h3>
        <ol style="padding-left: 20px;">
            <li><strong>Share your company code</strong> with your team members</li>
            <li><strong>Download the Tutora app</strong> (iOS/Android) or use the web platform</li>
            <li><strong>Create your first training module</strong> using our AI builder</li>
            <li><strong>Assign modules</strong> to your team and track progress</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${data.loginUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Access Your Dashboard</a>
        </div>
        
        <h3 style="color: #495057;">📱 Mobile Apps:</h3>
        <div style="text-align: center; margin: 20px 0;">
            <a href="#" style="display: inline-block; margin: 0 10px;">
                <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1656028800" alt="Download on the App Store" style="height: 40px;">
            </a>
            <a href="#" style="display: inline-block; margin: 0 10px;">
                <img alt="Get it on Google Play" src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" style="height: 40px;">
            </a>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #856404;">💡 Pro Tip:</h4>
            <p style="margin-bottom: 0; color: #856404;">Start with our AI Module Builder - upload any training video or document and watch our AI create interactive modules automatically!</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e1e5e9; margin: 30px 0;">
        
        <p><strong>Need help?</strong> Our support team is here for you:</p>
        <ul style="list-style: none; padding: 0;">
            <li>📧 Email: <a href="mailto:${data.supportEmail}">${data.supportEmail}</a></li>
            <li>⏰ Response time: Less than 4 hours</li>
            <li>📚 Help Center: <a href="${data.loginUrl}/help">Visit our help center</a></li>
        </ul>
        
        <p style="margin-top: 30px;">Welcome to the future of training!</p>
        <p><strong>The Tutora Team</strong></p>
    </div>
    
    <div style="text-align: center; color: #6c757d; font-size: 12px; margin-top: 20px;">
        <p>This email was sent to ${data.adminEmail} because you signed up for Tutora.</p>
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

Getting Started:
1. Share your company code with your team members
2. Download the Tutora app or use the web platform
3. Create your first training module using our AI builder
4. Assign modules to your team and track progress

Access your dashboard: ${data.loginUrl}

Need help? Contact us at ${data.supportEmail}

Welcome to the future of training!
The Tutora Team
    `

    return { subject, html, text }
  }

  private getSupportNotificationTemplate(data: SupportTicketEmailData): EmailTemplate {
    const subject = `[SUPPORT] ${data.ticket.priority.toUpperCase()}: ${data.ticket.subject}`
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Support Ticket</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #dc3545; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">🎫 New Support Ticket #${data.ticket.id.slice(-6)}</h1>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #dc3545; border-top: none; border-radius: 0 0 8px 8px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #495057;">📋 Ticket Details:</h3>
            <p><strong>Type:</strong> ${data.ticket.type.replace('_', ' ').toUpperCase()}</p>
            <p><strong>Priority:</strong> <span style="background: ${data.ticket.priority === 'urgent' ? '#dc3545' : data.ticket.priority === 'high' ? '#fd7e14' : data.ticket.priority === 'medium' ? '#ffc107' : '#28a745'}; color: white; padding: 2px 8px; border-radius: 4px;">${data.ticket.priority.toUpperCase()}</span></p>
            <p><strong>Subject:</strong> ${data.ticket.subject}</p>
            <p><strong>User:</strong> ${data.ticket.userName} (${data.ticket.userEmail})</p>
            <p><strong>Company:</strong> ${data.companyName || data.ticket.companyCode || 'N/A'}</p>
            <p><strong>Created:</strong> ${typeof data.ticket.createdAt === 'string' ? new Date(data.ticket.createdAt).toLocaleString() : data.ticket.createdAt.toDate().toLocaleString()}</p>
        </div>
        
        <h3>📝 Description:</h3>
        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin-bottom: 20px;">
            ${data.ticket.description.replace(/\n/g, '<br>')}
        </div>
        
        ${data.ticket.tags.length > 0 ? `
        <h3>🏷️ Tags:</h3>
        <p>${data.ticket.tags.map(tag => `<span style="background: #e9ecef; padding: 2px 6px; border-radius: 4px; margin-right: 5px;">${tag}</span>`).join('')}</p>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://tutora-g6d5ktgta-johns-projects-eb6ca0cb.vercel.app/admin/support/${data.ticket.id}" style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Manage Ticket</a>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px;">
            <h4 style="margin-top: 0; color: #856404;">⏰ SLA Reminder:</h4>
            <p style="margin-bottom: 0; color: #856404;">This ticket requires response within ${data.ticket.priority === 'urgent' ? '1 hour' : data.ticket.priority === 'high' ? '2 hours' : '4 hours'} as per our support SLA.</p>
        </div>
    </div>
</body>
</html>`

    const text = `
NEW SUPPORT TICKET #${data.ticket.id.slice(-6)}

DETAILS:
- Type: ${data.ticket.type.replace('_', ' ').toUpperCase()}
- Priority: ${data.ticket.priority.toUpperCase()}
- Subject: ${data.ticket.subject}
- User: ${data.ticket.userName} (${data.ticket.userEmail})
- Company: ${data.companyName || data.ticket.companyCode || 'N/A'}
- Created: ${typeof data.ticket.createdAt === 'string' ? new Date(data.ticket.createdAt).toLocaleString() : data.ticket.createdAt.toDate().toLocaleString()}

DESCRIPTION:
${data.ticket.description}

TAGS: ${data.ticket.tags.join(', ') || 'None'}

MANAGE TICKET:
https://tutora-g6d5ktgta-johns-projects-eb6ca0cb.vercel.app/admin/support/${data.ticket.id}

This ticket requires response within ${data.ticket.priority === 'urgent' ? '1 hour' : data.ticket.priority === 'high' ? '2 hours' : '4 hours'} as per our SLA.
    `

    return { subject, html, text }
  }

  private getSupportConfirmationTemplate(data: SupportTicketEmailData): EmailTemplate {
    const subject = `[TUTORA] Support Ticket Created #${data.ticket.id.slice(-6)}`
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Support Ticket Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">✅ Support Ticket Created</h1>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #28a745; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #495057; margin-top: 0;">Hi ${data.ticket.userName}! 👋</h2>
        
        <p>Thank you for contacting Tutora support! Your ticket has been created and our team will respond soon.</p>
        
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #155724;">🎫 Your Ticket Details:</h3>
            <p><strong>Ticket ID:</strong> #${data.ticket.id.slice(-6)}</p>
            <p><strong>Subject:</strong> ${data.ticket.subject}</p>
            <p><strong>Priority:</strong> ${data.ticket.priority}</p>
            <p><strong>Status:</strong> ${data.ticket.status}</p>
        </div>
        
        <h3 style="color: #495057;">⏰ Response Times:</h3>
        <ul>
            <li><strong>Standard:</strong> Within 4 hours</li>
            <li><strong>High Priority:</strong> Within 2 hours</li>
            <li><strong>Urgent:</strong> Within 1 hour</li>
        </ul>
        
        <h3 style="color: #495057;">📧 What happens next:</h3>
        <ol>
            <li>Our support team will review your request</li>
            <li>You'll receive email updates at ${data.ticket.userEmail}</li>
            <li>We'll work with you until your issue is resolved</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://tutora-g6d5ktgta-johns-projects-eb6ca0cb.vercel.app/support/track/${data.ticket.id}" style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Track Your Ticket</a>
        </div>
        
        <div style="background: #cce5ff; border: 1px solid #99d6ff; padding: 15px; border-radius: 8px;">
            <h4 style="margin-top: 0; color: #004085;">💡 Need immediate help?</h4>
            <p style="margin-bottom: 0; color: #004085;">Reply to this email or call our support line. Our team is here to help!</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e1e5e9; margin: 30px 0;">
        
        <p>Best regards,<br><strong>The Tutora Support Team</strong><br>support@tutoralearn.com</p>
    </div>
    
    <div style="text-align: center; color: #6c757d; font-size: 12px; margin-top: 20px;">
        <p>This email was sent to ${data.ticket.userEmail} regarding your support request.</p>
    </div>
</body>
</html>`

    const text = `
Support Ticket Created ✅

Hi ${data.ticket.userName}!

Thank you for contacting Tutora support! Your ticket has been created and our team will respond soon.

TICKET DETAILS:
- Ticket ID: #${data.ticket.id.slice(-6)}
- Subject: ${data.ticket.subject}
- Priority: ${data.ticket.priority}
- Status: ${data.ticket.status}

RESPONSE TIMES:
- Standard: Within 4 hours
- High Priority: Within 2 hours
- Urgent: Within 1 hour

WHAT HAPPENS NEXT:
1. Our support team will review your request
2. You'll receive email updates at ${data.ticket.userEmail}
3. We'll work with you until your issue is resolved

Track your ticket: https://tutora-g6d5ktgta-johns-projects-eb6ca0cb.vercel.app/support/track/${data.ticket.id}

Best regards,
The Tutora Support Team
support@tutoralearn.com
    `

    return { subject, html, text }
  }

  private getModuleAssignmentTemplate(userName: string, moduleName: string, dueDate?: string): EmailTemplate {
    const subject = `📚 New Training Module Assigned: ${moduleName}`
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Module Assignment</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">📚 New Module Assigned</h1>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #667eea; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #495057; margin-top: 0;">Hi ${userName}! 👋</h2>
        
        <p>You have been assigned a new training module. Start learning and boost your skills!</p>
        
        <div style="background: #e7f3ff; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0c5460;">📖 Module Details:</h3>
            <p><strong>Module:</strong> ${moduleName}</p>
            ${dueDate ? `<p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://app.tutoralearn.com/modules" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Start Learning</a>
        </div>
        
        <p>Complete this module to earn points and certificates. Track your progress in the Tutora app!</p>
    </div>
</body>
</html>`

    const text = `
New Training Module Assigned 📚

Hi ${userName}!

You have been assigned a new training module: ${moduleName}
${dueDate ? `Due Date: ${new Date(dueDate).toLocaleDateString()}` : ''}

Start learning: https://app.tutoralearn.com/modules

Complete this module to earn points and certificates!
    `

    return { subject, html, text }
  }

  private getAchievementTemplate(userName: string, achievement: string, certificateUrl?: string): EmailTemplate {
    const subject = `🏆 Achievement Unlocked: ${achievement}`
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Achievement Unlocked</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #ffc107 0%, #ff6b35 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 32px;">🏆</h1>
        <h2 style="margin: 10px 0 0 0;">Achievement Unlocked!</h2>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #ffc107; border-top: none; border-radius: 0 0 8px 8px; text-align: center;">
        <h2 style="color: #495057; margin-top: 0;">Congratulations ${userName}! 🎉</h2>
        
        <div style="background: #fff8e1; border: 2px solid #ffc107; padding: 30px; border-radius: 12px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #f57c00; font-size: 24px;">${achievement}</h3>
            <p style="color: #ef6c00; font-size: 18px; margin-bottom: 0;">Keep up the excellent work!</p>
        </div>
        
        ${certificateUrl ? `
        <div style="margin: 30px 0;">
            <a href="${certificateUrl}" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Download Certificate</a>
        </div>
        ` : ''}
        
        <p>Share your achievement with your team and keep learning to unlock more rewards!</p>
    </div>
</body>
</html>`

    const text = `
Achievement Unlocked! 🏆

Congratulations ${userName}!

You've earned: ${achievement}

${certificateUrl ? `Download your certificate: ${certificateUrl}` : ''}

Keep up the excellent work!
    `

    return { subject, html, text }
  }

  private getPasswordResetTemplate(userName: string, resetUrl: string): EmailTemplate {
    const subject = 'Reset Your Tutora Password'
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #6c757d; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">🔐 Password Reset Request</h1>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #6c757d; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #495057; margin-top: 0;">Hi ${userName}!</h2>
        
        <p>We received a request to reset your Tutora password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        
        <p><strong>This link will expire in 1 hour.</strong></p>
        
        <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
        
        <hr style="border: none; border-top: 1px solid #e1e5e9; margin: 30px 0;">
        
        <p style="color: #6c757d; font-size: 14px;">If the button doesn't work, copy and paste this URL into your browser:</p>
        <p style="color: #6c757d; font-size: 14px; word-break: break-all;">${resetUrl}</p>
    </div>
</body>
</html>`

    const text = `
Password Reset Request 🔐

Hi ${userName}!

We received a request to reset your Tutora password.

Reset your password: ${resetUrl}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.
    `

    return { subject, html, text }
  }

  private getAnnouncementTemplate(message: string, companyName?: string): EmailTemplate {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Announcement</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">📢 Announcement${companyName ? ` - ${companyName}` : ''}</h1>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #667eea; border-top: none; border-radius: 0 0 8px 8px;">
        <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #007bff; margin-bottom: 20px;">
            ${message.replace(/\n/g, '<br>')}
        </div>
        
        <p>Best regards,<br><strong>The Tutora Team</strong></p>
    </div>
</body>
</html>`

    const text = `
Announcement${companyName ? ` - ${companyName}` : ''} 📢

${message}

Best regards,
The Tutora Team
    `

    return { subject: `Announcement${companyName ? ` - ${companyName}` : ''}`, html, text }
  }

  // Utility method to convert HTML to plain text
  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Test email connectivity
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      return false
    }

    try {
      await this.transporter.verify()
      console.log('✅ Email service connection test successful')
      return true
    } catch (error) {
      console.error('❌ Email service connection test failed:', error)
      return false
    }
  }

  // Get service status
  getStatus() {
    return {
      configured: this.isConfigured,
      host: process.env.SMTP_HOST || 'Not configured',
      user: process.env.SMTP_USER || 'Not configured'
    }
  }
}

export const emailService = new EmailService() 