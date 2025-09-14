import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      SMTP_HOST: process.env.SMTP_HOST ? '✅ SET' : '❌ MISSING',
      SMTP_PORT: process.env.SMTP_PORT ? '✅ SET' : '❌ MISSING',
      SMTP_USER: process.env.SMTP_USER ? '✅ SET' : '❌ MISSING',
      SMTP_PASS: process.env.SMTP_PASS ? '✅ SET (length: ' + (process.env.SMTP_PASS?.length || 0) + ')' : '❌ MISSING',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL ? '✅ SET' : '❌ MISSING',
      
      // Check for alternative names
      GMAIL_USER: process.env.GMAIL_USER ? '✅ SET' : '❌ NOT SET',
      GMAIL_PASS: process.env.GMAIL_PASS ? '✅ SET' : '❌ NOT SET',
      EMAIL_USER: process.env.EMAIL_USER ? '✅ SET' : '❌ NOT SET',
      EMAIL_PASS: process.env.EMAIL_PASS ? '✅ SET' : '❌ NOT SET',
    }

    // List all environment variables that contain 'mail', 'smtp', or 'email'
    const allEnvVars = Object.keys(process.env).filter(key => 
      key.toLowerCase().includes('mail') || 
      key.toLowerCase().includes('smtp') || 
      key.toLowerCase().includes('email')
    )

    return NextResponse.json({
      status: 'Email Debug Info',
      environmentVariables: envCheck,
      foundEmailRelatedVars: allEnvVars,
      recommendation: envCheck.SMTP_USER === '❌ MISSING' ? 
        'SMTP_USER and SMTP_PASS are missing. Add these to Railway environment variables.' :
        'Environment variables look good!',
      instructions: {
        SMTP_HOST: 'smtp.gmail.com',
        SMTP_PORT: '587',
        SMTP_USER: 'admin@tutoralearn.com',
        SMTP_PASS: 'your-16-character-app-password',
        ADMIN_EMAIL: 'admin@tutoralearn.com'
      }
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
