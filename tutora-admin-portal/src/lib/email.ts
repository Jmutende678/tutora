import nodemailer from 'nodemailer'

// Supabase-based Company interface
interface Company {
  id: string
  company_code: string
  name: string
  plan: 'basic' | 'premium' | 'enterprise'
  admin_user_email: string
  admin_user_name: string
  billing_email: string
  email: string
  adminUser: {
    email: string
    name: string
  }
}

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export class EmailService {
  // private transporter: nodemailer.Transporter
  
  constructor() {
    // Mock transporter for development
    console.log('Email service initialized in development mode')
  }

  async sendWelcomeEmail(company: Company): Promise<void> {
    console.log('Sending welcome email to:', company.email)
    console.log('Company code:', company.company_code)
    
    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('SMTP not configured, skipping email')
      return
    }
    
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      const template = this.getWelcomeTemplate(company)

      await transporter.sendMail({
        from: `"Tutora" <${process.env.SMTP_USER}>`,
        to: company.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      })
      
      console.log('✅ Welcome email sent successfully to:', company.email)
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error)
      throw error
    }
  }

  async sendPaymentConfirmation(company: Company, amount: number): Promise<void> {
    console.log('Sending payment confirmation to:', company.email)
    console.log('Amount:', amount)
    
    // Mock email sending
    const emailContent = `
      Payment Confirmation
      
      Thank you for your payment of $${amount/100} for ${company.plan} plan.
      Company: ${company.name}
      Company Code: ${company.company_code}
    `
    
    console.log('Payment confirmation email:', emailContent)
  }

  async sendCompanyCodeEmail(company: Company, recipientEmail?: string): Promise<void> {
    const template = this.getCompanyCodeTemplate(company)
    
    await this.sendEmail({
      to: recipientEmail || company.admin_user_email,
      subject: template.subject,
      html: template.html,
      text: template.text
    })
  }

  async sendPaymentSuccessEmail(company: Company, amount: number): Promise<void> {
    const template = this.getPaymentSuccessTemplate(company, amount)
    
    await this.sendEmail({
      to: company.admin_user_email,
      subject: template.subject,
      html: template.html,
      text: template.text
    })
  }

  async sendPaymentFailedEmail(company: Company, amount: number): Promise<void> {
    const template = this.getPaymentFailedTemplate(company, amount)
    
    await this.sendEmail({
      to: company.admin_user_email,
      subject: template.subject,
      html: template.html,
      text: template.text
    })
  }

  async sendUserInviteEmail(userEmail: string, companyName: string, companyCode: string, temporaryPassword: string): Promise<void> {
    const template = this.getUserInviteTemplate(userEmail, companyName, companyCode, temporaryPassword)
    
    await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    })
  }

  async sendSupportEmail(fromEmail: string, subject: string, message: string): Promise<void> {
    const template = this.getSupportTemplate(fromEmail, subject, message)
    
    await this.sendEmail({
      to: process.env.SUPPORT_EMAIL || 'support@tutoralearn.com',
      subject: template.subject,
      html: template.html,
      text: template.text,
      replyTo: fromEmail
    })
  }

  private async sendEmail(options: {
    to: string
    subject: string
    html: string
    text: string
    replyTo?: string
  }): Promise<void> {
    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('SMTP not configured, logging email instead:', options)
      return
    }
    
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transporter.sendMail({
        from: `"Tutora" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
      })
      
      console.log('✅ Email sent successfully to:', options.to)
    } catch (error) {
      console.error('❌ Failed to send email:', error)
      throw error
    }
  }

  private getWelcomeTemplate(company: Company): EmailTemplate {
    const appDomain = process.env.NEXT_PUBLIC_APP_URL || 'https://tutora.vercel.app'
    
    return {
      subject: `Welcome to Tutora! Your company code: ${company.company_code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2E9CFF, #64B5FF); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
            .button { display: inline-block; background: #2E9CFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .code-box { background: #f8f9fa; border: 2px solid #2E9CFF; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
            .code { font-size: 24px; font-weight: bold; color: #2E9CFF; letter-spacing: 2px; }
            .feature-list { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .feature-item { margin: 10px 0; padding-left: 20px; position: relative; }
            .feature-item:before { content: "✓"; position: absolute; left: 0; color: #2E9CFF; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Tutora!</h1>
              <p>Your learning platform is ready to go</p>
            </div>
            
            <div class="content">
              <h2>Hello ${company.admin_user_name},</h2>
              
              <p>Congratulations! Your Tutora learning platform has been successfully set up for <strong>${company.name}</strong>.</p>
              
              <div class="code-box">
                <h3>Your Company Code</h3>
                <div class="code">${company.company_code}</div>
                <p>Share this code with your team members to join your organization.</p>
              </div>
              
              <h3>What's Next?</h3>
              <div class="feature-list">
                <div class="feature-item">Upload training videos and documents</div>
                <div class="feature-item">Create AI-powered learning modules</div>
                <div class="feature-item">Invite team members using your company code</div>
                <div class="feature-item">Track progress and engagement</div>
                <div class="feature-item">Access analytics and insights</div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${appDomain}/admin/dashboard" class="button">Access Your Dashboard</a>
              </div>
              
              <p style="margin-top: 30px;">Welcome to the future of training!</p>
              
              <p>Best regards,<br>The Tutora Team</p>
            </div>
            
            <div class="footer">
              <p>© 2024 Tutora. All rights reserved.</p>
              <p>Need help? Contact us at support@tutoralearn.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to Tutora! 🚀
        
Hello ${company.admin_user_name},
        
        Congratulations! Your Tutora learning platform has been successfully set up for ${company.name}.
        
Your Company Code: ${company.company_code}
        
Share this code with your team members to join your organization.

What's Next?
✓ Upload training videos and documents
✓ Create AI-powered learning modules
✓ Invite team members using your company code
✓ Track progress and engagement
✓ Access analytics and insights

Access your dashboard: ${appDomain}/admin/dashboard

Welcome to the future of training!
        
        Best regards,
        The Tutora Team

© 2024 Tutora. All rights reserved.
Need help? Contact us at support@tutoralearn.com
      `
    }
  }

  private getCompanyCodeTemplate(company: Company): EmailTemplate {
    return {
      subject: `Your Tutora Company Code: ${company.company_code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2E9CFF, #64B5FF); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
            .code-box { background: #f8f9fa; border: 2px solid #2E9CFF; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
            .code { font-size: 24px; font-weight: bold; color: #2E9CFF; letter-spacing: 2px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔑 Your Company Code</h1>
            </div>
            
            <div class="content">
              <h2>Hello,</h2>
              
              <p>Here's your company code for accessing the Tutora learning platform:</p>
              
              <div class="code-box">
                <div class="code">${company.company_code}</div>
                <p><small>Company: ${company.name}</small></p>
              </div>
              
              <p>Use this code when logging into the Tutora app to access your company's training content.</p>
              
              <p>Best regards,<br>The Tutora Team</p>
            </div>
            
            <div class="footer">
              <p>&copy; 2024 Tutora. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Your Tutora Company Code
        
        Hello,
        
        Here's your company code for accessing the Tutora learning platform:
        
        Company Code: ${company.company_code}
        Company: ${company.name}
        
        Use this code when logging into the Tutora app to access your company's training content.
        
        Best regards,
        The Tutora Team
      `
    }
  }

  private getPaymentSuccessTemplate(company: Company, amount: number): EmailTemplate {
    return {
      subject: `Payment Confirmation - $${amount}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
            .amount { font-size: 24px; font-weight: bold; color: #28a745; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Payment Successful</h1>
            </div>
            
            <div class="content">
              <h2>Hello ${company.admin_user_name},</h2>
              
              <p>Your payment has been successfully processed!</p>
              
              <p><strong>Amount:</strong> <span class="amount">$${amount}</span></p>
              <p><strong>Company:</strong> ${company.name}</p>
              <p><strong>Plan:</strong> ${company.plan}</p>
              
              <p>Your Tutora ${company.plan} plan is now active and ready to use.</p>
              
              <p>Best regards,<br>The Tutora Team</p>
            </div>
            
            <div class="footer">
              <p>&copy; 2024 Tutora. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Payment Successful
        
        Hello ${company.admin_user_name},
        
        Your payment has been successfully processed!
        
        Amount: $${amount}
        Company: ${company.name}
        Plan: ${company.plan}
        
        Your Tutora ${company.plan} plan is now active and ready to use.
        
        Best regards,
        The Tutora Team
      `
    }
  }

  private getPaymentFailedTemplate(company: Company, amount: number): EmailTemplate {
    return {
      subject: `Payment Failed - Action Required`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
            .button { display: inline-block; background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>❌ Payment Failed</h1>
            </div>
            
            <div class="content">
              <h2>Hello ${company.admin_user_name},</h2>
              
              <p>We encountered an issue processing your payment.</p>
              
              <p><strong>Amount:</strong> $${amount}</p>
              <p><strong>Company:</strong> ${company.name}</p>
              
              <p>Please update your payment method to continue using your Tutora ${company.plan} plan.</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="https://admin.${process.env.APP_DOMAIN}/billing" class="button">Update Payment Method</a>
              </p>
              
              <p>Best regards,<br>The Tutora Team</p>
            </div>
            
            <div class="footer">
              <p>&copy; 2024 Tutora. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Payment Failed - Action Required
        
        Hello ${company.admin_user_name},
        
        We encountered an issue processing your payment.
        
        Amount: $${amount}
        Company: ${company.name}
        
        Please update your payment method to continue using your Tutora ${company.plan} plan.
        
        Update Payment Method: https://admin.${process.env.APP_DOMAIN}/billing
        
        Best regards,
        The Tutora Team
      `
    }
  }

  private getUserInviteTemplate(userEmail: string, companyName: string, companyCode: string, temporaryPassword: string): EmailTemplate {
    return {
      subject: `You've been invited to join ${companyName} on Tutora`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2E9CFF, #64B5FF); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
            .credentials { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #2E9CFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📚 Welcome to Tutora!</h1>
            </div>
            
            <div class="content">
              <h2>Hello,</h2>
              
              <p>You've been invited to join <strong>${companyName}</strong> on the Tutora learning platform!</p>
              
              <div class="credentials">
                <h3>Your Login Details:</h3>
                <p><strong>Company Code:</strong> ${companyCode}</p>
                <p><strong>Email:</strong> ${userEmail}</p>
                <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
              </div>
              
              <p><em>Please change your password after your first login.</em></p>
              
              <h3>Getting Started:</h3>
              <ol>
                <li>Download the Tutora app from your app store</li>
                <li>Enter the company code: <strong>${companyCode}</strong></li>
                <li>Login with your email and temporary password</li>
                <li>Change your password when prompted</li>
                <li>Start your learning journey!</li>
              </ol>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="https://app.${process.env.APP_DOMAIN}" class="button">Get Started</a>
              </p>
              
              <p>Best regards,<br>The Tutora Team</p>
            </div>
            
            <div class="footer">
              <p>&copy; 2024 Tutora. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Tutora!
        
        Hello,
        
        You've been invited to join ${companyName} on the Tutora learning platform!
        
        Your Login Details:
        Company Code: ${companyCode}
        Email: ${userEmail}
        Temporary Password: ${temporaryPassword}
        
        Please change your password after your first login.
        
        Getting Started:
        1. Download the Tutora app from your app store
        2. Enter the company code: ${companyCode}
        3. Login with your email and temporary password
        4. Change your password when prompted
        5. Start your learning journey!
        
        Best regards,
        The Tutora Team
      `
    }
  }

  private getSupportTemplate(fromEmail: string, subject: string, message: string): EmailTemplate {
    return {
      subject: `Support Request: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6c757d; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
            .message { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎫 Support Request</h1>
            </div>
            
            <div class="content">
              <h2>New Support Request</h2>
              
              <p><strong>From:</strong> ${fromEmail}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              
              <div class="message">
                <h3>Message:</h3>
                <p>${message}</p>
              </div>
              
              <p><small>Reply to this email to respond directly to the user.</small></p>
            </div>
            
            <div class="footer">
              <p>&copy; 2024 Tutora Support System</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Support Request
        
        From: ${fromEmail}
        Subject: ${subject}
        
        Message:
        ${message}
        
        Reply to this email to respond directly to the user.
      `
    }
  }
}

export default EmailService 