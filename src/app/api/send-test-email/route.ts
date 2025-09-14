import { NextRequest, NextResponse } from 'next/server'
import { simpleEmailService } from '@/lib/simple-email-service'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing email system...')
    
    // Test email data
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company',
      phone: '+1 555-123-4567',
      subject: 'Email System Test',
      message: 'This is a test to verify the email system is working correctly.',
      inquiryType: 'test'
    }

    console.log('📧 Attempting to send test email...')
    
    // Try to send email
    const success = await simpleEmailService.sendContactFormNotification(testData)
    
    if (success) {
      return NextResponse.json({
        status: 'SUCCESS',
        message: 'Test email sent successfully!',
        recipient: 'admin@tutoralearn.com',
        testData: testData,
        note: 'Check your email inbox for the test message.'
      })
    } else {
      return NextResponse.json({
        status: 'FAILED',
        message: 'Email sending failed - check Railway logs for details',
        note: 'This usually means SMTP credentials are not configured correctly.'
      })
    }

  } catch (error) {
    console.error('❌ Email test error:', error)
    return NextResponse.json({
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Email test failed with error'
    }, { status: 500 })
  }
}
