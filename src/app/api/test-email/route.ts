import { NextRequest, NextResponse } from 'next/server'
import { simpleEmailService } from '@/lib/simple-email-service'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing email system...')
    
    // Test contact form notification
    const testFormData = {
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company',
      phone: '+1 555-123-4567',
      inquiryType: 'demo',
      subject: 'Email System Test',
      message: 'This is a test message to verify the email system is working correctly. If you receive this, your email notifications are set up properly!'
    }

    const success = await simpleEmailService.sendContactFormNotification(testFormData)
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully! Check admin@tutoralearn.com',
        emailSent: true,
        testData: testFormData
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email system not configured - check Railway logs for console output',
        emailSent: false,
        note: 'This is normal if SMTP credentials are not set up yet'
      })
    }

  } catch (error) {
    console.error('❌ Email test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Email test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type = 'contact' } = await request.json()
    
    if (type === 'ai-module') {
      // Test AI module notification
      const testModuleData = {
        title: 'Test AI Training Module',
        description: 'This is a test AI-generated module to verify notifications',
        industry: 'Technology',
        difficulty: 'intermediate',
        estimatedDuration: 15,
        totalComponents: 3
      }
      
      await simpleEmailService.sendAIModuleNotification(testModuleData, 'test-user@example.com')
      
      return NextResponse.json({
        success: true,
        message: 'AI module test email sent!',
        type: 'ai-module'
      })
    }
    
    // Default to contact form test
    return NextResponse.redirect(new URL('/api/test-email', request.url))
    
  } catch (error) {
    console.error('❌ Email test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Email test failed'
    }, { status: 500 })
  }
}
