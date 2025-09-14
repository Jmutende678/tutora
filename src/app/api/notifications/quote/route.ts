import { NextRequest, NextResponse } from 'next/server'
import { googleEmailService } from '@/lib/google-email-service'
import { simpleEmailService } from '@/lib/simple-email-service'

export async function POST(request: NextRequest) {
  try {
    const quoteData = await request.json()

    // Send email notification about quote request (try Google first, fallback to SMTP)
    try {
      if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CLIENT_EMAIL) {
        await googleEmailService.sendQuoteRequestNotification(quoteData)
        console.log('📧 Google quote notification sent')
      } else {
        // Use simple email service for quote requests
        await simpleEmailService.sendContactFormNotification({
          name: quoteData.name,
          email: quoteData.email,
          company: quoteData.company,
          phone: quoteData.phone,
          subject: `Quote Request from ${quoteData.company}`,
          message: `Quote request details:\n\nTeam Size: ${quoteData.teamSize}\nPlan Interest: ${quoteData.planInterest}\nRequirements: ${quoteData.requirements}`,
          inquiryType: 'quote'
        })
        console.log('📧 Simple quote notification sent')
      }
    } catch (emailError) {
      console.error('⚠️ Quote email notification failed:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Quote request notification sent successfully'
    })

  } catch (error) {
    console.error('❌ Error sending quote notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
