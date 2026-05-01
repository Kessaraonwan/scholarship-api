import { NextRequest, NextResponse } from 'next/server'
import { ingestionService } from '../../../../../lib/prismaIngestionService'

/**
 * POST /api/admin/ingestion/sync
 * Lightweight admin-triggered sync for development:
 * - creates an ingestion log
 * - saves a small batch of sample scholarships via Prisma ingestion service
 * - updates the log with the results
 */
export async function POST(request: NextRequest) {
  try {
    const source = 'manual_admin_sync'

    // create log
    const logId = await ingestionService.createLog(source)

    // sample scholarships (simple payload to create >0 new records)
    const sample = [
      {
        name: `Manual Sync Sample ${Date.now()}`,
        level: 'ปริญญาตรี',
        field: 'General',
        country: 'Thailand',
        deadline: new Date().toISOString(),
        amount: 0,
        currency: 'THB',
        url: `https://example.local/manual-sync-${Date.now()}`,
        source,
        description: 'Triggered by admin Run Sync (dev)'
      }
    ]

    const results = await ingestionService.saveScholarships(sample)

    // saveScholarships returns { created, updated, failed }
    const created = results.created ?? 0
    const updated = results.updated ?? 0

    await ingestionService.updateLog(logId, 'success', created, updated, null)

    return NextResponse.json({ success: true, created, updated, logId })
  } catch (err) {
    console.error('Admin sync error:', err)
    return NextResponse.json({ success: false, error: 'Sync failed' }, { status: 500 })
  }
}
