import { NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'
import { simpleEmailService } from '@/lib/simple-email-service'

export async function POST(request: Request) {
  try {
    const demoData = await request.json()
    
    // Validate required fields
    if (!demoData.name || !demoData.email || !demoData.action) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, action' },
        { status: 400 }
      )
    }

    // Send demo notification based on action type
    if (demoData.action === 'demo_started' || demoData.action === 'demo_completed') {
      console.log(`📈 Demo ${demoData.action} by ${demoData.name} (${demoData.email})`)
      
      let emailSent = false
      try {
        const actionText = demoData.action === 'demo_started' ? 'STARTED' : 'COMPLETED'
        const urgencyLevel = demoData.action === 'demo_completed' ? '🔥 HOT LEAD' : '🎯 WARM LEAD'
        
        await simpleEmailService.sendContactFormNotification({
          name: demoData.name,
          email: demoData.email,
          company: demoData.company || 'Not provided',
          phone: demoData.phone || 'Not provided',
          subject: `${urgencyLevel}: AI Demo ${actionText} by ${demoData.name}`,
          message: `AI Module Builder Demo Activity:

Action: ${actionText}
File Uploaded: ${demoData.fileName || 'N/A'}
File Type: ${demoData.fileType || 'N/A'}
Generated Module: ${demoData.moduleTitle || 'N/A'}

Engagement Level: ${demoData.action === 'demo_completed' ? 'HIGH - Completed full demo' : 'MEDIUM - Started demo'}

${demoData.action === 'demo_completed' ? '🔥 This is a HOT LEAD! They completed the entire demo process.' : '🎯 This user started the demo - follow up to help them complete it.'}

Follow up within 24 hours for best conversion!`,
          inquiryType: 'demo'
        })
        emailSent = true
      } catch (emailError) {
        console.error('Failed to send demo usage email:', emailError)
        emailSent = false
      }

      if (emailSent) {
        const actionText = demoData.action === 'demo_started' ? 'DEMO STARTED' : 'DEMO COMPLETED'
        console.log(`🔥 ${actionText} - Email sent to sales@tutoralearn.com`)
        console.log('User:', demoData.name)
        console.log('Email:', demoData.email)
        console.log('Company:', demoData.company)
        console.log('File:', demoData.fileName)
        if (demoData.moduleTitle) {
          console.log('Generated Module:', demoData.moduleTitle)
        }
        
        return NextResponse.json({ 
          success: true, 
          message: 'Demo notification sent successfully!' 
        })
      } else {
        console.error('❌ Failed to send demo usage email notification')
        
        // Still return success to user
        return NextResponse.json({ 
          success: true, 
          message: 'Demo processed successfully!' 
        })
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid action type. Must be demo_started or demo_completed' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('❌ Error processing demo usage notification:', error)
    
    return NextResponse.json(
      { error: 'Failed to process demo notification' },
      { status: 500 }
    )
  }
} 