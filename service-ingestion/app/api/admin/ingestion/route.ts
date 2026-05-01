import { NextRequest, NextResponse } from 'next/server'
import pool from '../../../../lib/db'
import { IngestionService } from '../../../../lib/ingestionService'

const ingestionService = new IngestionService()

export async function GET(_req: NextRequest) {
  try {
    const [latestLog, totalScholarships] = await Promise.all([
      ingestionService.getLatestLog(),
      pool.query('SELECT COUNT(*)::int AS count FROM "Scholarship"'),
    ])

    return NextResponse.json({
      data: {
        latestLog,
        totalScholarships: totalScholarships.rows[0]?.count ?? 0,
      },
    })
  } catch (err) {
    console.error('Error in ingestion status:', err)
    return NextResponse.json({ error: 'Server Error', code: 500 }, { status: 500 })
  }
}