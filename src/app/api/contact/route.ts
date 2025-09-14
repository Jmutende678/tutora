import { NextRequest, NextResponse } from 'next/server'
import { simpleEmailService } from '@/lib/simple-email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields for contact form
    const requiredFields = ['name', 'email', 'subject', 'message']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    console.log('📧 Contact form submission received:', body.name, body.email)

    // Send email notification directly (no database dependency)
    try {
      await simpleEmailService.sendContactFormNotification(body)
      console.log('✅ Contact form email sent successfully')
    } catch (emailError) {
      console.error('⚠️ Failed to send contact email:', emailError)
      // Don't fail the request if email fails - still return success
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully! We\'ll get back to you within 24 hours.'
    })

  } catch (error) {
    console.error('❌ Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}
