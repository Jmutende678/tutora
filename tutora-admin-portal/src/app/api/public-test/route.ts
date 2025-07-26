import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Public API endpoint working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Public POST endpoint working',
    timestamp: new Date().toISOString()
  })
} 