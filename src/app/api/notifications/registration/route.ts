import { NextRequest, NextResponse } from 'next/server'
import { googleEmailService } from '@/lib/google-email-service'
import { simpleEmailService } from '@/lib/simple-email-service'

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Send email notification about new user registration (try Google first, fallback to SMTP)
    try {
      if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CLIENT_EMAIL) {
        await googleEmailService.sendRegistrationNotification(userData)
        console.log('📧 Google registration notification sent')
      } else {
        await simpleEmailService.sendRegistrationNotification(userData)
        console.log('📧 Simple registration notification sent')
      }
    } catch (emailError) {
      console.error('⚠️ Registration email notification failed:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Registration notification sent successfully'
    })

  } catch (error) {
    console.error('❌ Error sending registration notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
