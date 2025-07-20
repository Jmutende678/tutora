import { NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'

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
      const emailSent = await emailService.sendSalesNotification('DEMO_USAGE', {
        type: `AI Demo ${demoData.action === 'demo_started' ? 'Started' : 'Completed'}`,
        name: demoData.name,
        email: demoData.email,
        company: demoData.company || 'Not provided',
        phone: demoData.phone || 'Not provided',
        fileName: demoData.fileName,
        fileType: demoData.fileType,
        action: demoData.action,
        moduleTitle: demoData.moduleTitle || 'N/A',
        timestamp: new Date().toISOString(),
        source: 'AI Module Builder Demo',
        engagement: demoData.action === 'demo_completed' ? 'High - Completed Demo' : 'Medium - Started Demo'
      })

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