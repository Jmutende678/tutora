import nodemailer from 'nodemailer'
import { Company } from './firebase'

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
    console.log('Company code:', company.companyCode)
    
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
      Company Code: ${company.companyCode}
    `
    
    console.log('Payment confirmation email:', emailContent)
  }

  async sendCompanyCodeEmail(company: Company, recipientEmail?: string): Promise<void> {
    const template = this.getCompanyCodeTemplate(company)
    
    await this.sendEmail({
      to: recipientEmail || company.adminUser.email,
      subject: template.subject,
      html: template.html,
      text: template.text
    })
  }

  async sendPaymentSuccessEmail(company: Company, amount: number): Promise<void> {
    const template = this.getPaymentSuccessTemplate(company, amount)
    
    await this.sendEmail({
      to: company.adminUser.email,
      subject: template.subject,
      html: template.html,
      text: template.text
    })
  }

  async sendPaymentFailedEmail(company: Company, amount: number): Promise<void> {
    const template = this.getPaymentFailedTemplate(company, amount)
    
    await this.sendEmail({
      to: company.adminUser.email,
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
      to: process.env.ADMIN_EMAIL!,
      subject: `[Tutora Support] ${subject}`,
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
    try {
      // In production, you would uncomment the nodemailer code below:
      /*
      const transporter = nodemailer.createTransporter(config)

      await transporter.sendMail({
        from: `"Tutora Platform" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo
      })
      */
    } catch (error) {
      console.error('Email sending failed:', error)
      throw error
    }
  }

  private getWelcomeTemplate(company: Company): EmailTemplate {
    const appDomain = process.env.APP_DOMAIN || 'tutora.com'
    
    return {
      subject: `Welcome to Tutora! Your company code: ${company.companyCode}`,
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
              <h2>Hello ${company.adminUser.name},</h2>
              
              <p>Congratulations! Your Tutora learning platform has been successfully set up for <strong>${company.name}</strong>.</p>
              
              <div class="code-box">
                <h3>Your Company Code</h3>
                <div class="code">${company.companyCode}</div>
                <p><small>Share this code with your team members to give them access to your training platform.</small></p>
              </div>
              
              <h3>What's included in your ${company.plan} plan:</h3>
              <div class="feature-list">
                ${company.plan === 'starter' ? `
                  <div class="feature-item">Up to 25 users</div>
                  <div class="feature-item">5 AI-generated modules per month</div>
                  <div class="feature-item">Basic analytics & reporting</div>
                  <div class="feature-item">Email support</div>
                  <div class="feature-item">Mobile app access</div>
                ` : company.plan === 'professional' ? `
                  <div class="feature-item">Up to 100 users</div>
                  <div class="feature-item">Unlimited AI-generated modules</div>
                  <div class="feature-item">Advanced analytics & insights</div>
                  <div class="feature-item">Priority support</div>
                  <div class="feature-item">Custom branding</div>
                  <div class="feature-item">Advanced quiz & certification</div>
                ` : `
                  <div class="feature-item">Unlimited users</div>
                  <div class="feature-item">Unlimited AI-generated modules</div>
                  <div class="feature-item">Advanced AI features & customization</div>
                  <div class="feature-item">White-label solution</div>
                  <div class="feature-item">24/7 dedicated support</div>
                  <div class="feature-item">Custom integrations</div>
                  <div class="feature-item">SLA guarantee</div>
                `}
              </div>
              
              <h3>Getting Started:</h3>
              <ol>
                <li>Download the Tutora app from your app store</li>
                <li>Use your company code: <strong>${company.companyCode}</strong></li>
                <li>Login with your email: <strong>${company.adminUser.email}</strong></li>
                <li>Start inviting team members and creating training content</li>
              </ol>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="https://admin.${appDomain}" class="button">Access Admin Portal</a>
              </p>
              
              <p>If you have any questions, our support team is here to help. Just reply to this email!</p>
              
              <p>Best regards,<br>The Tutora Team</p>
            </div>
            
            <div class="footer">
              <p>&copy; 2024 Tutora. All rights reserved.</p>
              <p>Need help? Contact us at support@${appDomain}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Tutora!
        
        Hello ${company.adminUser.name},
        
        Congratulations! Your Tutora learning platform has been successfully set up for ${company.name}.
        
        Your Company Code: ${company.companyCode}
        
        Share this code with your team members to give them access to your training platform.
        
        Getting Started:
        1. Download the Tutora app from your app store
        2. Use your company code: ${company.companyCode}
        3. Login with your email: ${company.adminUser.email}
        4. Start inviting team members and creating training content
        
        Admin Portal: https://admin.${appDomain}
        
        If you have any questions, our support team is here to help. Just reply to this email!
        
        Best regards,
        The Tutora Team
      `
    }
  }

  private getCompanyCodeTemplate(company: Company): EmailTemplate {
    return {
      subject: `Your Tutora Company Code: ${company.companyCode}`,
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
                <div class="code">${company.companyCode}</div>
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
        
        Company Code: ${company.companyCode}
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
              <h2>Hello ${company.adminUser.name},</h2>
              
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
        
        Hello ${company.adminUser.name},
        
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
              <h2>Hello ${company.adminUser.name},</h2>
              
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
        
        Hello ${company.adminUser.name},
        
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