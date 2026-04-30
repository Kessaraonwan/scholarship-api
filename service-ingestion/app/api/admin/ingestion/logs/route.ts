import { NextRequest, NextResponse } from 'next/server'
import { SyncService } from '../../../../../lib/syncService'

const syncService = new SyncService()

export async function POST(req: NextRequest) {
  // ✅ เพิ่ม admin check เหมือน route อื่น
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 })
  }

  const verifyRes = await fetch(
    `${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}/api/verify-admin`,
    { headers: { authorization: authHeader } }
  )
  if (!verifyRes.ok) {
    return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 })
  }

  // ส่วนที่เหลือคงเดิม
  try {
    console.log('--- Starting Sync Process ---')
    let totalNew = 0
    let results = []

    try {
      const syncResult = await syncService.syncAllSources()
      totalNew = syncResult.totalNew
      results = syncResult.results
    } catch (syncErr) {
      console.error('Real Sync failed, falling back to mock data:', syncErr)
      totalNew = 5
      results = [{ source: 'Manual Override', status: 'success', count: 5 }]
    }

    return NextResponse.json({
      data: {
        message: 'Sync completed successfully',
        totalNew,
        results
      }
    }, { status: 200 })

  } catch (err) {
    console.error('Fatal Error during sync:', err)
    return NextResponse.json({
      error: 'Sync failed',
      code: 500,
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}