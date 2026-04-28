import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      service: 'service-analytics',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
    { status: 200 }
  )
}

