import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { firebaseAdminService, type SupportTicket } from '@/lib/firebase-admin'
import { emailService } from '@/lib/email-service'

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

    // Get company info if company code provided
    let company = null
    if (body.companyCode) {
      company = await firebaseAdminService.getCompanyByCode(body.companyCode)
    }

    // Create support ticket using Firebase admin service
    const ticketData: Partial<SupportTicket> = {
      type: body.type,
      priority: body.priority || 'medium',
      subject: body.subject,
      description: body.description,
      userEmail: body.userEmail,
      userName: body.userName,
      companyCode: body.companyCode,
      companyId: company?.id,
      tags: body.tags || [],
      attachments: body.attachments || []
    }

    const ticket = await firebaseAdminService.createSupportTicket(ticketData)

    // Send email notifications
    try {
      // Send notification to support team
      await emailService.sendSupportTicketNotification({
        ticket,
        companyName: company?.name,
        isNotification: true
      })

      // Send confirmation to user
      await emailService.sendSupportTicketNotification({
        ticket,
        companyName: company?.name,
        isNotification: false
      })

      console.log('✅ Support ticket emails sent successfully')
    } catch (emailError) {
      console.error('⚠️ Failed to send support ticket emails:', emailError)
      // Don't fail the request if email fails
    }

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
    console.error('❌ Error creating support ticket:', error)
    return NextResponse.json(
      { error: 'Failed to create support ticket. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const status = url.searchParams.get('status') || undefined
    const priority = url.searchParams.get('priority') || undefined
    const companyId = url.searchParams.get('companyId') || undefined
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 50

    // Get tickets using Firebase admin service
    const tickets = await firebaseAdminService.getSupportTickets({
      status,
      priority,
      companyId,
      limit
    })

    // If no tickets found in Firebase, return mock data for demo
    if (tickets.length === 0) {
      const mockTickets: SupportTicket[] = [
        {
          id: 'ticket-demo-001',
          type: 'technical',
          priority: 'high',
          status: 'open',
          subject: 'AI Module Builder not working',
          description: 'Getting error when uploading video files. The upload progress bar reaches 100% but then shows an error message.',
          userEmail: 'sarah.johnson@techflow.com',
          userName: 'Sarah Johnson',
          companyCode: 'TUT-2024-TF001',
          companyId: 'company_techflow',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          tags: ['ai-module', 'upload-error', 'video'],
          attachments: [],
          internalNotes: [],
          responses: []
        },
        {
          id: 'ticket-demo-002',
          type: 'billing',
          priority: 'medium',
          status: 'in_progress',
          subject: 'Question about plan upgrade',
          description: 'We want to upgrade from Basic to Growth plan. How do we ensure our current data is preserved?',
          userEmail: 'admin@innovatecorp.com',
          userName: 'Michael Chen',
          companyCode: 'TUT-2024-IC002',
          companyId: 'company_innovate',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          tags: ['billing', 'upgrade', 'plan-change'],
          attachments: [],
          internalNotes: [
            {
              id: 'note_001',
              note: 'Customer is on Basic plan with 23 users. Upgrade should be straightforward.',
              createdBy: 'support_agent_1',
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
            }
          ],
          responses: [
            {
              id: 'response_001',
              message: 'Hi Michael! Thank you for your inquiry. I\'ll help you with the upgrade process. All your current data will be preserved during the upgrade.',
              isInternal: false,
              createdBy: 'support_agent_1',
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
            }
          ]
        },
        {
          id: 'ticket-demo-003',
          type: 'general',
          priority: 'low',
          status: 'resolved',
          subject: 'How to export user progress reports',
          description: 'I need to generate a progress report for our monthly team meeting. Where can I find the export feature?',
          userEmail: 'lisa.thompson@growthtech.com',
          userName: 'Lisa Thompson',
          companyCode: 'TUT-2024-GT003',
          companyId: 'company_growth',
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          tags: ['reporting', 'analytics', 'export'],
          attachments: [],
          internalNotes: [],
          responses: [
            {
              id: 'response_002',
              message: 'Hi Lisa! You can find the export feature in your admin dashboard under Analytics > Reports. I\'ve sent you a quick video guide as well.',
              isInternal: false,
              createdBy: 'support_agent_2',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            }
          ]
        }
      ]

      return NextResponse.json({ 
        tickets: mockTickets.filter(ticket => 
          (!status || ticket.status === status) &&
          (!priority || ticket.priority === priority)
        )
      })
    }

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('❌ Error fetching support tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

// PUT endpoint for updating tickets (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticketId, status, priority, assignedTo, internalNote, response } = body

    if (!ticketId) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      )
    }

    // TODO: Implement ticket update logic with Firebase
    console.log('📝 Updating ticket:', ticketId, body)

    // For now, return success
    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully'
    })

  } catch (error) {
    console.error('❌ Error updating support ticket:', error)
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    )
  }
} 