import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'company', 'jobTitle', 'teamSize', 'industry']
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate interests array
    if (!formData.interests || !Array.isArray(formData.interests) || formData.interests.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one area of interest is required' },
        { status: 400 }
      )
    }

    console.log('📚 Content Library Access Request:', {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      company: formData.company,
      industry: formData.industry,
      teamSize: formData.teamSize,
      interests: formData.interests,
      timestamp: formData.timestamp
    })

    // In a real implementation, you would:
    // 1. Save to database
    // 2. Send notification email to sales team
    // 3. Add to CRM/marketing automation
    // 4. Send welcome email with access instructions

    // For now, we'll just log and return success
    // You could integrate with services like:
    // - Supabase for database storage
    // - SendGrid for email notifications
    // - HubSpot/Salesforce for CRM
    // - Intercom for customer messaging

    // Simulate email notification (replace with real email service)
    try {
      const emailResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/notifications/content-library-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'content_library_access',
          data: formData,
          timestamp: new Date().toISOString()
        }),
      })

      if (!emailResponse.ok) {
        console.warn('Failed to send notification email, but access request was successful')
      }
    } catch (emailError) {
      console.warn('Email notification error:', emailError)
      // Don't fail the main request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Content library access granted successfully',
      data: {
        accessGranted: true,
        librarySize: 312,
        industries: 8,
        welcomeMessage: `Welcome ${formData.firstName}! You now have access to our premium content library.`
      }
    })

  } catch (error: any) {
    console.error('Content library access error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process access request. Please try again.' 
      },
      { status: 500 }
    )
  }
}
