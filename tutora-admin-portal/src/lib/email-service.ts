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

  // 🚀 SALES NOTIFICATIONS - Send instant alerts to sales@tutoralearn.com
  async sendSalesNotification(type: string, data: any): Promise<boolean> {
    const salesEmail = 'sales@tutoralearn.com'
    const template = this.getSalesNotificationTemplate(type, data)
    
    return await this.sendEmail(
      salesEmail,
      template.subject,
      template.html,
      template.text
    )
  }

  // Security audit request notification
  async sendSecurityAuditNotification(formData: {
    companyName: string
    email: string
    phone?: string
    message: string
    urgency: string
  }): Promise<boolean> {
    const salesEmail = 'sales@tutoralearn.com'
    const template = this.getSecurityAuditTemplate(formData)
    
    return await this.sendEmail(
      salesEmail,
      template.subject,
      template.html,
      template.text
    )
  }

  // User registration notification
  async sendRegistrationNotification(userData: {
    companyName: string
    email: string
    name: string
    teamSize: string
    plan?: string
  }): Promise<boolean> {
    const salesEmail = 'sales@tutoralearn.com'
    const template = this.getRegistrationTemplate(userData)
    
    return await this.sendEmail(
      salesEmail,
      template.subject,
      template.html,
      template.text
    )
  }

  // Demo scheduled notification
  async sendDemoNotification(demoData: {
    companyName: string
    email: string
    name: string
    phone?: string
    preferredTime: string
    message?: string
  }): Promise<boolean> {
    const salesEmail = 'sales@tutoralearn.com'
    const template = this.getDemoTemplate(demoData)
    
    return await this.sendEmail(
      salesEmail,
      template.subject,
      template.html,
      template.text
    )
  }

  // Module usage/completion notification
  async sendModuleUsageNotification(usageData: {
    userEmail: string
    userName: string
    companyName: string
    moduleName: string
    action: 'started' | 'completed' | 'failed'
    completionRate?: number
  }): Promise<boolean> {
    const salesEmail = 'sales@tutoralearn.com'
    const template = this.getModuleUsageTemplate(usageData)
    
    return await this.sendEmail(
      salesEmail,
      template.subject,
      template.html,
      template.text
    )
  }

  // 🎨 SALES EMAIL TEMPLATES
  private getSalesNotificationTemplate(type: string, data: any): EmailTemplate {
    const subject = `🔥 NEW ${type.toUpperCase()} - Tutora Sales Alert`
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sales Alert</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">🔥 NEW ${type.toUpperCase()} ALERT!</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Time: ${new Date().toLocaleString()}</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #ff6b6b; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #ff6b6b;">Action Required 💰</h2>
        <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; overflow: auto;">${JSON.stringify(data, null, 2)}</pre>
        
        <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
            <strong>⚡ Follow up immediately for best conversion!</strong>
        </div>
    </div>
</body>
</html>`

    const text = `NEW ${type.toUpperCase()} ALERT! 🔥\n\nTime: ${new Date().toLocaleString()}\n\nData:\n${JSON.stringify(data, null, 2)}\n\n⚡ Follow up immediately for best conversion!`

    return { subject, html, text }
  }

  private getSecurityAuditTemplate(formData: {
    companyName: string
    email: string
    phone?: string
    message: string
    urgency: string
  }): EmailTemplate {
    const subject = `🔒 ENTERPRISE SECURITY AUDIT REQUEST - ${formData.companyName}`
    
    const urgencyColor = formData.urgency === 'emergency' ? '#dc3545' : formData.urgency === 'urgent' ? '#fd7e14' : '#28a745'
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Security Audit Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">🔒 ENTERPRISE SECURITY AUDIT REQUEST</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Time: ${new Date().toLocaleString()}</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #667eea; border-top: none; border-radius: 0 0 8px 8px;">
        <div style="background: ${urgencyColor}; color: white; padding: 10px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
            <strong>🚨 PRIORITY: ${formData.urgency.toUpperCase()}</strong>
        </div>
        
        <h2 style="color: #667eea;">Company Details</h2>
        <ul style="list-style: none; padding: 0;">
            <li><strong>Company:</strong> ${formData.companyName}</li>
            <li><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></li>
            ${formData.phone ? `<li><strong>Phone:</strong> <a href="tel:${formData.phone}">${formData.phone}</a></li>` : ''}
        </ul>
        
        <h3 style="color: #667eea;">Security Requirements</h3>
        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; border-radius: 5px;">
            ${formData.message.replace(/\n/g, '<br>')}
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #d4edda; border-left: 4px solid #28a745; border-radius: 5px;">
            <strong>💰 ENTERPRISE PROSPECT - HIGH VALUE OPPORTUNITY!</strong><br>
            Security audits typically lead to $5K-50K+ deals
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <a href="mailto:${formData.email}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                📧 Reply to Prospect
            </a>
        </div>
    </div>
</body>
</html>`

    const text = `ENTERPRISE SECURITY AUDIT REQUEST 🔒\n\nPRIORITY: ${formData.urgency.toUpperCase()}\nTime: ${new Date().toLocaleString()}\n\nCompany: ${formData.companyName}\nEmail: ${formData.email}\n${formData.phone ? `Phone: ${formData.phone}\n` : ''}\nSecurity Requirements:\n${formData.message}\n\n💰 ENTERPRISE PROSPECT - HIGH VALUE OPPORTUNITY!\nSecurity audits typically lead to $5K-50K+ deals`

    return { subject, html, text }
  }

  private getRegistrationTemplate(userData: {
    companyName: string
    email: string
    name: string
    teamSize: string
    plan?: string
  }): EmailTemplate {
    const subject = `🎯 NEW USER REGISTRATION - ${userData.companyName}`
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Registration</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-w-600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">🎯 NEW USER REGISTRATION!</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Time: ${new Date().toLocaleString()}</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #28a745; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #28a745;">New Prospect Details</h2>
        <ul style="list-style: none; padding: 0;">
            <li><strong>Name:</strong> ${userData.name}</li>
            <li><strong>Company:</strong> ${userData.companyName}</li>
            <li><strong>Email:</strong> <a href="mailto:${userData.email}">${userData.email}</a></li>
            <li><strong>Team Size:</strong> ${userData.teamSize}</li>
            ${userData.plan ? `<li><strong>Interested Plan:</strong> ${userData.plan}</li>` : ''}
        </ul>
        
        <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
            <strong>🔥 HOT LEAD - Contact within 5 minutes for 7x higher conversion!</strong>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <a href="mailto:${userData.email}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">
                📧 Email Prospect
            </a>
            <a href="/admin/dashboard" style="background: #6c757d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                📊 View Dashboard
            </a>
        </div>
    </div>
</body>
</html>`

    const text = `NEW USER REGISTRATION! 🎯\n\nTime: ${new Date().toLocaleString()}\n\nName: ${userData.name}\nCompany: ${userData.companyName}\nEmail: ${userData.email}\nTeam Size: ${userData.teamSize}\n${userData.plan ? `Interested Plan: ${userData.plan}\n` : ''}\n🔥 HOT LEAD - Contact within 5 minutes for 7x higher conversion!`

    return { subject, html, text }
  }

  private getDemoTemplate(demoData: {
    companyName: string
    email: string
    name: string
    phone?: string
    preferredTime: string
    message?: string
  }): EmailTemplate {
    const subject = `🎥 DEMO SCHEDULED - ${demoData.companyName}`
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Demo Scheduled</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">🎥 DEMO SCHEDULED!</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Time: ${new Date().toLocaleString()}</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #6f42c1; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #6f42c1;">Demo Request Details</h2>
        <ul style="list-style: none; padding: 0;">
            <li><strong>Name:</strong> ${demoData.name}</li>
            <li><strong>Company:</strong> ${demoData.companyName}</li>
            <li><strong>Email:</strong> <a href="mailto:${demoData.email}">${demoData.email}</a></li>
            ${demoData.phone ? `<li><strong>Phone:</strong> <a href="tel:${demoData.phone}">${demoData.phone}</a></li>` : ''}
            <li><strong>Preferred Time:</strong> ${demoData.preferredTime}</li>
        </ul>
        
        ${demoData.message ? `
        <h3 style="color: #6f42c1;">Additional Notes</h3>
        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #6f42c1; border-radius: 5px;">
            ${demoData.message.replace(/\n/g, '<br>')}
        </div>
        ` : ''}
        
        <div style="margin-top: 20px; padding: 15px; background: #e7f3ff; border-left: 4px solid #007bff; border-radius: 5px;">
            <strong>💰 QUALIFIED PROSPECT - They want to see the product!</strong><br>
            Demo requests have 40%+ close rates
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <a href="mailto:${demoData.email}" style="background: #6f42c1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">
                📅 Schedule Demo
            </a>
            ${demoData.phone ? `<a href="tel:${demoData.phone}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">📞 Call Now</a>` : ''}
        </div>
    </div>
</body>
</html>`

    const text = `DEMO SCHEDULED! 🎥\n\nTime: ${new Date().toLocaleString()}\n\nName: ${demoData.name}\nCompany: ${demoData.companyName}\nEmail: ${demoData.email}\n${demoData.phone ? `Phone: ${demoData.phone}\n` : ''}Preferred Time: ${demoData.preferredTime}\n${demoData.message ? `Notes: ${demoData.message}\n` : ''}\n💰 QUALIFIED PROSPECT - They want to see the product!\nDemo requests have 40%+ close rates`

    return { subject, html, text }
  }

  private getModuleUsageTemplate(usageData: {
    userEmail: string
    userName: string
    companyName: string
    moduleName: string
    action: 'started' | 'completed' | 'failed'
    completionRate?: number
  }): EmailTemplate {
    const actionEmoji = usageData.action === 'completed' ? '✅' : usageData.action === 'started' ? '▶️' : '❌'
    const subject = `${actionEmoji} MODULE ${usageData.action.toUpperCase()} - ${usageData.companyName}`
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Module Usage Alert</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #17a2b8 0%, #6610f2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">${actionEmoji} MODULE ${usageData.action.toUpperCase()}</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Time: ${new Date().toLocaleString()}</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #17a2b8; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #17a2b8;">Usage Details</h2>
        <ul style="list-style: none; padding: 0;">
            <li><strong>User:</strong> ${usageData.userName} (${usageData.userEmail})</li>
            <li><strong>Company:</strong> ${usageData.companyName}</li>
            <li><strong>Module:</strong> ${usageData.moduleName}</li>
            <li><strong>Action:</strong> ${usageData.action}</li>
            ${usageData.completionRate ? `<li><strong>Completion Rate:</strong> ${usageData.completionRate}%</li>` : ''}
        </ul>
        
        <div style="margin-top: 20px; padding: 15px; background: #f0f8ff; border-left: 4px solid #007bff; border-radius: 5px;">
            <strong>📊 User Engagement Opportunity!</strong><br>
            ${usageData.action === 'completed' ? 'Success! Follow up for expansion opportunities.' : 
              usageData.action === 'started' ? 'User is actively engaging - perfect time to check in.' :
              'User may need help - reach out with support.'}
        </div>
    </div>
</body>
</html>`

    const text = `MODULE ${usageData.action.toUpperCase()} ${actionEmoji}\n\nTime: ${new Date().toLocaleString()}\n\nUser: ${usageData.userName} (${usageData.userEmail})\nCompany: ${usageData.companyName}\nModule: ${usageData.moduleName}\nAction: ${usageData.action}\n${usageData.completionRate ? `Completion Rate: ${usageData.completionRate}%\n` : ''}\n📊 User Engagement Opportunity!`

    return { subject, html, text }
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