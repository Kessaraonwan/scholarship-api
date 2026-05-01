import { NextRequest, NextResponse } from 'next/server'
import { IngestionService } from '../../../../../lib/ingestionService'

const ingestionService = new IngestionService()

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const page = Number(url.searchParams.get('page') || '1')
    const limit = Number(url.searchParams.get('limit') || '10')

    const { logs, total } = await ingestionService.getLogs(page, limit)

    return NextResponse.json({
      data: logs.map((log) => ({
        id: log.id,
        source: log.source,
        status: log.status,
        recordsFound: (log.countNew || 0) + (log.countUpdated || 0),
        recordsNew: log.countNew || 0,
        startedAt: log.startedAt,
        completedAt: log.finishedAt,
      })),
      meta: { total, page, limit },
    })
  } catch (err) {
    console.error('Error loading ingestion logs:', err)
    return NextResponse.json({ error: 'Server Error', code: 500 }, { status: 500 })
  }
}