import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { SupabaseService, type SupportTicket } from '@/lib/supabase-service'
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

    const supabaseService = new SupabaseService()

    // Get company info if company code provided
    let company = null
    if (body.companyCode) {
      company = await supabaseService.getCompanyByCode(body.companyCode)
    }

    // Create support ticket using Supabase
    const ticketData = {
      companyId: company?.id || 'unknown',
      userId: nanoid(), // Generate a temp user ID for tickets without auth
      title: body.subject,
      description: body.description,
      priority: body.priority || 'medium'
    }

    const ticket = await supabaseService.createSupportTicket(ticketData)

    // Send email notifications (temporarily disabled - type mismatch)
    try {
      // TODO: Fix email service types to match Supabase SupportTicket interface
      console.log('📧 Email notifications for ticket:', ticket.id)
      console.log('✅ Support ticket created (email notifications disabled during transition)')
    } catch (emailError) {
      console.error('⚠️ Failed to send support ticket emails:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      ticket,
      message: 'Support ticket created successfully'
    })

  } catch (error) {
    console.error('❌ Error creating support ticket:', error)
    return NextResponse.json(
      { error: 'Failed to create support ticket' },
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

    const supabaseService = new SupabaseService()

    // Get tickets using Supabase
    const tickets = await supabaseService.getSupportTickets({
      status,
      priority,
      companyId,
      limit
    })

    return NextResponse.json({ 
      success: true,
      tickets,
      total: tickets.length,
      timestamp: new Date().toISOString()
    })

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

    const supabaseService = new SupabaseService()

    // Update ticket with real Supabase operations
    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (assignedTo) updateData.assigned_to = assignedTo

    const updatedTicket = await supabaseService.updateSupportTicket(ticketId, updateData)

    console.log('✅ Ticket updated successfully:', ticketId)

    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully',
      ticket: updatedTicket
    })

  } catch (error) {
    console.error('❌ Error updating support ticket:', error)
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    )
  }
} 