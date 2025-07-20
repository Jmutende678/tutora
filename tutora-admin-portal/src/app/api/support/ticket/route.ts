import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

// Support ticket types and priorities
export type TicketType = 'technical' | 'billing' | 'feature_request' | 'general'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface SupportTicket {
  id: string
  type: TicketType
  priority: TicketPriority
  status: TicketStatus
  subject: string
  description: string
  userEmail: string
  userName: string
  companyCode?: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
  attachments?: string[]
  internalNotes?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['subject', 'description', 'userEmail', 'userName', 'type']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Create support ticket
    const ticket: SupportTicket = {
      id: nanoid(),
      type: body.type,
      priority: body.priority || 'medium',
      status: 'open',
      subject: body.subject,
      description: body.description,
      userEmail: body.userEmail,
      userName: body.userName,
      companyCode: body.companyCode,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: body.tags || [],
      attachments: body.attachments || [],
      internalNotes: []
    }

    // Send email notification to support team
    await sendSupportNotification(ticket)

    // Send confirmation email to user
    await sendTicketConfirmation(ticket)

    // Save to database (Firebase or mock)
    await saveTicket(ticket)

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        status: ticket.status,
        createdAt: ticket.createdAt
      },
      message: 'Support ticket created successfully. Our team will respond within 4 hours.'
    })

  } catch (error) {
    console.error('Error creating support ticket:', error)
    return NextResponse.json(
      { error: 'Failed to create support ticket' },
      { status: 500 }
    )
  }
}

async function sendSupportNotification(ticket: SupportTicket) {
  try {
    // Email configuration
    const supportEmail = process.env.SUPPORT_EMAIL || 'support@tutoralearn.com'
    
    const emailContent = `
🎫 NEW SUPPORT TICKET #${ticket.id}

📋 DETAILS:
• Type: ${ticket.type.toUpperCase()}
• Priority: ${ticket.priority.toUpperCase()}
• Subject: ${ticket.subject}
• User: ${ticket.userName} (${ticket.userEmail})
• Company: ${ticket.companyCode || 'N/A'}
• Created: ${ticket.createdAt.toISOString()}

📝 DESCRIPTION:
${ticket.description}

🏷️ TAGS: ${ticket.tags.join(', ') || 'None'}

🔗 MANAGE TICKET:
https://tutora-g6d5ktgta-johns-projects-eb6ca0cb.vercel.app/admin/support/${ticket.id}

---
This ticket requires response within 4 hours as per our SLA.
    `.trim()

    // In production, integrate with your email service
    console.log('📧 Support notification email would be sent to:', supportEmail)
    console.log('📄 Email content:', emailContent)

    // TODO: Implement actual email sending
    // await emailService.send({
    //   to: supportEmail,
    //   subject: `[SUPPORT] ${ticket.priority.toUpperCase()}: ${ticket.subject}`,
    //   text: emailContent
    // })

  } catch (error) {
    console.error('Failed to send support notification:', error)
  }
}

async function sendTicketConfirmation(ticket: SupportTicket) {
  try {
    const confirmationEmail = `
Hi ${ticket.userName},

Thank you for contacting Tutora support! Your ticket has been created and our team will respond soon.

🎫 TICKET DETAILS:
• Ticket ID: #${ticket.id}
• Subject: ${ticket.subject}
• Priority: ${ticket.priority}
• Status: ${ticket.status}

⏰ RESPONSE TIME:
• Standard: Within 4 hours
• High Priority: Within 2 hours
• Urgent: Within 1 hour

📧 UPDATES:
You'll receive email updates at ${ticket.userEmail} as we work on your request.

🔗 TRACK YOUR TICKET:
https://tutora-g6d5ktgta-johns-projects-eb6ca0cb.vercel.app/support/track/${ticket.id}

Need immediate assistance? Reply to this email or call our support line.

Best regards,
The Tutora Support Team
support@tutoralearn.com
    `.trim()

    console.log('📧 Confirmation email would be sent to:', ticket.userEmail)
    console.log('📄 Email content:', confirmationEmail)

    // TODO: Implement actual email sending
    // await emailService.send({
    //   to: ticket.userEmail,
    //   subject: `[TUTORA] Support Ticket Created #${ticket.id}`,
    //   text: confirmationEmail
    // })

  } catch (error) {
    console.error('Failed to send ticket confirmation:', error)
  }
}

async function saveTicket(ticket: SupportTicket) {
  try {
    // TODO: Save to Firebase when credentials are configured
    console.log('💾 Ticket saved (mock):', ticket.id)
    
    // In production with Firebase:
    // if (db) {
    //   await db.collection('support_tickets').doc(ticket.id).set(ticket)
    // }
  } catch (error) {
    console.error('Failed to save ticket:', error)
  }
}

// GET endpoint to retrieve tickets (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const priority = url.searchParams.get('priority')
    const type = url.searchParams.get('type')
    
    // TODO: Fetch from Firebase/database
    const mockTickets: SupportTicket[] = [
      {
        id: 'ticket-001',
        type: 'technical',
        priority: 'high',
        status: 'open',
        subject: 'AI Module Builder not working',
        description: 'Getting error when uploading video files',
        userEmail: 'john@company.com',
        userName: 'John Doe',
        companyCode: 'TUT-2024-ABC123',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['ai-module', 'upload-error']
      }
    ]

    return NextResponse.json({ tickets: mockTickets })
  } catch (error) {
    console.error('Error fetching support tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
} 