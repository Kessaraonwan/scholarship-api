import { NextRequest, NextResponse } from 'next/server'
import { PrismaIngestionService } from '../../../../lib/prismaIngestionService'

const ingestionService = new PrismaIngestionService()

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 })
  }

  try {
    // Verify with service-auth
    const verifyRes = await fetch(`${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}/api/verify-admin`, {
      headers: { authorization: authHeader }
    })

    if (!verifyRes.ok) {
      return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 })
    }

    // Get latest ingestion log
    const latestLog = await ingestionService.getLatestLog()

    return NextResponse.json({ data: latestLog })

  } catch (err) {
    console.error('Error in ingestion status:', err)
    return NextResponse.json({ error: 'Server Error', code: 500 }, { status: 500 })
  }
}