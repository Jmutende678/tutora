import { NextRequest, NextResponse } from 'next/server'
import { googleEmailService } from '@/lib/google-email-service'
import { simpleEmailService } from '@/lib/simple-email-service'

export async function POST(request: NextRequest) {
  try {
    const { moduleData, userEmail } = await request.json()

    // Send email notification about AI module creation (try Google first, fallback to SMTP)
    try {
      if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CLIENT_EMAIL) {
        await googleEmailService.sendAIModuleNotification(moduleData, userEmail)
        console.log('📧 Google AI module notification sent')
      } else {
        await simpleEmailService.sendAIModuleNotification(moduleData, userEmail)
        console.log('📧 Simple AI module notification sent')
      }
    } catch (emailError) {
      console.error('⚠️ Email notification failed:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'AI module notification sent successfully'
    })

  } catch (error) {
    console.error('❌ Error sending AI module notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
