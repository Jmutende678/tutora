import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

// Create reusable transporter
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  return nodemailer.createTransport(config);
};

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Check if email is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email not configured, skipping send:', options.subject);
      return false;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: options.from || `"Tutora" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;

  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

// Email templates
export const emailTemplates = {
  welcome: (name: string, companyName: string) => ({
    subject: `Welcome to Tutora, ${name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to Tutora!</h1>
        <p>Hi ${name},</p>
        <p>Welcome to Tutora! We're excited to help ${companyName} transform your training programs with AI-powered solutions.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Getting Started:</h3>
          <ul>
            <li>Access your admin dashboard</li>
            <li>Create your first training module</li>
            <li>Invite team members</li>
            <li>Explore AI course builder</li>
          </ul>
        </div>
        <p>If you have any questions, don't hesitate to reach out to our support team.</p>
        <p>Best regards,<br>The Tutora Team</p>
      </div>
    `,
    text: `
Welcome to Tutora!

Hi ${name},

Welcome to Tutora! We're excited to help ${companyName} transform your training programs with AI-powered solutions.

Getting Started:
- Access your admin dashboard
- Create your first training module
- Invite team members
- Explore AI course builder

If you have any questions, don't hesitate to reach out to our support team.

Best regards,
The Tutora Team
    `
  }),

  passwordReset: (name: string, resetLink: string) => ({
    subject: 'Reset Your Tutora Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Password Reset Request</h1>
        <p>Hi ${name},</p>
        <p>You requested to reset your password for your Tutora account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
        <p>Best regards,<br>The Tutora Team</p>
      </div>
    `,
    text: `
Password Reset Request

Hi ${name},

You requested to reset your password for your Tutora account.

Reset your password: ${resetLink}

This link will expire in 1 hour for security reasons.

If you didn't request this reset, please ignore this email.

Best regards,
The Tutora Team
    `
  }),

  moduleCompleted: (name: string, moduleName: string, score: number) => ({
    subject: `Congratulations! You completed "${moduleName}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">🎉 Module Completed!</h1>
        <p>Hi ${name},</p>
        <p>Congratulations on completing the training module: <strong>"${moduleName}"</strong></p>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h2 style="color: #10b981; margin: 0;">Your Score: ${score}%</h2>
        </div>
        <p>Keep up the great work! Continue your learning journey with more modules.</p>
        <p>Best regards,<br>The Tutora Team</p>
      </div>
    `,
    text: `
🎉 Module Completed!

Hi ${name},

Congratulations on completing the training module: "${moduleName}"

Your Score: ${score}%

Keep up the great work! Continue your learning journey with more modules.

Best regards,
The Tutora Team
    `
  })
};

// Queue email for later sending (useful for bulk operations)
export async function queueEmail(options: EmailOptions, scheduledFor?: Date) {
  try {
    const { supabase } = await import('./supabase');
    
    const { error } = await supabase
      .from('email_queue')
      .insert({
        to_email: options.to,
        from_email: options.from || `"Tutora" <${process.env.SMTP_USER}>`,
        subject: options.subject,
        html_content: options.html,
        text_content: options.text,
        scheduled_for: scheduledFor || new Date()
      });

    if (error) {
      console.error('Failed to queue email:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Email queueing failed:', error);
    return false;
  }
}
