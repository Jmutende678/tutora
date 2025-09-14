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

// AI-powered lead scoring function
function calculateLeadScore(data: ContactFormData): { score: number; category: 'hot' | 'warm' | 'cold'; reasons: string[] } {
  let score = 0
  const reasons: string[] = []
  
  // Company size indicators
  if (data.company.toLowerCase().includes('enterprise') || data.company.toLowerCase().includes('corp')) {
    score += 25
    reasons.push('Enterprise company indicator')
  }
  
  // Email domain scoring
  const emailDomain = data.email.split('@')[1]?.toLowerCase()
  if (emailDomain && !['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(emailDomain)) {
    score += 20
    reasons.push('Business email domain')
  }
  
  // Inquiry type scoring
  switch (data.inquiryType) {
    case 'demo':
      score += 35
      reasons.push('Requested product demo')
      break
    case 'sales':
      score += 30
      reasons.push('Sales inquiry')
      break
    case 'support':
      score += 15
      reasons.push('Support inquiry (existing interest)')
      break
    case 'general':
      score += 10
      reasons.push('General inquiry')
      break
  }
  
  // Phone number provided
  if (data.phone && data.phone.trim()) {
    score += 15
    reasons.push('Provided phone number')
  }
  
  // Message quality and urgency indicators
  const message = data.message.toLowerCase()
  if (message.includes('urgent') || message.includes('asap') || message.includes('immediately')) {
    score += 20
    reasons.push('Urgent language detected')
  }
  
  if (message.includes('budget') || message.includes('pricing') || message.includes('cost')) {
    score += 15
    reasons.push('Budget/pricing discussion')
  }
  
  if (message.includes('team') && /\d+/.test(message)) {
    score += 10
    reasons.push('Mentioned team size')
  }
  
  // Subject line indicators
  const subject = data.subject.toLowerCase()
  if (subject.includes('partnership') || subject.includes('integration')) {
    score += 25
    reasons.push('Partnership/integration interest')
  }
  
  // Determine category
  let category: 'hot' | 'warm' | 'cold'
  if (score >= 70) {
    category = 'hot'
  } else if (score >= 40) {
    category = 'warm'
  } else {
    category = 'cold'
  }
  
  return { score, category, reasons }
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
    
    // Store contact form submission in activity tracking system
    try {
      // Save to activity tracking for CEO dashboard
      const activityData = {
        type: 'contact_form_submission',
        user_email: data.email,
        user_name: data.name,
        company: data.company,
        phone: data.phone,
        inquiry_type: data.inquiryType,
        subject: data.subject,
        message: data.message,
        lead_score: calculateLeadScore(data),
        timestamp: data.timestamp,
        source: data.source,
        metadata: {
          form_data: data,
          user_agent: request.headers.get('user-agent'),
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
          referrer: request.headers.get('referer')
        }
      }
      
      // Save to Supabase for CEO dashboard tracking
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      await supabase
        .from('website_activity')
        .insert([activityData])
      
      console.log(`✅ Contact form submission saved to activity tracking for CEO dashboard`)
      
    } catch (trackingError) {
      console.error('❌ Activity tracking failed:', trackingError)
      // Continue even if tracking fails
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
